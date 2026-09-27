// A deliberately tiny business model, built only for this page to show the
// *idea* of a simulator: decisions → market → sales → revenue. It is not the
// model used by the real Business Simulator.

export type Industry = {
  id: 'cafe' | 'software' | 'apparel'
  name: string
  product: string
  unitCost: number
  refPrice: number
  baseDemand: number
  elasticity: number
  fixedCost: number
}

export const industries: Industry[] = [
  { id: 'cafe', name: 'Café', product: 'Cold coffee', unitCost: 60, refPrice: 180, baseDemand: 900, elasticity: 1.7, fixedCost: 45000 },
  { id: 'software', name: 'Software', product: 'Team plan', unitCost: 80, refPrice: 999, baseDemand: 140, elasticity: 1.1, fixedCost: 60000 },
  { id: 'apparel', name: 'Apparel', product: 'Hoodie', unitCost: 420, refPrice: 1400, baseDemand: 230, elasticity: 1.45, fixedCost: 52000 },
]

export type Decisions = { industry: Industry['id']; priceFactor: number; marketing: number }

export type SimResult = {
  weeks: { demand: number; units: number; revenue: number; profit: number }[]
  units: number
  revenue: number
  profit: number
  bars: number[]
  price: number
}

export const WEEKS = 24

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function simulate(d: Decisions): SimResult {
  const ind = industries.find((i) => i.id === d.industry) ?? industries[0]
  const price = Math.round(ind.refPrice * d.priceFactor)
  const r = rng(ind.id.length * 97 + 13)
  const priceEffect = Math.exp(-ind.elasticity * (d.priceFactor - 1))
  let awareness = 0
  const weeks: SimResult['weeks'] = []
  for (let w = 0; w < WEEKS; w++) {
    // marketing builds awareness that decays over time — diminishing returns
    awareness = awareness * 0.82 + (1 - Math.exp(-d.marketing / 30000)) * 0.35
    const season = 1 + 0.18 * Math.sin((w / WEEKS) * Math.PI * 2 - 0.6)
    const growth = 1 + w * 0.012
    const noise = 0.9 + r() * 0.2
    const demand = ind.baseDemand * season * growth * noise * priceEffect * (0.6 + awareness)
    const units = Math.max(0, Math.round(demand))
    const revenue = units * price
    const cost = units * ind.unitCost + ind.fixedCost / 4 + d.marketing
    weeks.push({ demand, units, revenue, profit: revenue - cost })
  }
  // normalise against a fixed per-industry ceiling so bars are comparable as you tweak
  const ceiling = ind.baseDemand * ind.refPrice * 3.4
  const bars = weeks.map((w) => Math.min(1, w.revenue / ceiling))
  return {
    weeks,
    units: weeks.reduce((a, w) => a + w.units, 0),
    revenue: weeks.reduce((a, w) => a + w.revenue, 0),
    profit: weeks.reduce((a, w) => a + w.profit, 0),
    bars,
    price,
  }
}

export function formatINR(n: number) {
  const sign = n < 0 ? '−' : ''
  const v = Math.abs(n)
  if (v >= 1e7) return `${sign}₹${(v / 1e7).toFixed(2)} Cr`
  if (v >= 1e5) return `${sign}₹${(v / 1e5).toFixed(1)} L`
  return `${sign}₹${Math.round(v).toLocaleString('en-IN')}`
}
