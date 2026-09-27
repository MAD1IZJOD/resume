import { useCallback, useRef } from 'react'
import { hackathon, mhmun } from '../content'
import { mhmunFill, SEATS } from '../lib/chapterProgress'
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
            <span>Achievement</span>
            <span className="event-rule" aria-hidden />
            <span>
              {hackathon.org} · {hackathon.chapter}
            </span>
          </p>
          <h2 id="nymeria-title" className="display nymeria-title">
            <Lines text={hackathon.team} />
          </h2>
          <p className="nymeria-result" data-reveal>
            <span className="serif">{hackathon.result}.</span>
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
              <dt className="mono">My part</dt>
              <dd>All of the technical work</dd>
            </div>
          </dl>
          <p className="project-proves" data-reveal style={{ ['--accent' as string]: '#ffd27a' }}>
            <span className="mono">What it proves</span>
            <span className="serif">I execute technically — on a hackathon clock.</span>
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
          <span>Event · {mhmun.year}</span>
          <span>{mhmun.venue}</span>
        </p>
        <div className="mhmun-count" aria-hidden>
          <span ref={num} className="mhmun-num">
            0
          </span>
          <span className="mhmun-plus">+</span>
        </div>
        <p className="mono mhmun-unit" aria-hidden>
          students in the room · every figure here is one of them
        </p>
        <div ref={title} className="mhmun-title" data-full="false">
          <h2 id="mhmun-title" className="display">
            {mhmun.name}
          </h2>
          <p className="mhmun-role">
            <span className="serif">{mhmun.role}</span>
          </p>
          <p className="mhmun-note">
            {mhmun.attendees}+ students. {mhmun.note}
          </p>
        </div>
      </div>
    </section>
  )
}
