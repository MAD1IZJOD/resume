import { useSyncExternalStore } from 'react'

/**
 * `story` is a plain mutable object read every frame by the 3D scene.
 * It is intentionally *not* React state — scroll and pointer data change
 * 60+ times a second and must never trigger re-renders.
 */
export const story = {
  /** Chapter-space scroll position: 3.5 = halfway through chapter 3. */
  t: 0,
  /** 0..1 over the whole document. */
  progress: 0,
  /** Smoothed pointer in -1..1. */
  pointer: { x: 0, y: 0 },
  /** Intro timeline 0..1 (time-based, not scroll-based). */
  intro: 0,
  /** Phone screen has been "unlocked" by the visitor. */
  entered: 0,
  /** Business simulator weekly revenue, normalised 0..1, drives the 3D district. */
  simBars: new Array<number>(24).fill(0.08),
  /** Active Hackfest track (0 cloud, 1 web, 2 design). */
  track: 0,
  /** Vinacou "listen" pulse energy, decays in the scene. */
  pulse: 0,
}

/* ---------- tiny reactive store for the few things UI needs to render ---------- */

type UIState = {
  chapter: number
  introDone: boolean
  entered: boolean
  menuOpen: boolean
  webgl: boolean
}

let ui: UIState = { chapter: 0, introDone: false, entered: false, menuOpen: false, webgl: true }
const listeners = new Set<() => void>()

export function setUI(patch: Partial<UIState>) {
  let changed = false
  for (const k in patch) {
    const key = k as keyof UIState
    if (ui[key] !== patch[key]) changed = true
  }
  if (!changed) return
  ui = { ...ui, ...patch }
  listeners.forEach((l) => l())
}

export function getUI() {
  return ui
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useUI<T>(select: (s: UIState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(ui),
    () => select(ui),
  )
}
