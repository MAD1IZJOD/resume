import { useEffect, useId, useMemo, useState } from 'react'
import type { Decisions } from '../lib/sim'
import { formatINR, industries, simulate } from '../lib/sim'
import { story } from '../lib/store'
import { copy } from '../content'

/**
 * A pocket-sized simulation. Every change re-runs 24 weeks of a toy market;
 * the district of blocks in the 3D scene is literally this revenue chart.
 */
export function SimDemo() {
  const [d, setD] = useState<Decisions>({ industry: 'cafe', priceFactor: 1, marketing: 20000 })
  const result = useMemo(() => simulate(d), [d])
  const ind = industries.find((i) => i.id === d.industry)!
  const priceId = useId()
  const mktId = useId()

  useEffect(() => {
    story.simBars = result.bars
  }, [result])

  const max = Math.max(...result.weeks.map((w) => w.revenue), 1)
  const path = result.weeks
    .map((w, i) => `${i === 0 ? 'M' : 'L'}${(i / (result.weeks.length - 1)) * 100},${40 - (w.revenue / max) * 36}`)
    .join(' ')

  return (
    <div className="sim" data-reveal data-interactive>
      <div className="sim-head">
        <span className="mono">{copy.simDemo.head}</span>
        <span className="mono sim-weeks">24 weeks</span>
      </div>

      <div className="sim-seg" role="radiogroup" aria-label="Industry">
        {industries.map((i) => (
          <button
            key={i.id}
            type="button"
            role="radio"
            aria-checked={d.industry === i.id}
            className={d.industry === i.id ? 'on' : ''}
            onClick={() => setD((s) => ({ ...s, industry: i.id }))}
          >
            {i.name}
          </button>
        ))}
      </div>

      <div className="sim-controls">
        <label htmlFor={priceId}>
          <span className="mono">Price · {ind.product}</span>
          <output className="sim-val">{formatINR(result.price)}</output>
        </label>
        <input
          id={priceId}
          type="range"
          min={0.5}
          max={2}
          step={0.05}
          value={d.priceFactor}
          onChange={(e) => setD((s) => ({ ...s, priceFactor: Number(e.target.value) }))}
        />
        <label htmlFor={mktId}>
          <span className="mono">Marketing / week</span>
          <output className="sim-val">{formatINR(d.marketing)}</output>
        </label>
        <input
          id={mktId}
          type="range"
          min={0}
          max={100000}
          step={2500}
          value={d.marketing}
          onChange={(e) => setD((s) => ({ ...s, marketing: Number(e.target.value) }))}
        />
      </div>

      <svg className="sim-chart" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden>
        <path d={`${path} L100,42 L0,42 Z`} className="sim-area" />
        <path d={path} className="sim-line" />
      </svg>

      <dl className="sim-out" aria-live="polite">
        <div>
          <dt className="mono">Sales</dt>
          <dd>{result.units.toLocaleString('en-IN')} units</dd>
        </div>
        <div>
          <dt className="mono">Revenue</dt>
          <dd>{formatINR(result.revenue)}</dd>
        </div>
        <div>
          <dt className="mono">Profit</dt>
          <dd className={result.profit < 0 ? 'neg' : 'pos'}>{formatINR(result.profit)}</dd>
        </div>
      </dl>
      <p className="sim-note">{copy.simDemo.note}</p>
    </div>
  )
}
