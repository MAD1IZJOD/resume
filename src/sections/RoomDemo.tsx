import { useState } from 'react'
import { clap } from '../lib/acoustics'
import { story } from '../lib/store'

/** Hear what acoustic treatment is for: one clap, two rooms. */
export function RoomDemo() {
  const [last, setLast] = useState<'bare' | 'treated' | null>(null)
  const play = (room: 'bare' | 'treated') => {
    clap(room)
    setLast(room)
    story.pulse = room === 'bare' ? 1 : 0.35
  }
  return (
    <div className="room" data-reveal data-interactive>
      <p className="mono room-head">
        <span>Hear it · sound on</span>
        <span className="room-wave" aria-hidden data-on={last !== null}>
          <i />
          <i />
          <i />
          <i />
        </span>
      </p>
      <div className="room-btns">
        <button type="button" aria-pressed={last === 'bare'} onClick={() => play('bare')}>
          Clap in a bare room
        </button>
        <button type="button" aria-pressed={last === 'treated'} onClick={() => play('treated')}>
          Clap with acoustic panels
        </button>
      </div>
      <p className="room-note">Same clap, different room. Synthesised live in your browser.</p>
    </div>
  )
}
