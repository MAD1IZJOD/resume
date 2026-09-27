/** Small deterministic PRNG (LCG) — procedural scenes look the same on every visit. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
