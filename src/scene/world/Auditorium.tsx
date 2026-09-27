import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { mhmun } from '../../content'
import { chapterIndex, mhmunFill, SEATS } from '../../lib/chapterProgress'
import { rng } from '../../lib/rng'
import { story } from '../../lib/store'
import { places } from '../shots'
import { Glow } from './Landmarks'

const idx = chapterIndex('mhmun')

function seatLayout() {
  const out: { x: number; y: number; z: number; row: number }[] = []
  const arc = Math.PI * 0.82
  let row = 0
  while (out.length < SEATS) {
    const r = 4.2 + row * 0.78
    const n = Math.floor((arc * r) / 0.52)
    for (let i = 0; i < n && out.length < SEATS; i++) {
      const a = -arc / 2 + (i + 0.5) * (arc / n)
      out.push({ x: Math.sin(a) * r, y: row * 0.26, z: Math.cos(a) * r, row })
    }
    row++
  }
  return out
}

function screenTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 384
  const g = c.getContext('2d')!
  const grd = g.createLinearGradient(0, 0, 1024, 384)
  grd.addColorStop(0, '#2a0f08')
  grd.addColorStop(1, '#0e0706')
  g.fillStyle = grd
  g.fillRect(0, 0, 1024, 384)
  g.fillStyle = '#ffede0'
  g.font = '700 190px "Inter Tight Variable", "Inter Tight", sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('MHMUN', 512, 170)
  g.font = '500 34px "JetBrains Mono Variable", monospace'
  g.fillStyle = '#ff7a59'
  g.fillText(`${mhmun.year} · JHANSI`, 512, 300)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function Auditorium() {
  const people = useRef<THREE.InstancedMesh>(null)
  const layout = useMemo(() => seatLayout(), [])
  const geo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.11, 0.2, 3, 8)
    g.translate(0, 0.21, 0)
    return g
  }, [])
  const tex = useScreenTexture()

  useEffect(() => {
    const m = people.current
    if (!m) return
    const r = rng(1600)
    const mat = new THREE.Matrix4()
    const c = new THREE.Color()
    layout.forEach((s, i) => {
      const scale = 0.9 + r() * 0.25
      mat.makeScale(scale, scale, scale).setPosition(s.x, s.y, s.z)
      m.setMatrixAt(i, mat)
      // mostly warm white, with committee colours scattered through the crowd
      const v = r()
      c.set(v > 0.93 ? '#ff5a1f' : v > 0.86 ? '#ffd27a' : v > 0.8 ? '#ff7a59' : '#efe2cf')
      m.setColorAt(i, c)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    m.count = 0
  }, [layout])

  useEffect(() => () => geo.dispose(), [geo])

  useFrame(() => {
    const m = people.current
    if (!m) return
    const fill = mhmunFill(story.t)
    // before the chapter the hall is empty; afterwards it stays full
    const target = story.t < idx - 0.5 ? 0 : Math.round(fill * SEATS)
    m.count = target
  })

  const [x, y, z] = places.mhmun
  return (
    <group position={[x, y, z]}>
      {/* hall floor */}
      <mesh position={[0, 0.01, 4]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[21, 64, 0, Math.PI]} />
        <meshStandardMaterial color="#130f0c" roughness={0.9} />
      </mesh>
      {/* raked tiers */}
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={i} position={[0, i * 0.52 - 0.04, 0]}>
          <cylinderGeometry args={[3.85 + i * 1.56, 3.85 + i * 1.56, 0.05, 64, 1, true, -Math.PI * 0.41, Math.PI * 0.82]} />
          <meshBasicMaterial color="#ff7a59" transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      <instancedMesh ref={people} args={[geo, undefined, SEATS]} frustumCulled={false}>
        <meshStandardMaterial color="#ffffff" roughness={0.6} emissive="#3a1a0d" emissiveIntensity={0.4} />
      </instancedMesh>

      {/* stage */}
      <mesh position={[0, 0.4, -3]}>
        <boxGeometry args={[9, 0.8, 3]} />
        <meshStandardMaterial color="#1b1511" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.82, -1.52]}>
        <boxGeometry args={[9, 0.04, 0.04]} />
        <meshBasicMaterial color="#ff5a1f" toneMapped={false} />
      </mesh>
      <mesh position={[0, 4.6, -4.4]}>
        <planeGeometry args={[9, 3.375]} />
        <meshBasicMaterial map={tex ?? undefined} color={tex ? '#ffffff' : '#1a0c08'} toneMapped={false} />
      </mesh>
      {/* dais */}
      <mesh position={[0, 1.3, -2.6]}>
        <boxGeometry args={[2.4, 1, 0.6]} />
        <meshStandardMaterial color="#2a1e16" roughness={0.4} metalness={0.3} />
      </mesh>
      <Glow color="#ff5a1f" size={16} position={[0, 4.6, -4.8]} opacity={0.25} />
      <spotLight position={[0, 14, 10]} angle={0.8} penumbra={0.8} color="#ffe4cc" intensity={400} distance={40} />
    </group>
  )
}

/** The screen text needs the web font; build the texture once fonts are ready. */
function useScreenTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null)
  useEffect(() => {
    let alive = true
    let made: THREE.CanvasTexture | null = null
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!alive) return
      made = screenTexture()
      setTex(made)
    })
    return () => {
      alive = false
      made?.dispose()
    }
  }, [])
  return tex
}
