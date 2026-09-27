import { useEffect } from 'react'
import type { RefObject } from 'react'
import { story } from './store'

/**
 * Runs `cb(t)` every animation frame while `ref` is on screen. Used for
 * scroll-linked DOM (counters, labels) without re-rendering React.
 */
export function useStoryFrame(ref: RefObject<HTMLElement | null>, cb: (t: number) => void) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let visible = false
    const loop = () => {
      cb(story.t)
      if (visible) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(loop)
      else cb(story.t)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [ref, cb])
}
