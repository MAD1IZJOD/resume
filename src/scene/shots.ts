import type { ChapterId } from '../content'
import { chapters } from '../content'

export type V3 = [number, number, number]

/**
 * A camera keyframe inside a chapter.
 *  at   – 0..1 progress through the chapter's scroll range
 *  side – where the subject should sit on wide screens (-1 left … 1 right),
 *         leaving room for the DOM copy on the other side
 *  up   – on portrait screens, how far the subject is lifted (fraction of height)
 *  fog  – [near, far]
 */
export type Key = { at: number; pos: V3; look: V3; side?: number; up?: number; fog?: [number, number] }

// World layout (ground plane at y = -3). The phone sits at the origin and the
// world stretches away down -z, so diving *through* the phone leads into it.
export const places = {
  phone: [0, 0, 0] as V3,
  beacon: [6, -3, -30] as V3,
  unioffice: [-9, -3, -60] as V3,
  orcades: [9, -3, -86] as V3,
  simulator: [-9, -3, -110] as V3,
  vinacou: [9, -3, -134] as V3,
  nymeria: [0, -3, -168] as V3,
  mhmun: [0, -3, -208] as V3,
  hackfest: [0, -3, -250] as V3,
  jhansi: [-26, -3, -222] as V3,
  school: [-24, -3, -196] as V3,
  zenith: [24, -3, -150] as V3,
}

const P = places

export const shots: Record<ChapterId, Key[]> = {
  hello: [{ at: 0, pos: [0, 0, 7.4], look: [0, 0, 0], side: 0, up: 0.04, fog: [14, 40] }],
  portal: [
    { at: 0.05, pos: [0, 0, 5.2], look: [0, 0, 0], side: 0, up: 0, fog: [14, 40] },
    { at: 0.55, pos: [0, 0, 0.42], look: [0, 0, -1], side: 0, up: 0, fog: [6, 34] },
    { at: 0.62, pos: [0, 0, -0.4], look: [0, -0.6, -30], side: 0, up: 0, fog: [4, 30] },
  ],
  about: [
    { at: 0, pos: [-2, 1, -8], look: [5, 4, -30], side: 0.4, up: 0.18, fog: [10, 70] },
    { at: 0.6, pos: [-5, 6, -10], look: [4, 3, -40], side: 0.4, up: 0.2, fog: [16, 110] },
  ],
  unioffice: [
    { at: 0, pos: [8, 3, -34], look: [P.unioffice[0], 8, P.unioffice[2]], side: -0.45, up: 0.2, fog: [18, 90] },
    { at: 0.6, pos: [6, 8, -37], look: [P.unioffice[0], 15, P.unioffice[2]], side: -0.45, up: 0.22, fog: [18, 90] },
  ],
  orcades: [
    { at: 0, pos: [-6, 3, -66], look: [P.orcades[0], 4.5, P.orcades[2]], side: 0.45, up: 0.2, fog: [16, 80] },
    { at: 0.6, pos: [-3, 5.5, -65], look: [P.orcades[0], 5, P.orcades[2]], side: 0.45, up: 0.2, fog: [16, 80] },
  ],
  simulator: [
    { at: 0, pos: [4, 9, -96], look: [P.simulator[0], -1.5, P.simulator[2]], side: -0.42, up: 0.26, fog: [14, 70] },
    { at: 0.65, pos: [3, 7, -99], look: [P.simulator[0], -1.5, P.simulator[2]], side: -0.42, up: 0.26, fog: [14, 70] },
  ],
  vinacou: [
    { at: 0, pos: [-5, 2.2, -118], look: [P.vinacou[0], 1.2, P.vinacou[2]], side: 0.5, up: 0.2, fog: [14, 70] },
    { at: 0.6, pos: [-3.5, 3.4, -117.5], look: [P.vinacou[0], 1.4, P.vinacou[2]], side: 0.5, up: 0.2, fog: [14, 70] },
  ],
  nymeria: [
    { at: 0, pos: [0, 5, -147], look: [0, 0.5, P.nymeria[2]], side: 0.3, up: 0.18, fog: [16, 70] },
    { at: 0.6, pos: [3.4, 2.2, -158], look: [0, 1.6, P.nymeria[2]], side: 0.32, up: 0.2, fog: [12, 60] },
  ],
  mhmun: [
    { at: 0, pos: [0, -1.4, -197], look: [0, -1.2, -203], side: 0, up: 0.1, fog: [4, 30] },
    { at: 0.15, pos: [0, -1.2, -196], look: [0, -1.1, -203], side: 0, up: 0.1, fog: [4, 34] },
    { at: 0.48, pos: [0, 30, -176], look: [0, -3, -206], side: 0, up: 0.12, fog: [30, 120] },
    { at: 0.72, pos: [0, 32, -174], look: [0, -3, -206], side: 0, up: 0.12, fog: [30, 120] },
  ],
  hackfest: [
    { at: 0, pos: [0, 8, -231], look: [0, -1, P.hackfest[2]], side: 0, up: 0.14, fog: [18, 80] },
    { at: 0.7, pos: [0, 6, -235], look: [0, -1, P.hackfest[2]], side: 0, up: 0.14, fog: [18, 80] },
  ],
  journey: [
    { at: 0, pos: [46, 86, -92], look: [0, -3, -132], side: 0, up: 0.05, fog: [80, 300] },
    { at: 0.85, pos: [-40, 74, -176], look: [0, -3, -132], side: 0, up: 0.05, fog: [80, 300] },
  ],
  services: [
    { at: 0, pos: [-44, 30, -40], look: [0, -3, -120], side: 0.35, up: 0.2, fog: [40, 260] },
    { at: 0.7, pos: [-50, 20, -104], look: [0, -3, -128], side: 0.35, up: 0.2, fog: [40, 260] },
  ],
  contact: [
    { at: 0, pos: [0, 3, 16], look: [0, 0, -40], side: 0, up: 0.1, fog: [30, 300] },
    { at: 0.5, pos: [0, 0, 7], look: [0, 0, 0], side: 0, up: 0.12, fog: [10, 40] },
  ],
}

export type GlobalKey = Key & { T: number }

/** All keyframes flattened into chapter-space time (chapter index + at). */
export const timelineKeys: GlobalKey[] = chapters
  .flatMap((c, i) => shots[c.id].map((k) => ({ ...k, T: i + k.at })))
  .sort((a, b) => a.T - b.T)

const smooth = (x: number) => x * x * (3 - 2 * x)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export type Pose = { pos: V3; look: V3; side: number; up: number; fog: [number, number] }

export function sampleCamera(t: number, snap = false): Pose {
  const keys = timelineKeys
  let i = 0
  while (i < keys.length - 1 && keys[i + 1].T <= t) i++
  const a = keys[i]
  const b = keys[Math.min(i + 1, keys.length - 1)]
  let f = b.T > a.T ? Math.min(1, Math.max(0, (t - a.T) / (b.T - a.T))) : 0
  f = snap ? (f < 0.5 ? 0 : 1) : smooth(f)
  const v = (x: V3, y: V3): V3 => [lerp(x[0], y[0], f), lerp(x[1], y[1], f), lerp(x[2], y[2], f)]
  const fa = a.fog ?? [20, 90]
  const fb = b.fog ?? [20, 90]
  return {
    pos: v(a.pos, b.pos),
    look: v(a.look, b.look),
    side: lerp(a.side ?? 0, b.side ?? 0, f),
    up: lerp(a.up ?? 0.15, b.up ?? 0.15, f),
    fog: [lerp(fa[0], fb[0], f), lerp(fa[1], fb[1], f)],
  }
}
