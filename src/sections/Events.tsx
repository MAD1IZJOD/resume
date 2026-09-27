import { useRef } from 'react'
import { hackathon } from '../content'
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
