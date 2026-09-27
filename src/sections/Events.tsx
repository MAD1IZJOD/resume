import type { CSSProperties } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { copy, hackathon, hackfest, mhmun } from '../content'
import { localT, mhmunFill, SEATS } from '../lib/chapterProgress'
import { story } from '../lib/store'
import { useStoryFrame } from '../lib/useStoryFrame'
import { useReveal } from '../lib/useReveal'
import { Lines } from './Projects'

export function Nymeria() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="nymeria" data-chapter="nymeria" className="chapter event nymeria" aria-labelledby="nymeria-title">
      <div className="sticky">
        <div className="event-card event-card--left">
          <p className="mono event-kicker" data-reveal>
            <span>{copy.nymeria.kicker}</span>
            <span className="event-rule" aria-hidden />
            <span>
              {hackathon.org} · {hackathon.chapter}
            </span>
          </p>
          <h2 id="nymeria-title" className="display nymeria-title">
            <Lines text={hackathon.team} />
          </h2>
          <p className="nymeria-result" data-reveal>
            <span className="serif">{copy.nymeria.result}</span>
            <span className="mono">
              {hackathon.org} {hackathon.chapter} {hackathon.event}
            </span>
          </p>
          <dl className="event-facts" data-reveal>
            <div>
              <dt className="mono">Team</dt>
              <dd>{hackathon.team}</dd>
            </div>
            <div>
              <dt className="mono">Result</dt>
              <dd>{hackathon.result}</dd>
            </div>
            <div>
              <dt className="mono">{copy.nymeria.partLabel}</dt>
              <dd>{copy.nymeria.part}</dd>
            </div>
          </dl>
          <p className="project-proves" data-reveal style={{ ['--accent' as string]: '#ffd27a' }}>
            <span className="mono">{copy.project.provesLabel}</span>
            <span className="serif">{copy.nymeria.line}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export function Mhmun() {
  const ref = useRef<HTMLElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const title = useRef<HTMLDivElement>(null)
  useReveal(ref, { start: 'top 40%' })

  const onFrame = useCallback((t: number) => {
    const f = mhmunFill(t)
    const e = 1 - Math.pow(1 - f, 2)
    if (num.current) num.current.textContent = String(Math.round(e * SEATS))
    if (title.current) title.current.dataset.full = String(f >= 0.999)
  }, [])
  useStoryFrame(ref, onFrame)

  return (
    <section ref={ref} id="mhmun" data-chapter="mhmun" className="chapter event mhmun" aria-labelledby="mhmun-title">
      <div className="sticky mhmun-inner">
        <p className="mono mhmun-top" data-reveal>
          <span>
            {copy.mhmun.kicker} · {mhmun.year}
          </span>
          <span>{mhmun.venue}</span>
        </p>
        <div className="mhmun-count" aria-hidden>
          <span ref={num} className="mhmun-num">
            0
          </span>
          <span className="mhmun-plus">+</span>
        </div>
        <p className="mono mhmun-unit" aria-hidden>
          {copy.mhmun.unit}
        </p>
        <div ref={title} className="mhmun-title" data-full="false">
          <h2 id="mhmun-title" className="display">
            {mhmun.name}
          </h2>
          <p className="mhmun-role">
            <span className="serif">{mhmun.role}</span>
          </p>
          <p className="mhmun-note">
            {mhmun.story} {mhmun.note}
          </p>
        </div>
      </div>
    </section>
  )
}

export function Hackfest() {
  const ref = useRef<HTMLElement>(null)
  const [track, setTrack] = useState(0)
  const picked = useRef(false)
  useReveal(ref)

  // scrolling walks through the tracks, unless the visitor has picked one
  const onFrame = useCallback((t: number) => {
    const local = localT(t, 'hackfest')
    if (local < -0.3 || local > 1) {
      picked.current = false
      return
    }
    if (picked.current) return
    const next = Math.min(2, Math.max(0, Math.floor((local - 0.05) / 0.2)))
    setTrack((cur) => (cur === next ? cur : next))
  }, [])
  useStoryFrame(ref, onFrame)

  useEffect(() => {
    story.track = track
  }, [track])

  const tabBase = useId()
  const current = hackfest.tracks[track]

  return (
    <section
      ref={ref}
      id="hackfest"
      data-chapter="hackfest"
      className="chapter event hackfest"
      style={{ '--accent': current.color } as CSSProperties}
      aria-labelledby="hackfest-title"
    >
      <div className="sticky">
        <div className="event-card event-card--left">
          <p className="mono event-kicker" data-reveal>
            <span>{copy.hackfest.kicker}</span>
            <span className="event-rule" aria-hidden />
            <span>{hackfest.venue}</span>
          </p>
          <h2 id="hackfest-title" className="display hackfest-title">
            <Lines text={['Hansraj', 'Hackfest']} />
          </h2>

          <div className="hf-tabs" role="tablist" aria-label="Hackfest tracks" data-reveal>
            {hackfest.tracks.map((tr, i) => (
              <button
                key={tr.id}
                id={`${tabBase}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={track === i}
                aria-controls={`${tabBase}-panel`}
                tabIndex={track === i ? 0 : -1}
                style={{ '--c': tr.color } as CSSProperties}
                onClick={() => {
                  picked.current = true
                  setTrack(i)
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                  const n = (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3
                  picked.current = true
                  setTrack(n)
                  document.getElementById(`${tabBase}-tab-${n}`)?.focus()
                }}
              >
                {tr.name}
              </button>
            ))}
          </div>
          <p id={`${tabBase}-panel`} role="tabpanel" aria-labelledby={`${tabBase}-tab-${track}`} className="hf-panel" data-reveal>
            <span key={current.id}>{current.line}</span>
          </p>

          <div className="hf-stats" data-reveal>
            <p>
              <span className="hf-num">{hackfest.attendees}+</span>
              <span className="mono">students</span>
            </p>
            <p>
              <span className="serif hf-role">{hackfest.role}</span>
              <span className="mono">{copy.hackfest.roleLabel}</span>
            </p>
          </div>
          <p className="project-proves" data-reveal>
            <span className="mono">{copy.project.provesLabel}</span>
            <span className="serif">{copy.hackfest.line}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
