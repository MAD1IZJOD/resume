import { useEffect } from 'react'
import type { RefObject } from 'react'
import { prefersReducedMotion } from './env'
import { gsap, ScrollTrigger } from './scroll'

/**
 * Reveals `[data-reveal]` children of a chapter when it scrolls into view:
 * masked lines slide up, everything else fades/lifts. Reverses on the way back
 * so scrolling up feels as considered as scrolling down.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, opts: { start?: string; end?: string } = {}) {
  const { start = 'top 55%', end = 'bottom 20%' } = opts
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lines = el.querySelectorAll<HTMLElement>('.line-mask > span')
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 110 })
      gsap.set(items, { autoAlpha: 0, y: 24 })
      const tl = gsap.timeline({ paused: true })
      tl.to(lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0)
      tl.to(items, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06 }, 0.15)
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onEnter: () => tl.timeScale(1).play(),
        onEnterBack: () => tl.timeScale(1).play(),
        onLeave: () => tl.timeScale(2).reverse(),
        onLeaveBack: () => tl.timeScale(2).reverse(),
      })
    }, el)
    return () => ctx.revert()
  }, [ref, start, end])
}
