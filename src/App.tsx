import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { chapters, projectById } from './content'
import { detectTier, hasWebGL, prefersReducedMotion } from './lib/env'
import { enableHashSync, gsap, initScroll, lockScroll, scrollToChapter, ScrollTrigger } from './lib/scroll'
import { setUI, story } from './lib/store'
import { About } from './sections/About'
import { Hackfest, Mhmun, Nymeria } from './sections/Events'
import { Hero, Portal } from './sections/Hero'
import { Journey } from './sections/Journey'
import { ProjectChapter } from './sections/Projects'
import { SimDemo } from './sections/SimDemo'
import { PhoneScreenPortal } from './ui/PhoneScreen'
import { Preloader } from './ui/Preloader'

const Experience = lazy(() => import('./scene/Experience'))

function deepLinkTarget() {
  const id = location.hash.slice(1)
  return chapters.some((c) => c.id === id) && id !== 'hello' ? id : null
}

export default function App() {
  const env = useMemo(() => ({ tier: detectTier(), reduced: prefersReducedMotion(), webgl: hasWebGL() }), [])
  const [sceneReady, setSceneReady] = useState(!env.webgl)
  const [deepLink] = useState(deepLinkTarget)

  // never let a stalled GPU / background tab trap the visitor on the preloader
  useEffect(() => {
    const id = window.setTimeout(() => setSceneReady(true), 5000)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const cleanup = initScroll()
    lockScroll(true)
    setUI({ webgl: env.webgl })
    return cleanup
  }, [env.webgl])

  // pointer → story (normalised, un-smoothed; the scene smooths it)
  useEffect(() => {
    if (env.reduced) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      story.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      story.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [env.reduced])

  const onIntro = useCallback(() => {
    lockScroll(false)
    ScrollTrigger.refresh()
    const finish = () => {
      setUI({ introDone: true })
      enableHashSync()
    }
    if (deepLink || env.reduced) {
      story.intro = 1
      if (deepLink) {
        setUI({ entered: true })
        scrollToChapter(deepLink, { immediate: true })
      }
      finish()
      return
    }
    gsap.to(story, { intro: 1, duration: 3.4, ease: 'power2.inOut', onComplete: finish })
  }, [deepLink, env.reduced])

  return (
    <>
      <a className="skip-link" href="#about">
        Skip the intro
      </a>

      <div className="stage" aria-hidden>
        {env.webgl ? (
          <Suspense fallback={null}>
            <Experience tier={env.tier} reduced={env.reduced} onReady={() => setSceneReady(true)} />
          </Suspense>
        ) : (
          <div className="stage-fallback" />
        )}
      </div>
      {env.webgl && <PhoneScreenPortal reduced={env.reduced} />}

      <Preloader ready={sceneReady} skip={!!deepLink} onDone={onIntro} />

      <main id="main">
        <Hero />
        <Portal />
        <About />
        <ProjectChapter project={projectById.unioffice} align="right" />
        <ProjectChapter project={projectById.orcades} align="left" />
        <ProjectChapter project={projectById.simulator} align="right" tall>
          <SimDemo />
        </ProjectChapter>
        <ProjectChapter project={projectById.vinacou} align="left" />
        <Nymeria />
        <Mhmun />
        <Hackfest />
        <Journey />
        {chapters.slice(11).map((c) => (
          <section key={c.id} id={c.id} data-chapter={c.id} className="chapter" style={{ minHeight: '200vh' }}>
            <div className="sticky" style={{ padding: 'var(--gutter)' }}>
              <p className="mono">{c.group}</p>
              <h2 className="display" style={{ fontSize: 'clamp(48px, 9vw, 150px)' }}>
                {c.label}
              </h2>
            </div>
          </section>
        ))}
      </main>
    </>
  )
}
