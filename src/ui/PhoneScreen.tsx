import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { chapters } from '../content'
import { scrollToChapter } from '../lib/scroll'
import { getUI, setUI, useUI } from '../lib/store'
import { getScreenHost } from '../scene/screenHost'

type ScreenState = 'off' | 'hello' | 'tag' | 'enter' | 'home'

/** Renders the phone's screen UI into the element the 3D phone projects. */
export function PhoneScreenPortal({ reduced }: { reduced: boolean }) {
  const introDone = useUI((s) => s.introDone)
  const entered = useUI((s) => s.entered)
  const [boot, setBoot] = useState<ScreenState>('off')
  const state: ScreenState = entered ? 'home' : boot

  useEffect(() => {
    if (!introDone || getUI().entered) return
    const steps: [ScreenState, number][] = reduced
      ? [['enter', 0]]
      : [
          ['hello', 0],
          ['tag', 1400],
          ['enter', 2900],
        ]
    const ids = steps.map(([s, ms]) => window.setTimeout(() => setBoot(s), ms))
    return () => ids.forEach(clearTimeout)
  }, [introDone, reduced])

  return createPortal(<PhoneScreen state={state} />, getScreenHost())
}

const apps: { id: string; label: string; glyph: string; color: string }[] = [
  { id: 'unioffice', label: 'UNIOFFICE', glyph: 'grid', color: '#d7ff4a' },
  { id: 'orcades', label: 'ORCADES', glyph: 'orbit', color: '#ff5fd2' },
  { id: 'simulator', label: 'Simulator', glyph: 'bars', color: '#ffb42e' },
  { id: 'vinacou', label: 'Vinacou', glyph: 'waves', color: '#d9a86c' },
  { id: 'nymeria', label: 'NYMERIA', glyph: 'trophy', color: '#ffd27a' },
  { id: 'mhmun', label: 'Events', glyph: 'crowd', color: '#ff7a59' },
  { id: 'journey', label: 'Journey', glyph: 'path', color: '#efe9dd' },
  { id: 'about', label: 'About', glyph: 'me', color: '#efe9dd' },
  { id: 'contact', label: 'Contact', glyph: 'mail', color: '#ff5a1f' },
]

function Glyph({ kind }: { kind: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'grid':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" />
        </svg>
      )
    case 'orbit':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      )
    case 'bars':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M5 20V13M10 20V8M15 20v-5M20 20V4" />
        </svg>
      )
    case 'waves':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M4 9v6M8 6v12M12 3v18M16 6v12M20 9v6" />
        </svg>
      )
    case 'trophy':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M9.5 17h5" />
        </svg>
      )
    case 'crowd':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="7" cy="9" r="2" />
          <circle cx="12" cy="7" r="2" />
          <circle cx="17" cy="9" r="2" />
          <path d="M3.5 18a3.5 3.5 0 0 1 7 0M8.5 16a3.5 3.5 0 0 1 7 0M13.5 18a3.5 3.5 0 0 1 7 0" />
        </svg>
      )
    case 'path':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="6" r="2" />
          <path d="M7 18h6a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h6" />
        </svg>
      )
    case 'me':
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" {...p}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
  }
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
}

function PhoneScreen({ state }: { state: ScreenState }) {
  const clock = useClock()
  const interactive = state === 'enter' || state === 'home'
  return (
    <div className="ps" aria-hidden={!interactive}>
      <div className="ps-status mono">
        <span>{clock} IST</span>
        <span className="ps-island" />
        <span>MS·OS</span>
      </div>

      <div className="ps-stage">
        <div className="ps-boot" data-on={state === 'hello'}>
          <span className="mono ps-dim">Hello.</span>
          <span className="ps-name">MADHAVAN</span>
        </div>
        <div className="ps-boot" data-on={state === 'tag'}>
          <span className="ps-tag">
            I build
            <br />
            <em className="serif">things.</em>
          </span>
        </div>
        <div className="ps-boot" data-on={state === 'enter'}>
          <button
            type="button"
            className="ps-enter"
            tabIndex={state === 'enter' ? 0 : -1}
            onClick={() => setUI({ entered: true })}
            aria-label="Enter Madhavan's digital universe"
          >
            <span className="ps-enter-ring" />
            <span className="mono">Enter</span>
          </button>
          <span className="mono ps-dim ps-hint">or scroll</span>
        </div>

        <nav className="ps-home" data-on={state === 'home'} aria-label="Phone apps">
          <p className="ps-greet">
            <span className="mono ps-dim">Madhavan Sahu</span>
            <span className="ps-greet-big">
              Pick an app, <em className="serif">or dive in.</em>
            </span>
          </p>
          <ul className="ps-grid">
            {apps.map((a, i) => (
              <li key={a.id} style={{ '--i': i } as CSSProperties}>
                <button
                  type="button"
                  tabIndex={state === 'home' ? 0 : -1}
                  onClick={() => scrollToChapter(a.id)}
                  aria-label={`Go to ${chapters.find((c) => c.id === a.id)?.label ?? a.label}`}
                >
                  <span className="ps-icon" style={{ color: a.color }}>
                    <Glyph kind={a.glyph} />
                  </span>
                  <span className="ps-label">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="ps-dock mono" tabIndex={state === 'home' ? 0 : -1} onClick={() => scrollToChapter('about')}>
            <span>Dive in</span>
            <span aria-hidden>↓</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
