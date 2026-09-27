import { useEffect, useRef, useState } from 'react'
import { getScreenHost } from '../scene/screenHost'
import { useReveal } from '../lib/useReveal'
import { copy, person } from '../content'
import { useUI } from '../lib/store'

const roles = ['builder', 'developer', 'designer', 'product builder', 'creative technologist', 'entrepreneur', 'event organiser']

export function Hero({ webgl }: { webgl: boolean }) {
  const introDone = useUI((s) => s.introDone)
  const [role, setRole] = useState(0)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!introDone) return
    const id = window.setInterval(() => setRole((r) => (r + 1) % roles.length), 2200)
    return () => clearInterval(id)
  }, [introDone])

  return (
    <section ref={ref} id="hello" data-chapter="hello" className="chapter hero" data-ready={introDone} aria-labelledby="hero-title">
      <div className="hero-inner">
        {!webgl && <FallbackPhone />}
        <div className="hero-corner hero-tl">
          <h1 id="hero-title" className="hero-title">
            <span className="mono">Madhavan Sahu</span>
            <span className="sr-only">{copy.hero.srTagline}</span>
          </h1>
          <p className="mono hero-sub">A digital universe · Est. Jhansi</p>
        </div>

        <div className="hero-corner hero-bl" aria-live="off">
          <p className="mono hero-dim">Currently</p>
          <p className="hero-role">
            <span className="serif">a</span>{' '}
            <span key={role} className="hero-role-word">
              {roles[role]}
            </span>
          </p>
        </div>

        <div className="hero-corner hero-br">
          <a className="mono hero-link" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <p className="mono hero-dim hero-scroll">
            <span className="hero-scroll-line" aria-hidden />
            Scroll to enter
          </p>
        </div>
      </div>
    </section>
  )
}

/** Without WebGL, the phone screen lives in a plain CSS device. */
function FallbackPhone() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = getScreenHost()
    ref.current?.appendChild(host)
    host.style.opacity = '1'
    host.style.visibility = 'visible'
  }, [])
  return <div ref={ref} className="phone-fallback" />
}

export function Portal() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { start: 'top 40%' })
  return (
    <section ref={ref} id="portal" data-chapter="portal" className="chapter portal" aria-label="Entering the universe">
      <div className="sticky portal-inner">
        <p className="portal-line portal-a" data-reveal>
          <span className="mono">Step inside.</span>
        </p>
        <p className="portal-line portal-b display">
          <span className="line-mask">
            <span>Everything I’ve built</span>
          </span>
          <span className="line-mask">
            <span>
              <em className="serif">lives in here.</em>
            </span>
          </span>
        </p>
      </div>
    </section>
  )
}
