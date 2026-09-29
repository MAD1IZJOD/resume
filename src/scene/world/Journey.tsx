import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { journeyProgress } from '../../lib/chapterProgress'
import { rng } from '../../lib/rng'
import { story } from '../../lib/store'
import { places } from '../shots'
import type { V3 } from '../shots'
import { Glow } from './Landmarks'

// Chronological stops: must match `timeline` in content.ts (9 entries).
const stops: V3[] = [
  places.jhansi,
  places.school,
  places.mhmun,
  places.hackfest,
  places.nymeria,
  places.softworker,
  places.zenith,
  places.unioffice,
  places.beacon,
]
// the path threads through every project on its way from Zenith to "now"
const via: Record<number, V3[]> = {
  6: [places.vinacou, places.simulator, places.orcades],
}

function buildCurve() {
  const pts: THREE.Vector3[] = []
  stops.forEach((s, i) => {
    const p = new THREE.Vector3(s[0], -1.8, s[2])
    if (i > 0) {
      const prev = pts[pts.length - 1]
      // arc between stops
      const mid = prev.clone().add(p).multiplyScalar(0.5)
      mid.y = 4 + prev.distanceTo(p) * 0.08
      pts.push(mid)
    }
    pts.push(p)
    for (const v of via[i] ?? []) {
      const q = new THREE.Vector3(v[0], -1.8, v[2])
      const last = pts[pts.length - 1]
      const m = last.clone().add(q).multiplyScalar(0.5)
      m.y = 3
      pts.push(m, q)
    }
  })
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
}

/** arc-length parameter of the curve closest to each stop */
function stopParams(curve: THREE.CatmullRomCurve3) {
  const samples = 1200
  const pts = Array.from({ length: samples + 1 }, (_, i) => curve.getPointAt(i / samples))
  let from = 0
  return stops.map((s) => {
    const target = new THREE.Vector3(s[0], -1.8, s[2])
    let best = from
    let bestD = Infinity
    for (let i = from; i <= samples; i++) {
      const d = pts[i].distanceToSquared(target)
      if (d < bestD) {
        bestD = d
        best = i
      }
    }
    from = best
    return best / samples
  })
}

function JhansiTown() {
  const r = useMemo(() => rng(1947), [])
  const houses = useMemo(
    () => Array.from({ length: 26 }, () => [(r() - 0.5) * 9, (r() - 0.5) * 7, 0.6 + r() * 1.4, 0.8 + r() * 1.2] as const),
    [r],
  )
  const [x, y, z] = places.jhansi
  return (
    <group position={[x, y, z]}>
      {houses.map(([hx, hz, h, w], i) => (
        <mesh key={i} position={[hx, h / 2, hz]}>
          <boxGeometry args={[w, h, w]} />
          <meshStandardMaterial color="#2a211a" emissive="#ff9a5a" emissiveIntensity={i % 4 === 0 ? 0.25 : 0.05} roughness={0.8} />
        </mesh>
      ))}
      {/* a fort silhouette on a hill: Jhansi */}
      <mesh position={[-3, 0.8, -4]}>
        <cylinderGeometry args={[3.2, 4.2, 1.6, 7]} />
        <meshStandardMaterial color="#1d1813" roughness={0.9} />
      </mesh>
      <mesh position={[-3, 2.3, -4]}>
        <boxGeometry args={[3.6, 1.4, 2]} />
        <meshStandardMaterial color="#261e17" roughness={0.9} />
      </mesh>
      {[-4.6, -1.4].map((tx) => (
        <mesh key={tx} position={[tx, 3.3, -4]}>
          <cylinderGeometry args={[0.45, 0.5, 2.4, 8]} />
          <meshStandardMaterial color="#261e17" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function School() {
  const [x, y, z] = places.school
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[8, 2.4, 2.2]} />
        <meshStandardMaterial color="#2b241d" emissive="#ffdcb0" emissiveIntensity={0.08} roughness={0.8} />
      </mesh>
      {[-3.2, 3.2].map((wx) => (
        <mesh key={wx} position={[wx, 1.2, 2.4]}>
          <boxGeometry args={[1.6, 2.4, 3]} />
          <meshStandardMaterial color="#2b241d" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[1.4, 1.2, 1.4]} />
        <meshStandardMaterial color="#33291f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.03, 2.5]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshStandardMaterial color="#1d2a18" roughness={1} />
      </mesh>
    </group>
  )
}

function Zenith() {
  const ring = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (ring.current) ring.current.rotation.y = s.clock.elapsedTime * 0.4
  })
  const [x, y, z] = places.zenith
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[3, 10, 3]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.7} roughness={0.3} emissive="#c9d6ff" emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[0, 10.6, 0]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#e8ecff" emissive="#c9d6ff" emissiveIntensity={0.8} flatShading />
      </mesh>
      <mesh ref={ring} position={[0, 10.6, 0]} rotation-x={1.1}>
        <torusGeometry args={[1.8, 0.04, 8, 64]} />
        <meshBasicMaterial color="#c9d6ff" toneMapped={false} />
      </mesh>
      <Glow color="#c9d6ff" size={6} position={[0, 10.6, 0]} opacity={0.35} />
    </group>
  )
}

export function Journey() {
  const curve = useMemo(() => buildCurve(), [])
  const params = useMemo(() => stopParams(curve), [curve])
  const segments = 900
  const tube = useMemo(() => new THREE.TubeGeometry(curve, segments, 0.22, 8, false), [curve])
  const perSeg = 8 * 6 // radialSegments * 6 indices
  const nodes = useRef<THREE.Group>(null)
  const tubeMat = useRef<THREE.MeshBasicMaterial>(null)
  const head = useRef<THREE.Group>(null)
  useEffect(() => () => tube.dispose(), [tube])

  useFrame((s) => {
    const p = journeyProgress(story.t)
    // map even DOM spacing (p) to the curve parameter of each stop
    const k = p * (stops.length - 1)
    const i = Math.min(stops.length - 2, Math.floor(k))
    const f = k - i
    const u = p <= 0 ? 0 : params[i] + (params[i + 1] - params[i]) * f
    tube.setDrawRange(0, Math.floor(u * segments) * perSeg)
    if (tubeMat.current) tubeMat.current.opacity = p > 0 ? 0.95 : 0
    if (head.current) {
      head.current.visible = p > 0 && p < 1
      if (head.current.visible) head.current.position.copy(curve.getPointAt(Math.min(0.9999, Math.max(0.0001, u))))
    }
    nodes.current?.children.forEach((n, j) => {
      const lit = u >= params[j] - 0.002 && p > 0
      const target = lit ? 1 : 0.001
      const sc = n.scale.x + (target - n.scale.x) * 0.12
      n.scale.setScalar(sc)
      n.rotation.y = s.clock.elapsedTime * 0.8
    })
  })

  return (
    <group>
      <JhansiTown />
      <School />
      <Zenith />
      <mesh geometry={tube}>
        <meshBasicMaterial ref={tubeMat} color="#ff6a2e" transparent opacity={0} toneMapped={false} />
      </mesh>
      <group ref={head}>
        <mesh>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshBasicMaterial color="#fff1e0" toneMapped={false} />
        </mesh>
        <Glow color="#ff5a1f" size={6} position={[0, 0, 0]} opacity={0.9} />
      </group>
      <group ref={nodes}>
        {stops.map((st, j) => (
          <group key={j} position={[st[0], -1.8, st[2]]} scale={0.001}>
            <mesh>
              <octahedronGeometry args={[0.9, 0]} />
              <meshBasicMaterial color="#ffb38a" toneMapped={false} />
            </mesh>
            <mesh position={[0, 12, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 24, 6, 1, true]} />
              <meshBasicMaterial color="#ff7a45" transparent opacity={0.35} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
