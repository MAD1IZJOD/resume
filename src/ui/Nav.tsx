import { useCallback, useEffect, useRef } from 'react'
import { chapters, person } from '../content'
import { lockScroll, scrollToChapter } from '../lib/scroll'
import { setUI, story, useUI } from '../lib/store'

const visible = chapters.filter((c) => !('hidden' in c && c.hidden))
const groups = ['Home', 'About', 'Work', 'Experience', 'Services', 'Contact'] as const

/**
 * A small floating control instead of a navbar: where you are, how far
 * you've come, and an index that can take you anywhere.
 */
export function Nav() {
  const chapter = useUI((s) => s.chapter)
  const open = useUI((s) => s.menuOpen)
  const introDone = useUI((s) => s.introDone)
  const ring = useRef<SVGCircleElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const current = chapters[chapter] ?? chapters[0]
  const displayIndex = Math.max(0, visible.findIndex((c) => c.id === current.id))

  // progress ring, updated outside React
  useEffect(() => {
    let raf = 0
    const C = 2 * Math.PI * 17
    const loop = () => {
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - story.progress))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const close = useCallback(() => {
    setUI({ menuOpen: false })
    toggle.current?.focus()
  }, [])

  useEffect(() => {
    if (!introDone) return
    lockScroll(open)
  }, [open, introDone])

  // focus management + Esc + simple focus trap
  useEffect(() => {
    if (!open) return
    const d = dialog.current
    d?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab' || !d) return
      const f = d.querySelectorAll<HTMLElement>('a, button')
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const go = (id: string) => {
    setUI({ menuOpen: false })
    // let the overlay start closing before the long scroll begins
    window.setTimeout(() => scrollToChapter(id), 120)
  }

  return (
    <>
      <div className="nav" data-show={introDone} data-open={open} data-hero={chapter === 0}>
        <a
          className="nav-mark"
          href="#hello"
          aria-label={`${person.name} — back to the start`}
          onClick={(e) => {
            e.preventDefault()
            go('hello')
          }}
        >
          <svg viewBox="0 0 40 40" aria-hidden>
            <path d="M20 4 34 12v16L20 36 6 28V12z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
          </svg>
        </a>
        <button
          ref={toggle}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-index"
          onClick={() => setUI({ menuOpen: !open })}
        >
          <span className="nav-now">
            <span className="mono nav-num">{String(displayIndex).padStart(2, '0')}</span>
            <span key={current.id} className="nav-label">
              {current.label}
            </span>
          </span>
          <span className="nav-ring" aria-hidden>
            <svg viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" className="nav-ring-bg" />
              <circle ref={ring} cx="20" cy="20" r="17" className="nav-ring-fg" strokeDasharray={2 * Math.PI * 17} />
            </svg>
            <span className="nav-burger">
              <i />
              <i />
            </span>
          </span>
          <span className="sr-only">{open ? 'Close the index' : 'Open the index'}</span>
        </button>
      </div>

      <div
        ref={dialog}
        id="site-index"
        className="index"
        role="dialog"
        aria-modal="true"
        aria-label="Site index"
        data-open={open}
        hidden={!open}
      >
        <div className="index-inner">
          <p className="mono index-kicker">Index · jump anywhere</p>
          <nav className="index-groups" aria-label="Chapters">
            {groups.map((g) => {
              const items = visible.filter((c) => c.group === g)
              return (
                <div key={g} className="index-group">
                  <p className="mono index-group-name">{g}</p>
                  <ul>
                    {items.map((c) => {
                      const n = visible.findIndex((v) => v.id === c.id)
                      return (
                        <li key={c.id}>
                          <a
                            href={`#${c.id}`}
                            aria-current={c.id === current.id ? 'location' : undefined}
                            onClick={(e) => {
                              e.preventDefault()
                              go(c.id)
                            }}
                          >
                            <span className="mono">{String(n).padStart(2, '0')}</span>
                            <span>{c.label}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>
          <div className="index-foot">
            <a className="btn btn--solid" href={`mailto:${person.email}`} style={{ ['--c' as string]: 'var(--ember)' }}>
              {person.email}
            </a>
            <a className="btn" href={person.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗<span className="sr-only">(opens in a new tab)</span>
            </a>
            <a className="btn" href={person.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗<span className="sr-only">(opens in a new tab)</span>
            </a>
            <button type="button" className="btn index-close" onClick={close}>
              Close <span aria-hidden>esc</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
