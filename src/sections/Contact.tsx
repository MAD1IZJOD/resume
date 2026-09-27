import { useCallback, useRef, useState } from 'react'
import { person } from '../content'
import { localT } from '../lib/chapterProgress'
import { story } from '../lib/store'
import { useStoryFrame } from '../lib/useStoryFrame'

const mailto = `mailto:${person.email}?subject=${encodeURIComponent("Let's build something")}`

/**
 * The ending: the world collapses back into the object it came from,
 * then two lines, then the one action that matters.
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const a = useRef<HTMLParagraphElement>(null)
  const b = useRef<HTMLParagraphElement>(null)
  const cta = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const onFrame = useCallback((t: number) => {
    const l = localT(t, 'contact')
    const band = (x: number, from: number, to: number, fade = 0.06) => Math.min(1, Math.max(0, Math.min((x - from) / fade, (to - x) / fade)))
    const setPhase = (el: HTMLElement | null, o: number, hide = true) => {
      if (!el) return
      el.style.opacity = String(o)
      el.style.transform = `translateY(${(1 - o) * 24}px)`
      // the CTA stays focusable (see :focus-within in CSS) so keyboard users can always reach it
      if (hide) el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
    }
    setPhase(a.current, band(l, 0.26, 0.43))
    setPhase(b.current, band(l, 0.45, 0.58))
    const c = Math.min(1, Math.max(0, (l - 0.58) / 0.06))
    setPhase(cta.current, c, false)
  }, [])
  useStoryFrame(ref, onFrame)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = mailto
    }
  }

  return (
    <section ref={ref} id="contact" data-chapter="contact" className="chapter contact" aria-labelledby="contact-title">
      <div className="sticky contact-inner">
        <p ref={a} className="contact-line display">
          That’s what I’ve built <em className="serif">so far.</em>
        </p>
        <p ref={b} className="contact-line display">
          Now let’s build something <em className="serif">for you.</em>
        </p>

        <div ref={cta} className="contact-cta">
          <h2 id="contact-title" className="sr-only">
            Contact
          </h2>
          <a
            className="contact-start"
            href={mailto}
            onMouseEnter={() => (story.pulse = 1)}
            onFocus={() => (story.pulse = 1)}
          >
            <span className="contact-start-label">Start a project</span>
            <span className="contact-start-arrow" aria-hidden>
              →
            </span>
          </a>
          <div className="contact-row">
            <button type="button" className="contact-email" onClick={copy} aria-live="polite">
              <span className="mono">{copied ? 'Copied to clipboard' : 'Email · click to copy'}</span>
              <span className="contact-email-addr">{person.email}</span>
            </button>
            <nav className="contact-links" aria-label="Elsewhere">
              <a className="btn" href={person.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <span className="arrow" aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a className="btn" href={person.github} target="_blank" rel="noopener noreferrer">
                GitHub <span className="arrow" aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </nav>
          </div>
          <footer className="contact-foot mono">
            <span>© {new Date().getFullYear()} {person.name}</span>
            <span>Jhansi → Gurugram → wherever you are</span>
            <span>React · Three.js · GSAP</span>
          </footer>
        </div>
      </div>
    </section>
  )
}
