import { useEffect, useRef } from 'react'

/** A quiet two-part cursor for fine pointers. Grows over anything clickable. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    document.documentElement.classList.add('has-cursor')
    const pos = { x: -100, y: -100 }
    const lag = { x: -100, y: -100 }
    let hot = false
    let raf = 0
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = e.target as Element | null
      hot = !!t?.closest?.('a, button, input, label, [role="tab"]')
    }
    const onLeave = () => {
      pos.x = pos.y = -100
    }
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.18
      lag.y += (pos.y - lag.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) {
        ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0) scale(${hot ? 1.8 : 1})`
        ring.current.dataset.hot = String(hot)
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
