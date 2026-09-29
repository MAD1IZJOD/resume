import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { copy, person, softworker } from '../content'
import { story } from '../lib/store'
import { useReveal } from '../lib/useReveal'
import { useScrollTabs } from '../lib/useScrollTabs'
import { Tabs } from './Events'
import { ExternalButton, Lines } from './Projects'

const tabs = softworker.focus.map((f) => ({ id: f.id, name: f.name, line: `${f.full}. ${f.line}`, color: softworker.accent }))

export function Softworker() {
  const ref = useRef<HTMLElement>(null)
  const [focus, setFocus] = useScrollTabs(ref, 'softworker', tabs.length)
  useReveal(ref)

  // the matching floor of the building lights up
  useEffect(() => {
    story.focus = focus
  }, [focus])

  return (
    <section
      ref={ref}
      id="softworker"
      data-chapter="softworker"
      className="chapter event softworker"
      style={{ '--accent': softworker.accent } as CSSProperties}
      aria-labelledby="softworker-title"
    >
      <div className="sticky">
        <div className="event-card event-card--left">
          <p className="mono event-kicker" data-reveal>
            <span>{copy.softworker.kicker}</span>
            <span className="event-rule" aria-hidden />
            <span>{copy.softworker.meta}</span>
          </p>
          <h2 id="softworker-title" className="display softworker-title">
            <Lines text={softworker.company} />
          </h2>
          <p className="softworker-role serif" data-reveal>
            {softworker.role}
          </p>

          <Tabs label={copy.softworker.tabsLabel} tabs={tabs} active={focus} onPick={setFocus} />

          <div className="project-body" data-reveal>
            <p>{copy.softworker.line}</p>
          </div>
          <p className="project-proves" data-reveal>
            <span className="mono">{copy.project.provesLabel}</span>
            <span className="serif">{copy.softworker.proves}</span>
          </p>
          <div className="project-cta" data-reveal>
            <ExternalButton href={person.linkedin} label={copy.softworker.more} accent={softworker.accent} />
          </div>
        </div>
      </div>
    </section>
  )
}
