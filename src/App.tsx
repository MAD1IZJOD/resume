import { useEffect } from 'react'
import { chapters } from './content'
import { initScroll } from './lib/scroll'

export default function App() {
  useEffect(() => initScroll(), [])

  return (
    <main id="main">
      {chapters.map((c) => (
        <section key={c.id} id={c.id} data-chapter={c.id} style={{ minHeight: '100vh', padding: 'var(--gutter)' }}>
          <p className="mono">{c.group}</p>
          <h2 className="display" style={{ fontSize: 'clamp(48px, 10vw, 160px)' }}>
            {c.label}
          </h2>
        </section>
      ))}
    </main>
  )
}
