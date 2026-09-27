# Madhavan Sahu · A Digital Universe

My portfolio. Not a résumé page, more of a place you can walk around in.

It starts in the dark with a single object that turns into a phone. The phone's screen is real HTML: pick an app or just scroll, and the camera dives through the glass into a small world where every building is something I've made, or something I did with other people.

The story it tries to tell is simple. I build things. I build things with people. I'm still building.

**Things I built**

| Place | What it is |
| --- | --- |
| The beacon | About me |
| A workspace tower | **UNIOFFICE**, my biggest project. Live and in testing ([unioffice.pro](https://unioffice.pro)) |
| A twisting sculpture | **ORCADES**, a creative agency project ([orcades.vercel.app](https://orcades.vercel.app)) |
| A district of blocks | **Business Simulator**. The blocks are a tiny toy market you can play with; the real simulator is [here](https://business-simulator-eight.vercel.app/) |
| An acoustic showroom | **Vinacou**, a website for a firm that sells acoustic interiors, plus a clap demo ([live](https://vinayakoo.vercel.app/)) |

**Things I did with people**

| Place | What it is |
| --- | --- |
| An arena | **NYMERIA**. My team won a Global AI Community Gurgaon Chapter hackathon; I took care of the technical side |
| An auditorium of 1,600 figures | **MHMUN**. I was Creative Director for an event with 1,600+ students |
| Three track pods | **Hansraj Hackfest**. I was President; 130+ students learned cloud, web and design |

After that, the world turns into a timeline (Jhansi to now), shows the kinds of things I make, and folds back into the object it started from.

## Stack

- **React 19 + TypeScript + Vite**
- **Three.js and React Three Fiber**. The whole world is generated in code, so there are no model downloads
- **GSAP + ScrollTrigger** for reveals, **Lenis** for smooth scrolling
- Three's **CSS3DRenderer** puts the phone's HTML screen onto the 3D glass
- **WebAudio** for the synthesised clap in the Vinacou chapter

## How it fits together

- `src/content.ts`: every fact and every line of copy, in one place (tests keep the links and numbers exact)
- `src/lib/scroll.ts`: turns the scroll position into chapter time, `story.t`
- `src/scene/shots.ts`: camera keyframes for each chapter, sampled every frame by `CameraRig`
- `src/scene/world/*`: the city and each landmark
- `src/sections/*`: the accessible HTML layer that sits over the canvas

Scroll data never goes through React state. The scene reads a plain `story` object every frame.

## Performance and accessibility

- The 3D scene is loaded lazily, and every shader is compiled while the loading screen is up
- Instanced meshes for the city, the 1,600 audience figures and the 130 hackathon participants
- Pixel ratio capped per device, with a lighter city on phones and low-power devices
- Respects `prefers-reduced-motion` (no smooth scrolling, no intro, camera cuts instead of flights)
- Still works without WebGL (a CSS phone, same content)
- Every chapter is semantic HTML with real headings, keyboard-reachable controls, a skip link and a full chapter index

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

## Say hi

[madhavansahu@gmail.com](mailto:madhavansahu@gmail.com) · [LinkedIn](https://www.linkedin.com/in/madhavan-sahu-9a5097302/) · [GitHub](https://github.com/MAD1IZJOD)
