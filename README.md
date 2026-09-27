# Madhavan Sahu — A Digital Universe

My portfolio, built as an interactive 3D experience rather than a resume page.

It starts in the dark with a single object that assembles into a phone. The phone's screen is real HTML — pick an app or scroll, and the camera dives through the glass into a stylised world where every building is something I've built or done:

| Place | What it is |
| --- | --- |
| The beacon | About me |
| A workspace tower | **UNIOFFICE** — my flagship product, live and in testing ([unioffice.pro](https://unioffice.pro)) |
| A twisting sculpture | **ORCADES** — creative agency ([orcades.vercel.app](https://orcades.vercel.app)) |
| A district of blocks | **Business Simulator** — the blocks *are* a live revenue chart you can play with ([live](https://business-simulator-eight.vercel.app/)) |
| An acoustic showroom | **Vinacou** — website for an acoustic-interiors firm, with a clap demo ([live](https://vinayakoo.vercel.app/)) |
| An arena | **NYMERIA** — Global AI Community Gurgaon Chapter hackathon, winner |
| An auditorium of 1,600 figures | **MHMUN** — Creative Director, 1600+ students |
| Three track pods | **Hansraj Hackfest** — President, 130+ students |

Then the world turns into a timeline (Jhansi → now), shows what I can build for you, and collapses back into the object it came from.

## Stack

- **React 19 + TypeScript + Vite**
- **Three.js / React Three Fiber / drei** — the whole world is procedural: no model downloads
- **GSAP + ScrollTrigger** for reveals, **Lenis** for smooth scroll
- Three's **CSS3DRenderer** projects the phone's DOM screen onto the 3D glass
- **WebAudio** for the synthesised clap in the Vinacou chapter

## How it fits together

- `src/content.ts` — every fact on the site, in one place (tests keep the links and numbers exact)
- `src/lib/scroll.ts` — turns scroll position into chapter-space time `story.t`
- `src/scene/shots.ts` — camera keyframes per chapter; `CameraRig` samples them every frame
- `src/scene/world/*` — the city and each landmark
- `src/sections/*` — the accessible DOM layer that sits over the canvas

Scroll data never goes through React state; the scene reads a plain mutable `story` object each frame.

## Performance and accessibility

- The 3D scene is code-split and loaded lazily; all shaders are precompiled while the preloader shows
- Instanced meshes for the city, the 1,600 audience figures and the 130 hackathon participants
- Pixel ratio capped per device tier; a lighter city on phones and low-power devices
- Respects `prefers-reduced-motion` (no smooth scrolling, no intro, camera cuts instead of flights)
- Works without WebGL (a CSS phone, same content)
- Every chapter is semantic HTML with headings, keyboard-reachable controls, a skip link and a full chapter index

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run lint
npm run typecheck
npm test
```

## Contact

[madhavansahu@gmail.com](mailto:madhavansahu@gmail.com) · [LinkedIn](https://www.linkedin.com/in/madhavan-sahu-9a5097302/) · [GitHub](https://github.com/MAD1IZJOD)
