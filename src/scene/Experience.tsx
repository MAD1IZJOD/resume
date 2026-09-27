import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { Tier } from '../lib/env'
import { CameraRig } from './CameraRig'
import { Phone } from './Phone'
import { Core } from './world/Core'
import { World } from './world/World'

type Props = { tier: Tier; reduced: boolean; onReady: () => void }

export default function Experience({ tier, reduced, onReady }: Props) {
  return (
    <Canvas
      className="experience-canvas"
      dpr={[1, tier === 'high' ? 1.75 : 1.3]}
      gl={{ antialias: tier === 'high', powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: 38, near: 0.05, far: 420, position: [0, 0, 11] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.background = new THREE.Color('#0b0a09')
        scene.fog = new THREE.Fog('#0b0a09', 9, 24)
      }}
      aria-hidden
    >
      <CameraRig reduced={reduced} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff1e0" />
      <pointLight position={[-3, -1, 3]} intensity={6} color="#ff5a1f" distance={10} />

      <Reflections />

      <Phone reduced={reduced} />
      <World tier={tier} />
      <Core />
      <Warmup onReady={onReady} />
    </Canvas>
  )
}

/**
 * Compile every shader up front (while the preloader is still showing) so the
 * first flight into a new part of the world doesn't hitch on shader compiles.
 */
function Warmup({ onReady }: { onReady: () => void }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    let alive = true
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => requestAnimationFrame(() => alive && onReady()))
    return () => {
      alive = false
    }
  }, [gl, scene, camera, onReady])
  return null
}

/** A soft studio environment for metal and glass reflections, generated once (no HDR download). */
function Reflections() {
  const get = useThree((s) => s.get)
  useEffect(() => {
    const { gl, scene } = get()
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const env = pmrem.fromScene(room, 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.7
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
      room.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        ;(m.material as THREE.Material | undefined)?.dispose?.()
      })
    }
  }, [get])
  return null
}
