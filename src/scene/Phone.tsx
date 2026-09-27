import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { getUI, setUI, story, useUI } from '../lib/store'
import { PX_W, SCREEN_H, SCREEN_W, getScreenHost } from './screenHost'
import { circuitTexture, glowTexture, roundedSlab, screenTexture } from './textures'

const W = 1.62
const H = 3.36

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function Phone({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null)
  const back = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const glass = useRef<THREE.Group>(null)
  const shard = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshBasicMaterial>(null)
  const seam = useRef<THREE.MeshBasicMaterial>(null)

  const circuit = useMemo(() => circuitTexture(), [])
  const glow = useMemo(() => screenTexture(), [])
  const haloTex = useMemo(() => glowTexture(), [])
  const halo = useRef<THREE.Mesh>(null)
  const shardEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.95, 0)), [])
  const backGeo = useMemo(() => roundedSlab(W, H, 0.09, 0.2, 0.025), [])
  const glassGeo = useMemo(() => roundedSlab(W - 0.02, H - 0.02, 0.035, 0.19, 0.01), [])
  useEffect(
    () => () => {
      circuit.dispose()
      glow.dispose()
      haloTex.dispose()
      shardEdges.dispose()
      backGeo.dispose()
      glassGeo.dispose()
    },
    [circuit, glow, haloTex, shardEdges, backGeo, glassGeo],
  )

  const entered = useUI((s) => s.entered)
  const anchor = useRef<THREE.Object3D>(null)
  const gl = useThree((st) => st.gl)

  // Project the real DOM screen onto the glass with three's CSS3DRenderer.
  const css = useMemo(() => {
    const renderer = new CSS3DRenderer()
    renderer.domElement.className = 'phone-css3d'
    const scene = new THREE.Scene()
    const obj = new CSS3DObject(getScreenHost())
    obj.matrixAutoUpdate = false
    scene.add(obj)
    return { renderer, scene, obj }
  }, [])
  useEffect(() => {
    const parent = gl.domElement.parentElement
    parent?.appendChild(css.renderer.domElement)
    return () => {
      css.renderer.domElement.remove()
    }
  }, [css, gl])
  const pxScale = useMemo(() => new THREE.Matrix4().makeScale(SCREEN_W / PX_W, SCREEN_W / PX_W, SCREEN_W / PX_W), [])
  const lastSize = useRef({ w: 0, h: 0 })

  const flourish = useRef(0)
  useEffect(() => {
    if (!entered || reduced) return
    flourish.current = 1
  }, [entered, reduced])

  useFrame((state, dt) => {
    const g = root.current
    if (!g) return
    const time = state.clock.elapsedTime
    const intro = story.intro
    const t = story.t

    // scrolling past the hero counts as entering
    if (t > 0.35 && !getUI().entered) setUI({ entered: true })

    // Hide completely once the camera has passed through the glass.
    const cz = state.camera.position.z
    g.visible = t < 2 && cz > 0.14
    if (!g.visible) {
      getScreenHost().style.visibility = 'hidden'
      return
    }

    const appear = smoothstep(0.0, 0.3, intro)
    const assemble = smoothstep(0.32, 0.85, intro)
    const portal = smoothstep(1.05, 1.5, t)

    // entering spin: a single decaying turn
    flourish.current = Math.max(0, flourish.current - dt * 0.7)
    const fl = 1 - flourish.current
    const spin = flourish.current > 0 ? (1 - Math.pow(1 - fl, 3)) * Math.PI * 2 : 0

    const idle = reduced ? 0 : 1 - portal
    const explode = (1 - assemble) * 2.4 + Math.sin(fl * Math.PI) * (flourish.current > 0 ? 0.55 : 0)

    g.rotation.y = (1 - assemble) * -1.2 + spin + idle * (Math.sin(time * 0.35) * 0.1 + story.pointer.x * 0.28)
    g.rotation.x = idle * (-story.pointer.y * 0.14 + Math.sin(time * 0.5) * 0.03)
    g.rotation.z = (1 - assemble) * 0.35
    g.position.y = idle * Math.sin(time * 0.8) * 0.04
    const s = 0.15 + assemble * 0.85
    g.scale.setScalar(s)

    if (back.current) back.current.position.z = -explode * 0.5
    if (core.current) {
      core.current.position.z = 0
      ;(core.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + explode * 0.6 + (1 - assemble) * 0.5
    }
    if (glass.current) glass.current.position.z = 0.07 + explode * 0.55

    // The shard: the mysterious object that becomes the phone.
    if (shard.current) {
      const shardScale = appear * (1 - assemble)
      shard.current.visible = shardScale > 0.01
      shard.current.scale.setScalar(Math.max(0.001, shardScale * 1.1))
      shard.current.rotation.set(time * 0.6, time * 0.9, 0)
    }

    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial
      m.opacity = (0.22 + appear * 0.25 + (1 - assemble) * appear * 0.3) * (1 - portal)
      halo.current.scale.setScalar(7 + Math.sin(time * 0.6) * 0.25)
    }

    // Screen dims toward the background colour as the camera dives in.
    if (screenMat.current) screenMat.current.opacity = 1
    const host = getScreenHost()
    const o = assemble * (1 - smoothstep(1.02, 1.22, t))
    host.style.opacity = String(o)
    host.style.visibility = o < 0.02 ? 'hidden' : 'visible'
    if (o >= 0.02 && anchor.current) {
      const { width, height } = state.size
      if (lastSize.current.w !== width || lastSize.current.h !== height) {
        css.renderer.setSize(width, height)
        lastSize.current = { w: width, h: height }
      }
      g.updateMatrixWorld()
      css.obj.matrix.multiplyMatrices(anchor.current.matrixWorld, pxScale)
      css.obj.matrixWorld.copy(css.obj.matrix)
      css.renderer.render(css.scene, state.camera)
    }
    if (seam.current) seam.current.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 1.6)) * assemble
  })

  return (
    <group>
      <mesh ref={halo} position={[0.3, 0.4, -2.2]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={haloTex} color="#ff5a1f" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
      </mesh>
      <spotLight position={[-4, 5, -3]} angle={0.6} penumbra={1} intensity={60} color="#ffe6cf" distance={14} />
      <spotLight position={[4, -3, -2]} angle={0.7} penumbra={1} intensity={40} color="#ff6a2e" distance={12} />
      <group ref={shard}>
        <mesh>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#1a1612" metalness={1} roughness={0.25} flatShading />
        </mesh>
        <lineSegments geometry={shardEdges}>
          <lineBasicMaterial color="#ff6a2e" transparent opacity={0.9} toneMapped={false} />
        </lineSegments>
      </group>

      <group ref={root} scale={0.15}>
        {/* back plate — brushed dark titanium */}
        <group ref={back}>
          <mesh geometry={backGeo}>
            <meshStandardMaterial color="#6d655c" metalness={0.95} roughness={0.28} envMapIntensity={1.4} />
          </mesh>
          {/* ember light seam */}
          <mesh position={[-W / 2 - 0.004, 0.2, 0]}>
            <boxGeometry args={[0.012, H * 0.55, 0.03]} />
            <meshBasicMaterial ref={seam} color="#ff6a2e" transparent toneMapped={false} />
          </mesh>
          {/* hex sensor */}
          <mesh position={[0.46, H / 2 - 0.38, -0.055]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 6]} />
            <meshStandardMaterial color="#0f0d0b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* inner core — visible when the device is exploded */}
        <mesh ref={core}>
          <boxGeometry args={[W - 0.12, H - 0.12, 0.02]} />
          <meshStandardMaterial map={circuit} emissiveMap={circuit} emissive="#ffffff" emissiveIntensity={0.6} metalness={0.2} roughness={0.8} />
        </mesh>

        {/* floating glass + screen */}
        <group ref={glass}>
          <mesh geometry={glassGeo}>
            <meshStandardMaterial color="#0c0b0a" metalness={0.7} roughness={0.08} envMapIntensity={1.6} />
          </mesh>
          <mesh position={[0, 0, 0.019]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            <meshBasicMaterial ref={screenMat} map={glow} toneMapped={false} />
          </mesh>
          <object3D ref={anchor} position={[0, 0, 0.022]} />
        </group>
      </group>
    </group>
  )
}

