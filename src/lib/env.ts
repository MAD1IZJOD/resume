export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isCoarsePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export type Tier = 'high' | 'low'

/** A cheap, conservative guess at how much GPU work we can afford. */
export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'low'
  const cores = navigator.hardwareConcurrency || 4
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const small = Math.min(window.innerWidth, window.innerHeight) < 700
  if (isCoarsePointer() || small || cores <= 4 || mem <= 4) return 'low'
  return 'high'
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
