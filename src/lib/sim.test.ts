import { describe, expect, it } from 'vitest'
import { formatINR, simulate, WEEKS } from './sim'

const base = { industry: 'cafe' as const, priceFactor: 1, marketing: 20000 }

describe('simulate', () => {
  it('is deterministic', () => {
    expect(simulate(base)).toEqual(simulate(base))
  })

  it('produces one bar per week, all within 0..1', () => {
    const r = simulate(base)
    expect(r.weeks).toHaveLength(WEEKS)
    expect(r.bars).toHaveLength(WEEKS)
    r.bars.forEach((b) => {
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThanOrEqual(1)
    })
  })

  it('sells fewer units when the price goes up', () => {
    expect(simulate({ ...base, priceFactor: 1.6 }).units).toBeLessThan(simulate(base).units)
  })

  it('sells more units with more marketing, with diminishing returns', () => {
    const none = simulate({ ...base, marketing: 0 }).units
    const some = simulate({ ...base, marketing: 30000 }).units
    const lots = simulate({ ...base, marketing: 90000 }).units
    expect(some).toBeGreaterThan(none)
    expect(lots).toBeGreaterThan(some)
    expect(lots - some).toBeLessThan(some - none)
  })

  it('works for every industry', () => {
    for (const industry of ['cafe', 'software', 'apparel'] as const) {
      const r = simulate({ ...base, industry })
      expect(r.revenue).toBeGreaterThan(0)
      expect(Number.isFinite(r.profit)).toBe(true)
    }
  })
})

describe('formatINR', () => {
  it('uses lakh and crore', () => {
    expect(formatINR(950)).toBe('₹950')
    expect(formatINR(250000)).toBe('₹2.5 L')
    expect(formatINR(31000000)).toBe('₹3.10 Cr')
    expect(formatINR(-120000)).toBe('−₹1.2 L')
  })
})
