import { useFrame } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { hackfest } from '../../content'
import { rng } from '../../lib/rng'
import { story } from '../../lib/store'
import { places } from '../shots'
import { Glow } from './Landmarks'

const TRACK_COLORS = hackfest.tracks.map((t) => t.color)
const PODS: [number, number, number][] = [
  [-8, 0, 0],
  [0, 0, -2],
  [8, 0, 0],
]
const N = hackfest.attendees // 130 participants

const tmpM = new THREE.Matrix4()
const tmpV = new THREE.Vector3()

function Pod({ i, children }: { i: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const ring = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((_, dt) => {
    const on = story.track === i ? 1 : 0
    const k = 1 - Math.exp(-dt * 4)
    const g = ref.current
    if (!g) return
    const s = g.scale.x + ((on ? 1.12 : 0.92) - g.scale.x) * k
    g.scale.setScalar(s)
    if (ring.current) ring.current.opacity += ((on ? 0.9 : 0.25) - ring.current.opacity) * k
  })
  return (
    <group position={PODS[i]}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[3, 3.2, 0.24, 48]} />
        <meshStandardMaterial color="#15130f" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.9, 3, 64]} />
        <meshBasicMaterial ref={ring} color={TRACK_COLORS[i]} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  )
}

function CloudPod() {
  const g = useRef<THREE.Group>(null)
  const r = useMemo(() => rng(21), [])
  const puffs = useMemo(() => Array.from({ length: 9 }, () => [(r() - 0.5) * 2.4, 2.6 + r() * 0.7, (r() - 0.5) * 1.2, 0.45 + r() * 0.45] as const), [r])
  useFrame((s) => {
    if (g.current) g.current.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.12
  })
  return (
    <>
      <group ref={g}>
        {puffs.map(([x, y, z, rad], i) => (
          <mesh key={i} position={[x, y, z]}>
            <icosahedronGeometry args={[rad, 1]} />
            <meshStandardMaterial color="#dbe9ff" emissive={TRACK_COLORS[0]} emissiveIntensity={0.35} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
      {[-0.7, 0, 0.7].map((x, i) => (
        <group key={i} position={[x, 0.95, 0]}>
          <mesh>
            <boxGeometry args={[0.55, 1.3, 0.7]} />
            <meshStandardMaterial color="#1c1f26" metalness={0.6} roughness={0.4} />
          </mesh>
          {[0, 1, 2, 3].map((j) => (
            <mesh key={j} position={[0.18, -0.45 + j * 0.3, 0.36]}>
              <boxGeometry args={[0.08, 0.04, 0.01]} />
              <meshBasicMaterial color={TRACK_COLORS[0]} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  )
}

function WebPod() {
  const g = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (g.current) g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.25
  })
  const c = TRACK_COLORS[1]
  return (
    <group ref={g} position={[0, 2.3, 0]}>
      <mesh>
        <boxGeometry args={[3.4, 2.2, 0.08]} />
        <meshStandardMaterial color="#10140f" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.95, 0.05]}>
        <planeGeometry args={[3.4, 0.3]} />
        <meshBasicMaterial color="#1c2a20" toneMapped={false} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.5 + i * 0.18, 0.95, 0.06]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
      {[0.55, 0.3, 0.05, -0.2, -0.45, -0.7].map((y, i) => (
        <mesh key={y} position={[-1.45 + 0.1 * (i % 3) + (0.4 + (i * 0.37) % 1.4) / 2, y, 0.06]}>
          <planeGeometry args={[0.4 + ((i * 0.37) % 1.4), 0.09]} />
          <meshBasicMaterial color={c} transparent opacity={i % 2 ? 0.45 : 0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function DesignPod() {
  const g = useRef<THREE.Group>(null)
  const curve = useMemo(() => {
    const path = new THREE.CubicBezierCurve3(new THREE.Vector3(-1.6, 1.2, 0), new THREE.Vector3(-0.8, 4, 0.6), new THREE.Vector3(0.9, 0.4, -0.4), new THREE.Vector3(1.6, 3.2, 0))
    return new THREE.TubeGeometry(path, 80, 0.045, 8, false)
  }, [])
  useEffect(() => () => curve.dispose(), [curve])
  useFrame((s) => {
    if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.35
  })
  const c = TRACK_COLORS[2]
  return (
    <group ref={g}>
      <mesh geometry={curve}>
        <meshBasicMaterial color={c} toneMapped={false} />
      </mesh>
      {[
        [-1.6, 1.2, 0],
        [1.6, 3.2, 0],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0.2, 2.4, -0.6]}>
        <torusGeometry args={[0.55, 0.06, 12, 48]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.4, 1.3, 0.6]} rotation-z={0.3}>
        <coneGeometry args={[0.45, 0.8, 3]} />
        <meshStandardMaterial color="#e6dcff" emissive={c} emissiveIntensity={0.2} flatShading />
      </mesh>
    </group>
  )
}

/** 130 participants drifting to whichever track is active. */
function Crowd() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const state = useMemo(() => {
    const r = rng(130)
    return Array.from({ length: N }, (_, i) => ({
      pos: new THREE.Vector3((r() - 0.5) * 20, 0.35, 4 + r() * 4),
      angle: r() * Math.PI * 2,
      radius: 3.4 + r() * 1.6,
      speed: 0.6 + r() * 1.2,
      phase: r() * 10,
      i,
    }))
  }, [])
  const colors = useMemo(() => TRACK_COLORS.map((c) => new THREE.Color(c)), [])
  const cur = useRef(new THREE.Color('#efe9dd'))

  useFrame((s, dt) => {
    const m = mesh.current
    if (!m) return
    const time = s.clock.elapsedTime
    const pod = PODS[story.track] ?? PODS[0]
    const k = 1 - Math.exp(-dt * 1.6)
    for (const p of state) {
      const a = p.angle + time * 0.08 * p.speed
      tmpV.set(pod[0] + Math.cos(a) * p.radius, 0.35 + Math.abs(Math.sin(time * 3 + p.phase)) * 0.06, pod[2] + Math.sin(a) * p.radius * 0.7 + 1)
      p.pos.lerp(tmpV, k * (0.5 + p.speed * 0.4))
      tmpM.makeTranslation(p.pos.x, p.pos.y, p.pos.z)
      m.setMatrixAt(p.i, tmpM)
    }
    m.instanceMatrix.needsUpdate = true
    const mat = m.material as THREE.MeshBasicMaterial
    cur.current.lerp(colors[story.track] ?? colors[0], k)
    mat.color.copy(cur.current)
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <sphereGeometry args={[0.13, 10, 10]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

export function Hackfest() {
  const [x, y, z] = places.hackfest
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[30, 16]} />
        <meshStandardMaterial color="#110f0d" roughness={0.8} />
      </mesh>
      <Pod i={0}>
        <CloudPod />
      </Pod>
      <Pod i={1}>
        <WebPod />
      </Pod>
      <Pod i={2}>
        <DesignPod />
      </Pod>
      <Crowd />
      <Glow color="#efe9dd" size={20} position={[0, 4, -4]} opacity={0.08} />
      <spotLight position={[0, 14, 8]} angle={0.9} penumbra={0.8} intensity={200} distance={40} color="#fff1e0" />
    </group>
  )
}
