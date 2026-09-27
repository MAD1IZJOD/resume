import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { chapters } from '../content'
import { prefersReducedMotion } from './env'
import { setUI, story } from './store'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let tops: number[] = []
let heights: number[] = []

function measure() {
  const els = document.querySelectorAll<HTMLElement>('[data-chapter]')
  tops = []
  heights = []
  els.forEach((el) => {
    const r = el.getBoundingClientRect()
    tops.push(r.top + window.scrollY)
    heights.push(r.height)
  })
}

function update() {
  const y = window.scrollY
  const n = tops.length
  if (!n) return
  let t = 0
  for (let i = 0; i < n; i++) {
    if (y >= tops[i]) {
      const f = Math.min(1, (y - tops[i]) / Math.max(1, heights[i]))
      t = i + f
    }
  }
  story.t = Math.min(t, n - 0.0001)
  const max = document.documentElement.scrollHeight - window.innerHeight
  story.progress = max > 0 ? y / max : 0

  // "current" chapter = the one covering the middle of the viewport
  const mid = y + window.innerHeight * 0.5
  let current = 0
  for (let i = 0; i < n; i++) if (mid >= tops[i]) current = i
  if (current !== lastChapter) {
    lastChapter = current
    setUI({ chapter: current })
    const id = chapters[current]?.id
    if (id && hashSync) history.replaceState(null, '', current === 0 ? location.pathname : `#${id}`)
  }
}

let lastChapter = -1
let hashSync = false

export function initScroll() {
  const reduced = prefersReducedMotion()
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  ScrollTrigger.addEventListener('refresh', () => {
    measure()
    update()
  })
  window.addEventListener('scroll', update, { passive: true })
  measure()
  update()
  requestAnimationFrame(() => ScrollTrigger.refresh())

  return () => {
    window.removeEventListener('scroll', update)
    lenis?.destroy()
    lenis = null
  }
}

/** Start writing the current chapter into the URL hash (after the intro). */
export function enableHashSync() {
  hashSync = true
}

export function scrollToChapter(id: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  if (lenis && !opts.immediate) {
    const distance = Math.abs(top - window.scrollY)
    lenis.scrollTo(top, { duration: Math.min(3.2, 1 + distance / 6000), easing: (x) => 1 - Math.pow(1 - x, 4) })
  } else {
    window.scrollTo({ top, behavior: 'auto' })
  }
  // move focus for keyboard + screen-reader users without scrolling again
  const heading = el.querySelector<HTMLElement>('h1, h2')
  if (heading) {
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export { gsap, ScrollTrigger }
