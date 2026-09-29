import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { chapters } from '../../content'
import type { Tier } from '../../lib/env'
import { story } from '../../lib/store'
import { Arena } from './Arena'
import { Auditorium } from './Auditorium'
import { City } from './City'
import { Hackfest } from './Hackfest'
import { Journey } from './Journey'
import { Beacon, OrcadesSculpture, SimDistrict, UniofficeTower, VinacouShowroom } from './Landmarks'
import { SoftworkerHQ } from './Softworker'

const contactIndex = chapters.findIndex((c) => c.id === 'contact')

/**
 * The digital universe behind the phone. At the very end it collapses back
 * into a single point at the origin: where the story started.
 */
export function World({ tier }: { tier: Tier }) {
  const root = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = root.current
    if (!g) return
    const t = story.t
    // NB: never toggle `visible` here: hiding lights changes the light count
    // and forces three.js to recompile every material mid-scroll.
    // collapse during the first half of the contact chapter
    const c = Math.min(1, Math.max(0, (t - contactIndex) / 0.3))
    const e = c * c * (3 - 2 * c)
    const s = Math.max(0.0001, 1 - e)
    g.scale.setScalar(s)
    // until the camera is inside the phone, park the world far below the scene
    g.position.y = t < 1.2 ? -1000 : e * 2
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
      <Hackfest />
      <SoftworkerHQ />
      <Journey />
    </group>
  )
}
