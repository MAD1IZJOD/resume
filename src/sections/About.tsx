import { useRef } from 'react'
import { education, person } from '../content'
import { scrollToChapter } from '../lib/scroll'
import { useReveal } from '../lib/useReveal'
import { Lines } from './Projects'

const evidence: { claim: string; items: { label: string; id: string }[] }[] = [
  {
    claim: 'I build',
    items: [
      { label: 'UNIOFFICE', id: 'unioffice' },
      { label: 'ORCADES', id: 'orcades' },
      { label: 'Business Simulator', id: 'simulator' },
      { label: 'Vinacou', id: 'vinacou' },
    ],
  },
  { claim: 'I execute', items: [{ label: 'NYMERIA — hackathon win', id: 'nymeria' }] },
  {
    claim: 'I lead',
    items: [
      { label: 'MHMUN', id: 'mhmun' },
      { label: 'Hansraj Hackfest', id: 'hackfest' },
    ],
  },
]

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
            <Lines text={['I’m Madhavan', 'Sahu.']} />
          </h2>
          <p className="about-lede" data-reveal>
            I build products, software, AI systems and interactive experiences. Not just code — <em className="serif">things.</em>
          </p>

          <ul className="about-evidence" data-reveal>
            {evidence.map((e) => (
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
              <dt className="mono">Now</dt>
              <dd>
                {education.current.name}, {education.current.city}
              </dd>
            </div>
            <div>
              <dt className="mono">School</dt>
              <dd>
                {education.school.name}, {education.school.city} — until Class 12
              </dd>
            </div>
          </dl>
          <p className="about-aside" data-reveal>
            Long before any of this, I hosted gaming contests — my first taste of bringing people together and running something from start
            to finish.
          </p>
          <p className="sr-only">
            Contact: {person.email}. GitHub: {person.githubHandle}.
          </p>
        </div>
      </div>
    </section>
  )
}
