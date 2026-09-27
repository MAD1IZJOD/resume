import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { story } from '../lib/store'
import { sampleCamera } from './shots'

const BASE_FOV = 38
const tmpLook = new THREE.Vector3()

export function CameraRig({ reduced }: { reduced: boolean }) {
  const pos = useRef(new THREE.Vector3(0, 0, 9))
  const look = useRef(new THREE.Vector3())
  const off = useRef({ side: 0, up: 0 })
  const ptr = useRef({ x: 0, y: 0 })

  useFrame((state, dt) => {
    const camera = state.camera as THREE.PerspectiveCamera
    const scene = state.scene
    if (import.meta.env.DEV) (window as unknown as { __cam: THREE.Camera }).__cam = camera
    const d = Math.min(dt, 1 / 20)
    const pose = sampleCamera(story.t, reduced)
    const { width, height } = state.size
    const aspect = width / height
    const portrait = aspect < 0.9

    // Keep the horizontal field of view stable on narrow screens.
    const fov = aspect < 1.25 ? THREE.MathUtils.radToDeg(2 * Math.atan((Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) * 1.25) / aspect)) : BASE_FOV
    const targetFov = Math.min(fov, 72)
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = targetFov
    }

    // Intro dolly: the camera drifts in from further away while the object assembles.
    const intro = story.intro
    const introPush = (1 - intro) * 4

    const k = reduced ? 1 : 1 - Math.exp(-d * 5.5)
    const mz = portrait ? pose.mz : 1
    tmpLook.set(
      pose.look[0] + (pose.pos[0] - pose.look[0]) * mz,
      pose.look[1] + (pose.pos[1] - pose.look[1]) * mz,
      pose.look[2] + (pose.pos[2] - pose.look[2]) * mz + introPush,
    )
    pos.current.lerp(tmpLook, k)
    look.current.lerp(tmpLook.set(pose.look[0], pose.look[1], pose.look[2]), k)

    // Gentle pointer parallax (desktop only, not with reduced motion).
    if (!reduced) {
      ptr.current.x += (story.pointer.x - ptr.current.x) * (1 - Math.exp(-d * 3))
      ptr.current.y += (story.pointer.y - ptr.current.y) * (1 - Math.exp(-d * 3))
    }
    const dist = pos.current.distanceTo(look.current)
    const par = Math.min(0.9, dist * 0.035)
    camera.position.set(pos.current.x + ptr.current.x * par, pos.current.y + ptr.current.y * par * 0.6, pos.current.z)
    camera.lookAt(look.current)

    // Frame the subject away from the copy using a view offset instead of
    // moving the camera, so perspective stays honest.
    const side = portrait ? 0 : pose.side
    const up = portrait ? pose.up : 0
    off.current.side += (side - off.current.side) * k
    off.current.up += (up - off.current.up) * k
    camera.setViewOffset(width, height, -off.current.side * width * 0.42, off.current.up * height, width, height)
    camera.updateProjectionMatrix()

    const fog = scene.fog as THREE.Fog | null
    if (fog) {
      fog.near += (pose.fog[0] - fog.near) * k
      fog.far += (pose.fog[1] - fog.far) * k
    }
  })

  return null
}
