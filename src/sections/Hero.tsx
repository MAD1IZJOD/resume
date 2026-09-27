import { useEffect, useRef, useState } from 'react'
import { person } from '../content'
import { useUI } from '../lib/store'

const roles = ['builder', 'developer', 'designer', 'product builder', 'creative technologist', 'entrepreneur', 'event organiser']

export function Hero() {
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
        <div className="hero-corner hero-tl">
          <h1 id="hero-title" className="hero-title">
            <span className="mono">Madhavan Sahu</span>
            <span className="sr-only"> — I build things: products, software, AI systems and interactive experiences.</span>
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

export function Portal() {
  return (
    <section id="portal" data-chapter="portal" className="chapter portal" aria-label="Entering the universe">
      <div className="sticky portal-inner">
        <p className="portal-line portal-a">
          <span className="mono">Step inside.</span>
        </p>
        <p className="portal-line portal-b display">
          Everything I’ve built <em className="serif">lives in here.</em>
        </p>
      </div>
    </section>
  )
}
