import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { softworker } from '../../content'
import { story } from '../../lib/store'
import { places } from '../shots'
import { windowsTexture } from '../textures'
import { Glow } from './Landmarks'

/* SOFTWORKER AI: a research building. Three stacked modules (SEO, AEO, GEO)
   around a dark core, fed by a thin pipeline that carries content up the side. */

const C = softworker.accent
const BASE = 0.6
const H = 2.6
const GAP = 0.3
const TOP = BASE + 3 * H + 2 * GAP
// footprints shift a little floor to floor, like modules stacked by hand
const MODULES = [
  { w: 7, d: 4.6, x: -0.4, z: 0 },
  { w: 4.8, d: 6.2, x: 0.7, z: 0.2 },
  { w: 6.2, d: 4.2, x: -0.2, z: -0.3 },
]
const SPINE: [number, number] = [-4.6, 1.2]
const PACKETS = 9

const midY = (i: number) => BASE + i * (H + GAP) + H / 2
const faceX = (i: number) => MODULES[i].x - MODULES[i].w / 2

const tmpM = new THREE.Matrix4()
const tmpQ = new THREE.Quaternion()
const tmpS = new THREE.Vector3()
const tmpP = new THREE.Vector3()

function Module({ i, map }: { i: number; map: THREE.Texture }) {
  const body = useRef<THREE.MeshStandardMaterial>(null)
  const seam = useRef<THREE.MeshBasicMaterial>(null)
  const feed = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((_, dt) => {
    const on = story.focus === i
    const k = 1 - Math.exp(-dt * 4)
    if (body.current) body.current.emissiveIntensity += ((on ? 1.25 : 0.8) - body.current.emissiveIntensity) * k
    if (seam.current) seam.current.opacity += ((on ? 0.95 : 0.3) - seam.current.opacity) * k
    if (feed.current) feed.current.opacity += ((on ? 0.85 : 0.25) - feed.current.opacity) * k
  })
  const { w, d, x, z } = MODULES[i]
  const y = midY(i)
  const reach = faceX(i) - SPINE[0]
  return (
    <>
      <mesh position={[x, y, z]}>
        <boxGeometry args={[w, H, d]} />
        <meshStandardMaterial ref={body} color="#12120f" emissive="#ffffff" emissiveMap={map} emissiveIntensity={0.8} roughness={0.35} metalness={0.6} />
      </mesh>
      {/* accent seam along the top edge */}
      <mesh position={[x, y + H / 2 + 0.03, z]}>
        <boxGeometry args={[w + 0.08, 0.06, d + 0.08]} />
        <meshBasicMaterial ref={seam} color={C} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      {/* feeder from the pipeline into this floor */}
      <mesh position={[SPINE[0] + reach / 2, y, SPINE[1]]}>
        <boxGeometry args={[reach, 0.07, 0.07]} />
        <meshBasicMaterial ref={feed} color={C} transparent opacity={0.25} toneMapped={false} />
      </mesh>
    </>
  )
}

/** Small packets of content rising up the pipeline and turning into each floor. */
function Packets() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  useFrame((s) => {
    const m = mesh.current
    if (!m) return
    const time = s.clock.elapsedTime
    for (let j = 0; j < PACKETS; j++) {
      const target = j % 3
      const rise = midY(target) - BASE
      const run = faceX(target) - SPINE[0]
      const f = (time * 0.09 + j / PACKETS) % 1
      const d = f * (rise + run)
      if (d < rise) tmpP.set(SPINE[0], BASE + d, SPINE[1])
      else tmpP.set(SPINE[0] + (d - rise), midY(target), SPINE[1])
      // grow in at the intake, shrink away as it reaches the floor
      tmpS.setScalar(Math.min(1, f * 12, (1 - f) * 12))
      tmpM.compose(tmpP, tmpQ, tmpS)
      m.setMatrixAt(j, tmpM)
    }
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PACKETS]} frustumCulled={false}>
      <boxGeometry args={[0.16, 0.16, 0.16]} />
      <meshBasicMaterial color="#e6fffa" toneMapped={false} />
    </instancedMesh>
  )
}

export function SoftworkerHQ() {
  const maps = useMemo(() => [31, 32, 33].map((seed) => windowsTexture(16, 4, 0.5, seed, '#dcfff8')), [])
  useEffect(() => () => maps.forEach((t) => t.dispose()), [maps])
  const frameGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 0.04, 2.6)), [])
  useEffect(() => () => frameGeo.dispose(), [frameGeo])
  const frame = useRef<THREE.LineSegments>(null)
  useFrame((s) => {
    if (frame.current) frame.current.rotation.y = s.clock.elapsedTime * 0.2
  })
  const [x, y, z] = places.softworker
  return (
    <group position={[x, y, z]}>
      {/* podium */}
      <mesh position={[0, BASE / 2, 0]}>
        <boxGeometry args={[10, BASE, 8]} />
        <meshStandardMaterial color="#161512" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* the core the floors are stacked around, visible through the gaps */}
      <mesh position={[0, BASE + (TOP - BASE) / 2, 0]}>
        <boxGeometry args={[2.2, TOP - BASE, 2.2]} />
        <meshStandardMaterial color="#0f0f0d" roughness={0.5} metalness={0.5} />
      </mesh>
      {MODULES.map((_, i) => (
        <Module key={i} i={i} map={maps[i]} />
      ))}
      {/* roof */}
      <mesh position={[MODULES[2].x, TOP + 0.06, MODULES[2].z]}>
        <boxGeometry args={[MODULES[2].w + 0.2, 0.12, MODULES[2].d + 0.2]} />
        <meshStandardMaterial color="#161512" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* the pipeline: an intake at street level and a thin riser up the side */}
      <mesh position={[SPINE[0], BASE + 0.2, SPINE[1]]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#1b1a17" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[SPINE[0], BASE + (midY(2) - BASE) / 2, SPINE[1]]}>
        <cylinderGeometry args={[0.05, 0.05, midY(2) - BASE, 8]} />
        <meshBasicMaterial color={C} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <Packets />
      {/* crown: a square frame turning slowly over the roof */}
      <lineSegments ref={frame} geometry={frameGeo} position={[MODULES[2].x, TOP + 1.3, MODULES[2].z]}>
        <lineBasicMaterial color={C} transparent opacity={0.8} toneMapped={false} />
      </lineSegments>
      <Glow color={C} size={9} position={[MODULES[2].x, TOP + 1.3, MODULES[2].z]} opacity={0.25} />
      <pointLight position={[-6, 6, 5]} color={C} intensity={50} distance={28} />
    </group>
  )
}
