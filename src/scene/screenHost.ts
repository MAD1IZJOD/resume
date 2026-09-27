// The phone screen is a real DOM subtree (rendered by React in the normal DOM
// tree) that the 3D phone projects onto its glass with CSS3DRenderer.
export const SCREEN_W = 1.44
export const SCREEN_H = 3.08
export const PX_W = 300
export const PX_H = Math.round((PX_W * SCREEN_H) / SCREEN_W)

let host: HTMLDivElement | null = null

export function getScreenHost() {
  if (!host) {
    host = document.createElement('div')
    host.className = 'phone-screen'
    host.style.width = `${PX_W}px`
    host.style.height = `${PX_H}px`
    host.style.opacity = '0'
    host.style.visibility = 'hidden'
  }
  return host
}
