import type { ChapterId } from '../content'
import { chapters, mhmun } from '../content'

export const chapterIndex = (id: ChapterId) => chapters.findIndex((c) => c.id === id)

/** Local 0..1 progress through a chapter for a given chapter-space time. */
export const localT = (t: number, id: ChapterId) => t - chapterIndex(id)

export const SEATS = mhmun.attendees // exactly 1600 figures — one per student

/** Scroll progress through the MHMUN chapter → share of the hall that is filled. */
export function mhmunFill(t: number) {
  const f = (localT(t, 'mhmun') - 0.05) / 0.4
  return Math.min(1, Math.max(0, f))
}
