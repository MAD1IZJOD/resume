import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { story } from '../../lib/store'
import { places } from '../shots'
import { glowTexture, windowsTexture } from '../textures'

const tmpM = new THREE.Matrix4()
const tmpQ = new THREE.Quaternion()
const tmpS = new THREE.Vector3()
const tmpP = new THREE.Vector3()
const tmpC = new THREE.Color()

function useDispose(item: { dispose: () => void }) {
  useEffect(() => () => item.dispose(), [item])
}

export function Glow({ color, size, opacity = 0.6, position }: { color: string; size: number; opacity?: number; position: [number, number, number] }) {
  const tex = useMemo(() => glowTexture(), [])
  useDispose(tex)
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  )
}

/* ------------------------------------------------------------------ */
/* ABOUT: the beacon: a single slender tower with a light that never goes out */

export function Beacon() {
  const light = useRef<THREE.Mesh>(null)
  const beam = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((s) => {
    const k = 0.5 + 0.5 * Math.sin(s.clock.elapsedTime * 1.4)
    if (light.current) light.current.scale.setScalar(0.9 + k * 0.25)
    if (beam.current) beam.current.opacity = 0.05 + k * 0.05
  })
  const [x, y, z] = places.beacon
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 7, 0]}>
        <cylinderGeometry args={[0.25, 0.7, 14, 6]} />
        <meshStandardMaterial color="#2a2621" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh ref={light} position={[0, 14.6, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color="#ff5a1f" toneMapped={false} />
      </mesh>
      <mesh position={[0, 60, 0]}>
        <cylinderGeometry args={[0.18, 0.5, 90, 12, 1, true]} />
        <meshBasicMaterial ref={beam} color="#ff7a45" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Glow color="#ff5a1f" size={7} position={[0, 14.6, 0]} opacity={0.7} />
      <pointLight position={[0, 13, 2]} color="#ff6a2e" intensity={40} distance={30} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* UNIOFFICE: a workspace tower. Floors light up; OS-like panels orbit the crown. */

export function UniofficeTower() {
  const winTexs = useMemo(() => [11, 12, 13].map((seed) => windowsTexture(14, 3, 0.55, seed, '#f4ffd0')), [])
  useEffect(() => () => winTexs.forEach((t) => t.dispose()), [winTexs])
  const panels = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const floors = 13
  useFrame((s, dt) => {
    if (panels.current) panels.current.rotation.y += dt * 0.12
    if (ring.current) ring.current.rotation.z = s.clock.elapsedTime * 0.3
  })
  const [x, y, z] = places.unioffice
  return (
    <group position={[x, y, z]}>
      {/* podium */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[9, 0.8, 9]} />
        <meshStandardMaterial color="#161512" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* floors: slight setbacks as it rises */}
      {Array.from({ length: floors }, (_, i) => {
        const w = 5.6 - i * 0.12
        return (
          <mesh key={i} position={[0, 0.8 + i * 1.9 + 0.9, 0]}>
            <boxGeometry args={[w, 1.75, w]} />
            <meshStandardMaterial color="#12120f" emissive="#ffffff" emissiveMap={winTexs[i % 3]} emissiveIntensity={1.1} roughness={0.35} metalness={0.6} />
          </mesh>
        )
      })}
      {/* lime seam between floors */}
      {Array.from({ length: floors }, (_, i) => (
        <mesh key={`s${i}`} position={[0, 0.8 + i * 1.9 + 1.82, 0]}>
          <boxGeometry args={[5.75 - i * 0.12, 0.05, 5.75 - i * 0.12]} />
          <meshBasicMaterial color="#d7ff4a" toneMapped={false} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* crown */}
      <mesh ref={ring} position={[0, 27.2, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[3.4, 0.05, 8, 96]} />
        <meshBasicMaterial color="#d7ff4a" toneMapped={false} />
      </mesh>
      <group ref={panels} position={[0, 20, 0]}>
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * 5.4, Math.sin(i * 1.7) * 3, Math.sin(a) * 5.4]} rotation-y={-a + Math.PI / 2}>
              <mesh>
                <planeGeometry args={[2.2, 1.4]} />
                <meshBasicMaterial color="#d7ff4a" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(2.2, 1.4)]} />
                <lineBasicMaterial color="#d7ff4a" transparent opacity={0.7} toneMapped={false} />
              </lineSegments>
              <mesh position={[-0.55, 0.35, 0.01]}>
                <planeGeometry args={[0.9, 0.12]} />
                <meshBasicMaterial color="#d7ff4a" transparent opacity={0.6} toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.1, 0.01]}>
                <planeGeometry args={[1.8, 0.5]} />
                <meshBasicMaterial color="#d7ff4a" transparent opacity={0.16} toneMapped={false} />
              </mesh>
            </group>
          )
        })}
      </group>
      <Glow color="#d7ff4a" size={16} position={[0, 27, 0]} opacity={0.25} />
      <pointLight position={[6, 10, 6]} color="#d7ff4a" intensity={60} distance={40} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* ORCADES: a creative studio as a sculpture: a twisting stack of slabs */

export function OrcadesSculpture() {
  const stack = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)
  const n = 26
  const colors = useMemo(() => {
    const a = new THREE.Color('#ff5fd2')
    const b = new THREE.Color('#7a5cff')
    const c = new THREE.Color('#ffb38a')
    return Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1)
      return t < 0.6 ? a.clone().lerp(b, t / 0.6) : b.clone().lerp(c, (t - 0.6) / 0.4)
    })
  }, [])
  useFrame((s) => {
    const time = s.clock.elapsedTime
    stack.current?.children.forEach((ch, i) => {
      ch.rotation.y = i * 0.14 + Math.sin(time * 0.4 + i * 0.12) * 0.35
    })
    if (knot.current) {
      knot.current.rotation.x = time * 0.2
      knot.current.rotation.y = time * 0.3
    }
  })
  const [x, y, z] = places.orcades
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[5, 5.2, 0.3, 48]} />
        <meshStandardMaterial color="#15121a" roughness={0.4} metalness={0.5} />
      </mesh>
      <group ref={stack}>
        {colors.map((c, i) => (
          <mesh key={i} position={[0, 0.5 + i * 0.36, 0]}>
            <boxGeometry args={[3.6 - Math.sin((i / n) * Math.PI) * 1.4, 0.2, 1.1]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} roughness={0.25} metalness={0.3} />
          </mesh>
        ))}
      </group>
      <mesh ref={knot} position={[0, 13, 0]}>
        <torusKnotGeometry args={[1.2, 0.05, 160, 8, 2, 3]} />
        <meshBasicMaterial color="#ff5fd2" toneMapped={false} />
      </mesh>
      <Glow color="#ff5fd2" size={9} position={[0, 13, 0]} opacity={0.35} />
      <pointLight position={[-4, 6, 4]} color="#ff5fd2" intensity={50} distance={24} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* BUSINESS SIMULATOR: the district *is* the chart: weekly revenue drives block height */

export function SimDistrict() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const heights = useRef(new Float32Array(24).fill(0.1))
  const cols = 6
  const low = useMemo(() => new THREE.Color('#5a3a10'), [])
  const high = useMemo(() => new THREE.Color('#ffb42e'), [])
  useFrame((_, dt) => {
    const m = mesh.current
    if (!m) return
    const k = 1 - Math.exp(-dt * 4)
    for (let i = 0; i < 24; i++) {
      const target = story.simBars[i] ?? 0
      heights.current[i] += (target - heights.current[i]) * k
      const h = 0.15 + heights.current[i] * 6
      const cx = (i % cols) - (cols - 1) / 2
      const cz = Math.floor(i / cols) - 1.5
      tmpP.set(cx * 1.9, h / 2, cz * 1.9)
      tmpS.set(1.35, h, 1.35)
      tmpM.compose(tmpP, tmpQ, tmpS)
      m.setMatrixAt(i, tmpM)
      tmpC.copy(low).lerp(high, Math.min(1, heights.current[i] * 1.2))
      m.setColorAt(i, tmpC)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })
  const [x, y, z] = places.simulator
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[13, 0.1, 9]} />
        <meshStandardMaterial color="#17130d" roughness={0.7} />
      </mesh>
      {/* street lines */}
      {[-2.85, -0.95, 0.95, 2.85].map((zz) => (
        <mesh key={zz} position={[0, 0.11, zz]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[12.6, 0.04]} />
          <meshBasicMaterial color="#ffb42e" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
      <instancedMesh ref={mesh} args={[undefined, undefined, 24]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="#ffffff" emissive="#ffb42e" emissiveIntensity={0.25} roughness={0.4} metalness={0.2} />
      </instancedMesh>
      <pointLight position={[0, 8, 5]} color="#ffb42e" intensity={60} distance={26} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* VINACOU: an acoustic showroom: slatted walls absorb sound waves */

export function VinacouShowroom() {
  const slats = useRef<THREE.InstancedMesh>(null)
  const rings = useRef<THREE.Group>(null)
  const count = 46
  useEffect(() => {
    const m = slats.current
    if (!m) return
    for (let i = 0; i < count; i++) {
      const wall = i < 30 ? 0 : 1
      const j = wall === 0 ? i : i - 30
      const h = 5.2
      if (wall === 0) tmpP.set(-5.8 + j * 0.4, h / 2 + 0.2, -3)
      else tmpP.set(-6.1, h / 2 + 0.2, -2.6 + j * 0.4)
      tmpS.set(wall === 0 ? 0.22 : 0.16, h, wall === 0 ? 0.16 : 0.22)
      tmpM.compose(tmpP, tmpQ, tmpS)
      m.setMatrixAt(i, tmpM)
      tmpC.set(j % 3 === 0 ? '#b98552' : j % 3 === 1 ? '#a4713f' : '#c9975e')
      m.setColorAt(i, tmpC)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [])
  useFrame((s, dt) => {
    story.pulse = Math.max(0, story.pulse - dt * 0.35)
    const g = rings.current
    if (!g) return
    const time = s.clock.elapsedTime
    g.children.forEach((ch, i) => {
      const f = (time * (0.25 + story.pulse * 0.5) + i / g.children.length) % 1
      ch.scale.setScalar(0.3 + f * 6.5)
      const mat = (ch as THREE.Mesh).material as THREE.MeshBasicMaterial
      // waves fade out as they reach the slatted walls: absorbed, not reflected
      mat.opacity = (1 - f) * (1 - f) * (0.45 + story.pulse * 0.5)
    })
  })
  const [x, y, z] = places.vinacou
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[13, 0.2, 7.5]} />
        <meshStandardMaterial color="#1e1812" roughness={0.55} metalness={0.1} />
      </mesh>
      <instancedMesh ref={slats} args={[undefined, undefined, count]}>
        <boxGeometry />
        <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0.05} />
      </instancedMesh>
      {/* diffuser panels on the right */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[3 + (i % 3) * 0.95, 1.2 + Math.floor(i / 3) * 0.95, -2.9]}>
          <boxGeometry args={[0.85, 0.85, 0.12 + ((i * 37) % 5) * 0.06]} />
          <meshStandardMaterial color="#2b231b" roughness={0.9} />
        </mesh>
      ))}
      <group ref={rings} position={[0.5, 1.6, 0.4]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i}>
            <ringGeometry args={[0.96, 1, 96]} />
            <meshBasicMaterial color="#f3c58d" transparent side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.5, 1.6, 0.4]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color="#f3c58d" toneMapped={false} />
      </mesh>
      <spotLight position={[-2, 7, 4]} angle={0.7} penumbra={0.8} color="#ffe6c4" intensity={120} distance={20} />
    </group>
  )
}
