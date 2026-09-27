import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { chapters } from '../../content'
import type { Tier } from '../../lib/env'
import { story } from '../../lib/store'
import { Arena } from './Arena'
import { Auditorium } from './Auditorium'
import { City } from './City'
import { Beacon, OrcadesSculpture, SimDistrict, UniofficeTower, VinacouShowroom } from './Landmarks'

const contactIndex = chapters.findIndex((c) => c.id === 'contact')

/**
 * The digital universe behind the phone. At the very end it collapses back
 * into a single point at the origin — where the story started.
 */
export function World({ tier }: { tier: Tier }) {
  const root = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = root.current
    if (!g) return
    const t = story.t
    g.visible = t > 0.9
    // collapse during the first half of the contact chapter
    const c = Math.min(1, Math.max(0, (t - contactIndex) / 0.45))
    const e = c * c * (3 - 2 * c)
    const s = Math.max(0.0001, 1 - e)
    g.scale.setScalar(s)
    g.position.y = e * 2
    if (s < 0.002) g.visible = false
  })
  return (
    <group ref={root}>
      <hemisphereLight args={['#3a3430', '#050404', 0.6]} />
      <City tier={tier} />
      <Beacon />
      <UniofficeTower />
      <OrcadesSculpture />
      <SimDistrict />
      <VinacouShowroom />
      <Arena />
      <Auditorium />
    </group>
  )
}
