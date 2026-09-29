import type { CSSProperties } from 'react'
import { useCallback, useEffect, useId, useRef } from 'react'
import { copy, hackathon, hackfest, mhmun } from '../content'
import { mhmunFill, SEATS } from '../lib/chapterProgress'
import { story } from '../lib/store'
import { useStoryFrame } from '../lib/useStoryFrame'
import { useReveal } from '../lib/useReveal'
import { useScrollTabs } from '../lib/useScrollTabs'
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

type Tab = { id: string; name: string; line: string; color: string }

export function Tabs({ label, tabs, active, onPick }: { label: string; tabs: Tab[]; active: number; onPick: (i: number) => void }) {
  const tabBase = useId()
  const current = tabs[active]
  const n = tabs.length
  return (
    <>
      <div className="hf-tabs" role="tablist" aria-label={label} data-reveal>
        {tabs.map((tr, i) => (
          <button
            key={tr.id}
            id={`${tabBase}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`${tabBase}-panel`}
            tabIndex={active === i ? 0 : -1}
            style={{ '--c': tr.color } as CSSProperties}
            onClick={() => onPick(i)}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
              const next = (i + (e.key === 'ArrowRight' ? 1 : n - 1)) % n
              onPick(next)
              document.getElementById(`${tabBase}-tab-${next}`)?.focus()
            }}
          >
            {tr.name}
          </button>
        ))}
      </div>
      <p id={`${tabBase}-panel`} role="tabpanel" aria-labelledby={`${tabBase}-tab-${active}`} className="hf-panel" data-reveal>
        <span key={current.id}>{current.line}</span>
      </p>
    </>
  )
}

export function Hackfest() {
  const ref = useRef<HTMLElement>(null)
  const [track, setTrack] = useScrollTabs(ref, 'hackfest', hackfest.tracks.length)
  useReveal(ref)

  useEffect(() => {
    story.track = track
  }, [track])

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

          <Tabs label="Hackfest tracks" tabs={hackfest.tracks} active={track} onPick={setTrack} />

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
