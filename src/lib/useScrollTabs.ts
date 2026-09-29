import type { RefObject } from 'react'
import { useCallback, useRef, useState } from 'react'
import type { ChapterId } from '../content'
import { localT } from './chapterProgress'
import { useStoryFrame } from './useStoryFrame'

/** Scrolling walks through the tabs, unless the visitor has picked one. */
export function useScrollTabs(ref: RefObject<HTMLElement | null>, id: ChapterId, count: number) {
  const [active, setActive] = useState(0)
  const picked = useRef(false)

  const onFrame = useCallback(
    (t: number) => {
      const local = localT(t, id)
      if (local < -0.3 || local > 1) {
        picked.current = false
        return
      }
      if (picked.current) return
      const next = Math.min(count - 1, Math.max(0, Math.floor((local - 0.05) / 0.2)))
      setActive((cur) => (cur === next ? cur : next))
    },
    [id, count],
  )
  useStoryFrame(ref, onFrame)

  const pick = useCallback((i: number) => {
    picked.current = true
    setActive(i)
  }, [])
  return [active, pick] as const
}
