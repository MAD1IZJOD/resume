import * as THREE from 'three'
import { rng } from '../lib/rng'

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}


/** Glowing circuit traces for the phone's inner core layer. */
export function circuitTexture() {
  const [c, g] = canvas(256, 512)
  g.fillStyle = '#0d0b09'
  g.fillRect(0, 0, 256, 512)
  const r = rng(7)
  g.lineCap = 'round'
  for (let i = 0; i < 70; i++) {
    let x = Math.floor(r() * 16) * 16 + 8
    let y = Math.floor(r() * 32) * 16 + 8
    const hot = r() > 0.72
    g.strokeStyle = hot ? 'rgba(255,110,50,0.95)' : 'rgba(255,120,60,0.22)'
    g.lineWidth = hot ? 2 : 1.2
    g.beginPath()
    g.moveTo(x, y)
    for (let s = 0; s < 5; s++) {
      if (r() > 0.5) x += (r() > 0.5 ? 1 : -1) * 16 * Math.ceil(r() * 3)
      else y += (r() > 0.5 ? 1 : -1) * 16 * Math.ceil(r() * 4)
      g.lineTo(x, y)
    }
    g.stroke()
    g.fillStyle = hot ? '#ffb38a' : 'rgba(255,140,90,0.4)'
    g.beginPath()
    g.arc(x, y, hot ? 3 : 2, 0, Math.PI * 2)
    g.fill()
  }
  // central die
  g.strokeStyle = 'rgba(255,120,60,0.9)'
  g.lineWidth = 2
  g.strokeRect(88, 196, 80, 120)
  g.fillStyle = 'rgba(255,90,31,0.15)'
  g.fillRect(88, 196, 80, 120)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** Soft vertical glow behind the phone's HTML screen. */
export function screenTexture() {
  const [c, g] = canvas(128, 256)
  const grd = g.createRadialGradient(64, 60, 4, 64, 120, 190)
  grd.addColorStop(0, '#2a1a12')
  grd.addColorStop(0.45, '#130f0c')
  grd.addColorStop(1, '#0b0a09')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Lit windows for towers: `lit` controls density. */
export function windowsTexture(cols: number, rows: number, lit: number, seed: number, color = '#fff2d8') {
  const cw = 8
  const ch = 12
  const [c, g] = canvas(cols * cw, rows * ch)
  g.fillStyle = '#0e0d0c'
  g.fillRect(0, 0, c.width, c.height)
  const r = rng(seed)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = r()
      if (v < lit) {
        g.globalAlpha = 0.35 + r() * 0.65
        g.fillStyle = color
        g.fillRect(x * cw + 2, y * ch + 3, cw - 4, ch - 6)
      }
    }
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** A thin slab with rounded corners (like a device body) — RoundedBox can't do big radii on thin depth. */
export function roundedSlab(w: number, h: number, depth: number, r: number, bevel = 0.012) {
  const s = new THREE.Shape()
  const x = -w / 2 + bevel
  const y = -h / 2 + bevel
  const ww = w - bevel * 2
  const hh = h - bevel * 2
  const rr = Math.min(r, ww / 2, hh / 2)
  s.moveTo(x + rr, y)
  s.lineTo(x + ww - rr, y)
  s.quadraticCurveTo(x + ww, y, x + ww, y + rr)
  s.lineTo(x + ww, y + hh - rr)
  s.quadraticCurveTo(x + ww, y + hh, x + ww - rr, y + hh)
  s.lineTo(x + rr, y + hh)
  s.quadraticCurveTo(x, y + hh, x, y + hh - rr)
  s.lineTo(x, y + rr)
  s.quadraticCurveTo(x, y, x + rr, y)
  const g = new THREE.ExtrudeGeometry(s, {
    depth: Math.max(0.001, depth - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 10,
  })
  g.translate(0, 0, -depth / 2 + bevel)
  g.computeVertexNormals()
  return g
}

/** Radial glow sprite (white → transparent); tint with material colour. */
export function glowTexture() {
  const [c, g] = canvas(256, 256)
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  grd.addColorStop(0.6, 'rgba(255,255,255,0.08)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
