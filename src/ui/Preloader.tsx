import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'

type Props = { ready: boolean; skip: boolean; onDone: () => void }

/**
 * "INITIALIZING…": counts up while fonts load and the WebGL scene boots.
 * The last 30% is only released once the scene has rendered a frame.
 */
export function Preloader({ ready, skip, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const state = useRef({ v: 0 })
  const [gone, setGone] = useState(false)
  const fontsReady = useFontsReady()
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const target = ready && fontsReady ? 100 : fontsReady ? 70 : 45
    const tween = gsap.to(state.current, {
      v: target,
      duration: skip ? 0.2 : target === 100 ? 0.9 : 1.4,
      ease: target === 100 ? 'power2.inOut' : 'power1.out',
      onUpdate: () => {
        const v = Math.round(state.current.v)
        if (num.current) num.current.textContent = String(v).padStart(3, '0')
        if (bar.current) bar.current.style.transform = `scaleX(${state.current.v / 100})`
      },
      onComplete: () => {
        if (target !== 100 || !root.current) return
        gsap
          .timeline({ onComplete: () => setGone(true) })
          .to(root.current.querySelectorAll('.pl-row'), { yPercent: -120, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.in' })
          .add(() => doneRef.current(), '-=0.1')
          .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '<')
      },
    })
    return () => {
      tween.kill()
    }
  }, [ready, fontsReady, skip])

  if (gone) return null
  return (
    <div ref={root} className="preloader" role="status" aria-live="polite">
      <div className="pl-row pl-top mono">
        <span>Madhavan Sahu</span>
        <span>A digital universe</span>
      </div>
      <div className="pl-row pl-center">
        <span className="mono pl-label">Initializing</span>
        <span ref={num} className="pl-num">
          000
        </span>
      </div>
      <div className="pl-row pl-bottom">
        <span className="pl-bar">
          <span ref={bar} />
        </span>
        <span className="mono pl-note">Scroll · click · explore</span>
      </div>
    </div>
  )
}

function useFontsReady() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    let alive = true
    const t = window.setTimeout(() => alive && setOk(true), 2500)
    document.fonts?.ready.then(() => alive && setOk(true))
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [])
  return ok
}
