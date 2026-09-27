import { useRef } from 'react'
import { copy, education, person } from '../content'
import { scrollToChapter } from '../lib/scroll'
import { useReveal } from '../lib/useReveal'
import { Lines } from './Projects'

export function About() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="about" data-chapter="about" className="chapter about" aria-labelledby="about-title">
      <div className="sticky">
        <div className="about-card">
          <p className="mono about-kicker" data-reveal>
            About
          </p>
          <h2 id="about-title" className="display about-title">
            <Lines text={copy.about.title} />
          </h2>
          <p className="about-lede" data-reveal>
            {copy.about.lede} <em className="serif">{copy.about.ledeEnd}</em>
          </p>

          <ul className="about-evidence" data-reveal>
            {copy.about.evidence.map((e) => (
              <li key={e.claim}>
                <span className="mono">{e.claim}</span>
                <span className="about-evidence-items">
                  {e.items.map((it) => (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      onClick={(ev) => {
                        ev.preventDefault()
                        scrollToChapter(it.id)
                      }}
                    >
                      {it.label}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>

          <dl className="about-edu" data-reveal>
            <div>
              <dt className="mono">{copy.about.nowLabel}</dt>
              <dd>
                {education.current.name}, {education.current.city}
              </dd>
            </div>
            <div>
              <dt className="mono">{copy.about.schoolLabel}</dt>
              <dd>
                {education.school.name}, {education.school.city} {copy.about.schoolNote}
              </dd>
            </div>
          </dl>
          <p className="about-aside" data-reveal>
            {copy.about.aside}
          </p>
          <p className="sr-only">
            Contact: {person.email}. GitHub: {person.githubHandle}.
          </p>
        </div>
      </div>
    </section>
  )
}
