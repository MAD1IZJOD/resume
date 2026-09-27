import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { localT } from '../../lib/chapterProgress'
import { story } from '../../lib/store'
import { Glow } from './Landmarks'

/** The shard from the intro, returned: everything collapses back into it. */
export function Core() {
  const g = useRef<THREE.Group>(null)
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 0)), [])
  const outer = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.9, 1)), [])
  const outerRef = useRef<THREE.LineSegments>(null)
  useEffect(
    () => () => {
      edges.dispose()
      outer.dispose()
    },
    [edges, outer],
  )
  const spin = useRef(0)
  useFrame((s, dt) => {
    const grp = g.current
    if (!grp) return
    const l = localT(story.t, 'contact')
    const appear = Math.min(1, Math.max(0, (l - 0.16) / 0.16))
    grp.visible = appear > 0.001
    if (!grp.visible) return
    const e = 1 - Math.pow(1 - appear, 3)
    spin.current += dt * (0.4 + story.pulse * 2.5)
    // make room for the call to action: drift up and shrink a little
    const lift = Math.min(1, Math.max(0, (l - 0.56) / 0.1))
    const le = lift * lift * (3 - 2 * lift)
    grp.position.y = 0.2 + le * 1.35
    grp.scale.setScalar(e * (1 - le * 0.35) * (1 + Math.sin(s.clock.elapsedTime * 1.4) * 0.03 + story.pulse * 0.12))
    grp.rotation.set(spin.current * 0.6, spin.current, 0)
    if (outerRef.current) outerRef.current.rotation.set(-spin.current * 0.3, -spin.current * 0.5, 0)
  })
  return (
    <group ref={g} position={[0, 0.2, 0]} visible={false}>
      <mesh>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#1a1612" metalness={1} roughness={0.25} flatShading />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ff6a2e" toneMapped={false} />
      </lineSegments>
      <lineSegments ref={outerRef} geometry={outer}>
        <lineBasicMaterial color="#efe9dd" transparent opacity={0.12} toneMapped={false} />
      </lineSegments>
      <Glow color="#ff5a1f" size={7} position={[0, 0, -0.5]} opacity={0.55} />
      <pointLight color="#ff6a2e" intensity={12} distance={8} />
    </group>
  )
}
