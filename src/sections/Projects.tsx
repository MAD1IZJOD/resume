import type { CSSProperties, ReactNode } from 'react'
import { useRef } from 'react'
import type { Project } from '../content'
import { copy } from '../content'
import { useReveal } from '../lib/useReveal'

export function Lines({ text, className }: { text: string | string[]; className?: string }) {
  const arr = Array.isArray(text) ? text : [text]
  return (
    <span className={className}>
      {arr.map((l, i) => (
        <span className="line-mask" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </span>
  )
}

export function ExternalButton({ href, label, accent }: { href: string; label: string; accent?: string }) {
  return (
    <a className="btn btn--solid" href={href} target="_blank" rel="noopener noreferrer" style={accent ? ({ '--c': accent } as CSSProperties) : undefined}>
      <span>{label}</span>
      <span className="arrow" aria-hidden>
        ↗
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

type Props = { project: Project; align: 'left' | 'right'; children?: ReactNode; tall?: boolean }

export function ProjectChapter({ project: p, align, children, tall }: Props) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  const titleId = `${p.id}-title`
  return (
    <section
      ref={ref}
      id={p.id}
      data-chapter={p.id}
      className={`chapter project project--${p.id}${tall ? ' project--tall' : ''}`}
      style={{ '--accent': p.accent } as CSSProperties}
      aria-labelledby={titleId}
    >
      <div className="sticky">
        <div className={`project-card project-card--${align}`}>
          <div className="project-meta mono" data-reveal>
            <span className="project-index">{p.index} / 04</span>
            <span className="project-kicker">{p.kicker}</span>
            <span className="project-status">
              <span className="live-dot" aria-hidden />
              {p.status}
            </span>
          </div>
          <h2 id={titleId} className="display project-name">
            <Lines text={p.name.split(' ')} />
          </h2>
          <div className="project-body" data-reveal>
            {p.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <p className="project-proves" data-reveal>
            <span className="mono">{copy.project.provesLabel}</span>
            <span className="serif">{p.proves}</span>
          </p>
          {children}
          <div className="project-cta" data-reveal>
            <ExternalButton href={p.url} label={`${copy.project.visit} ${p.name}`} accent={p.accent} />
            <span className="mono project-url">{p.displayUrl}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
