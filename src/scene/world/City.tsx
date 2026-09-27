import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Tier } from '../../lib/env'
import { places } from '../shots'
import { windowsTexture } from '../textures'

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Ground grid that fades with distance (fog does the rest). */
function gridTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = '#0c0b0a'
  g.fillRect(0, 0, 256, 256)
  g.strokeStyle = 'rgba(239,233,221,0.09)'
  g.lineWidth = 2
  g.strokeRect(0, 0, 256, 256)
  g.strokeStyle = 'rgba(239,233,221,0.035)'
  g.lineWidth = 1
  for (let i = 1; i < 4; i++) {
    g.beginPath()
    g.moveTo(i * 64, 0)
    g.lineTo(i * 64, 256)
    g.moveTo(0, i * 64)
    g.lineTo(256, i * 64)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(120, 120)
  t.anisotropy = 8
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// footprints to keep clear of filler buildings: [x, z, radius]
const reserved: [number, number, number][] = [
  [places.beacon[0], places.beacon[2], 6],
  [places.unioffice[0], places.unioffice[2], 8],
  [places.orcades[0], places.orcades[2], 8],
  [places.simulator[0], places.simulator[2], 9],
  [places.vinacou[0], places.vinacou[2], 8],
  [places.nymeria[0], places.nymeria[2], 16],
  [places.mhmun[0], places.mhmun[2] + 4, 24],
  [places.hackfest[0], places.hackfest[2], 16],
  [places.school[0], places.school[2], 6],
  [places.jhansi[0], places.jhansi[2], 8],
  [places.zenith[0], places.zenith[2], 7],
]

export function City({ tier }: { tier: Tier }) {
  const grid = useMemo(() => gridTexture(), [])
  const win = useMemo(() => windowsTexture(6, 10, 0.22, 3, '#ffe2c2'), [])
  const blocks = useRef<THREE.InstancedMesh>(null)
  const lights = useRef<THREE.InstancedMesh>(null)

  const layout = useMemo(() => {
    const r = rng(42)
    const out: { x: number; z: number; w: number; d: number; h: number }[] = []
    const count = tier === 'high' ? 420 : 220
    let guard = 0
    while (out.length < count && guard++ < 6000) {
      const x = (r() - 0.5) * 120
      const z = 10 - r() * 290
      if (Math.abs(x) < 4.5) continue // keep the flight corridor clear
      if (z > -24) continue
      if (reserved.some(([rx, rz, rr]) => Math.hypot(x - rx, z - rz) < rr)) continue
      const far = Math.min(1, Math.abs(x) / 50)
      out.push({ x, z, w: 0.8 + r() * 2.2, d: 0.8 + r() * 2.2, h: 0.4 + Math.pow(r(), 2.2) * (4 + far * 14) })
    }
    return out
  }, [tier])

  useEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3()
    const p = new THREE.Vector3()
    const color = new THREE.Color()
    layout.forEach((b, i) => {
      p.set(b.x, -3 + b.h / 2, b.z)
      s.set(b.w, b.h, b.d)
      m.compose(p, q, s)
      blocks.current?.setMatrixAt(i, m)
      p.set(b.x, -3 + b.h + 0.06, b.z)
      s.set(0.18, 0.12, 0.18)
      m.compose(p, q, s)
      lights.current?.setMatrixAt(i, m)
      const warm = (i * 7919) % 5 === 0
      color.set(warm ? '#ff7a45' : '#efe9dd')
      lights.current?.setColorAt(i, color)
    })
    if (blocks.current) blocks.current.instanceMatrix.needsUpdate = true
    if (lights.current) {
      lights.current.instanceMatrix.needsUpdate = true
      if (lights.current.instanceColor) lights.current.instanceColor.needsUpdate = true
    }
  }, [layout])

  useEffect(
    () => () => {
      grid.dispose()
      win.dispose()
    },
    [grid, win],
  )

  const lightMat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    if (lightMat.current) lightMat.current.opacity = 0.65 + Math.sin(state.clock.elapsedTime * 1.3) * 0.15
  })

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -3, -140]}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial map={grid} roughness={0.9} metalness={0.1} />
      </mesh>
      <instancedMesh ref={blocks} args={[undefined, undefined, layout.length]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="#1b1916" emissive="#ffffff" emissiveMap={win} emissiveIntensity={0.55} roughness={0.75} metalness={0.25} />
      </instancedMesh>
      <instancedMesh ref={lights} args={[undefined, undefined, layout.length]} frustumCulled={false}>
        <boxGeometry />
        <meshBasicMaterial ref={lightMat} transparent toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
