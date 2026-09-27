import { useCallback, useRef } from 'react'
import { copy, timeline } from '../content'
import { journeyProgress } from '../lib/chapterProgress'
import { useReveal } from '../lib/useReveal'
import { useStoryFrame } from '../lib/useStoryFrame'
import { Lines } from './Projects'

export function Journey() {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const last = useRef(-1)
  useReveal(ref, { start: 'top 30%' })

  const onFrame = useCallback((t: number) => {
    const p = journeyProgress(t)
    const el = track.current
    if (!el) return
    const items = el.children
    const n = items.length
    // centre the active milestone: interpolate between item centres
    const k = p * (n - 1)
    const i = Math.min(n - 2, Math.floor(k))
    const f = k - i
    const a = items[i] as HTMLElement
    const b = items[i + 1] as HTMLElement
    const center = a.offsetLeft + a.offsetWidth / 2 + (b.offsetLeft + b.offsetWidth / 2 - (a.offsetLeft + a.offsetWidth / 2)) * f
    const vw = el.parentElement!.clientWidth
    el.style.transform = `translate3d(${vw * 0.5 - center}px,0,0)`
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    const active = Math.round(k)
    if (active !== last.current) {
      last.current = active
      for (let j = 0; j < n; j++) (items[j] as HTMLElement).dataset.state = j < active ? 'past' : j === active ? 'on' : 'next'
    }
  }, [])
  useStoryFrame(ref, onFrame)

  return (
    <section ref={ref} id="journey" data-chapter="journey" className="chapter journey" aria-labelledby="journey-title">
      <div className="sticky journey-inner">
        <header className="journey-head">
          <p className="mono journey-kicker" data-reveal>
            {copy.journey.kicker}
          </p>
          <h2 id="journey-title" className="display journey-title">
            <Lines text={copy.journey.title} />
          </h2>
        </header>

        <div className="journey-rail" aria-hidden>
          <span ref={bar} />
        </div>

        <div className="journey-viewport">
          <ol ref={track} className="journey-track">
            {timeline.map((m, i) => (
              <li key={i} className="milestone" data-state={i === 0 ? 'on' : 'next'}>
                <span className="mono milestone-step">
                  {String(i + 1).padStart(2, '0')} · {m.place}
                </span>
                <span className="milestone-place" aria-hidden>
                  {m.place}
                </span>
                <h3 className="milestone-title">{m.title}</h3>
                {m.stat && <p className="milestone-stat">{m.stat}</p>}
                {m.role && <p className="milestone-role serif">{m.role}</p>}
                {m.detail && <p className="milestone-detail">{m.detail}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
