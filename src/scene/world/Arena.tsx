import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { chapters } from '../../content'
import { rng } from '../../lib/rng'
import { story } from '../../lib/store'
import { places } from '../shots'
import { Glow } from './Landmarks'

const idx = chapters.findIndex((c) => c.id === 'nymeria')

function trophyGeometry() {
  // lathe profile: base, stem, cup
  const pts = [
    [0, 0],
    [0.62, 0],
    [0.62, 0.12],
    [0.5, 0.16],
    [0.46, 0.32],
    [0.18, 0.4],
    [0.12, 0.62],
    [0.1, 0.95],
    [0.2, 1.08],
    [0.5, 1.2],
    [0.72, 1.55],
    [0.8, 2.05],
    [0.74, 2.08],
    [0.66, 1.62],
    [0.46, 1.32],
    [0, 1.26],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const g = new THREE.LatheGeometry(pts, 64)
  g.computeVertexNormals()
  return g
}

export function Arena() {
  const trophy = useRef<THREE.Group>(null)
  const beams = useRef<THREE.Group>(null)
  const sparks = useRef<THREE.Points>(null)
  const geo = useMemo(() => trophyGeometry(), [])
  const handle = useMemo(() => new THREE.TorusGeometry(0.38, 0.05, 12, 40, Math.PI * 1.2), [])

  const sparkGeo = useMemo(() => {
    const n = 220
    const pos = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    const random = rng(5)
    for (let i = 0; i < n; i++) {
      const a = random() * Math.PI * 2
      const r = 0.6 + random() * 3.2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = random() * 8
      pos[i * 3 + 2] = Math.sin(a) * r
      seed[i] = random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [])

  useEffect(
    () => () => {
      geo.dispose()
      handle.dispose()
      sparkGeo.dispose()
    },
    [geo, handle, sparkGeo],
  )

  useFrame((s, dt) => {
    const time = s.clock.elapsedTime
    const local = story.t - idx
    const rise = Math.min(1, Math.max(0, (local + 0.35) / 0.6))
    const e = 1 - Math.pow(1 - rise, 3)
    if (trophy.current) {
      trophy.current.position.y = -2.4 + e * 2.4
      trophy.current.rotation.y = time * 0.5
    }
    if (beams.current) {
      beams.current.children.forEach((b, i) => {
        b.rotation.z = Math.sin(time * 0.6 + i) * 0.25
        ;((b as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.025 + e * 0.045
      })
    }
    if (sparks.current) {
      const p = sparks.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = p.array as Float32Array
      for (let i = 0; i < p.count; i++) {
        arr[i * 3 + 1] += dt * (0.4 + (i % 7) * 0.12) * (0.3 + e)
        if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = 0
      }
      p.needsUpdate = true
      ;(sparks.current.material as THREE.PointsMaterial).opacity = 0.2 + e * 0.7
    }
  })

  const [x, y, z] = places.nymeria
  return (
    <group position={[x, y, z]}>
      {/* stepped bowl */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.3 + i * 0.55, 0]}>
          <cylinderGeometry args={[9 + i * 1.3, 9 + i * 1.3, 0.55, 72, 1, true, Math.PI * 0.15, Math.PI * 1.7]} />
          <meshStandardMaterial color={i % 2 ? '#1a1712' : '#221d16'} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`r${i}`} position={[0, 0.58 + i * 0.55, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[9 + i * 1.3 - 0.03, 9 + i * 1.3 + 0.03, 96, 1, Math.PI * 0.15 + Math.PI / 2, Math.PI * 1.7]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
      {/* floor + pedestal */}
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[9, 72]} />
        <meshStandardMaterial color="#14110d" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.3, 2.36, 96]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 1, 8]} />
        <meshStandardMaterial color="#1c1813" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* trophy */}
      <group ref={trophy} position={[0, -2.4, 0]}>
        <group position={[0, 1, 0]}>
          <mesh geometry={geo}>
            <meshStandardMaterial color="#ffcf6b" metalness={1} roughness={0.18} envMapIntensity={1.8} />
          </mesh>
          <mesh geometry={handle} position={[0.74, 1.62, 0]} rotation-z={-Math.PI * 0.6}>
            <meshStandardMaterial color="#ffcf6b" metalness={1} roughness={0.2} />
          </mesh>
          <mesh geometry={handle} position={[-0.74, 1.62, 0]} rotation-z={Math.PI * 0.6} rotation-y={Math.PI}>
            <meshStandardMaterial color="#ffcf6b" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      </group>
      <Glow color="#ffd27a" size={6} position={[0, 2.6, 0]} opacity={0.45} />

      {/* light beams */}
      <group ref={beams}>
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 7, 7, sz * 5]} rotation={[sz * 0.5, 0, sx * -0.55]}>
              <coneGeometry args={[1.8, 14, 24, 1, true]} />
              <meshBasicMaterial color="#fff0c8" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          )),
        )}
      </group>

      <points ref={sparks} geometry={sparkGeo}>
        <pointsMaterial color="#ffd27a" size={0.07} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>

      <spotLight position={[0, 12, 6]} angle={0.45} penumbra={0.6} color="#fff1cf" intensity={260} distance={30} />
    </group>
  )
}
