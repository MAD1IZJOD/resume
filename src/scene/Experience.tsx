import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'
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
        scene.fog = new THREE.Fog('#0b0a09', 14, 40)
      }}
      aria-hidden
    >
      <CameraRig reduced={reduced} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff1e0" />
      <pointLight position={[-3, -1, 3]} intensity={6} color="#ff5a1f" distance={10} />

      <Suspense fallback={null}>
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#fff3e6" position={[0, 4, 4]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#ff7a45" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 1, 1]} />
          <Lightformer form="rect" intensity={0.8} color="#c9d6ff" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 0.6, 1]} />
          <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, 0, -6]} scale={3} />
        </Environment>
      </Suspense>

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
