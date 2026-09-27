import { useRef } from 'react'
import { copy, services } from '../content'
import { scrollToChapter } from '../lib/scroll'
import { useReveal } from '../lib/useReveal'
import { Lines } from './Projects'

export function Services() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { start: 'top 45%' })
  return (
    <section ref={ref} id="services" data-chapter="services" className="chapter services" aria-labelledby="services-title">
      <div className="sticky services-inner">
        <header className="services-head">
          <p className="mono services-kicker" data-reveal>
            {copy.services.kicker}
          </p>
          <h2 id="services-title" className="display services-title">
            <Lines text={copy.services.title} />
          </h2>
          <p className="services-lede" data-reveal>
            {copy.services.lede}
          </p>
        </header>
        <ol className="services-list">
          {services.map((s, i) => (
            <li key={s.id} className="service" data-reveal>
              <span className="mono service-n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-items">{s.items.join(' · ')}</p>
              <p className="service-proof">
                <span className="mono">{copy.services.proofLabel}</span>
                {s.evidence.map((e) => (
                  <a
                    key={e.label}
                    href={e.href}
                    onClick={(ev) => {
                      ev.preventDefault()
                      scrollToChapter(e.href.slice(1))
                    }}
                  >
                    {e.label}
                  </a>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
