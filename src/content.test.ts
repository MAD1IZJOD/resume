import { describe, expect, it } from 'vitest'
import { chapters, hackathon, hackfest, mhmun, person, projects, timeline } from './content'
import { shots } from './scene/shots'

describe('content', () => {
  it('links every project to its live site', () => {
    const urls = Object.fromEntries(projects.map((p) => [p.id, p.url]))
    expect(urls).toEqual({
      unioffice: 'https://unioffice.pro',
      orcades: 'https://orcades.vercel.app',
      simulator: 'https://business-simulator-eight.vercel.app/',
      vinacou: 'https://vinayakoo.vercel.app/',
    })
  })

  it('keeps contact details exact', () => {
    expect(person.email).toBe('madhavansahu@gmail.com')
    expect(person.github).toBe('https://github.com/MAD1IZJOD')
    expect(person.linkedin).toBe('https://www.linkedin.com/in/madhavan-sahu-9a5097302/')
  })

  it('keeps the event facts exact', () => {
    expect(mhmun).toMatchObject({ attendees: 1600, role: 'Creative Director', year: 2024 })
    expect(hackfest).toMatchObject({ attendees: 130, role: 'President' })
    expect(hackfest.tracks.map((t) => t.id)).toEqual(['cloud', 'web', 'design'])
    expect(hackathon).toMatchObject({ team: 'NYMERIA', result: 'Winner' })
  })

  it('has a timeline stop for every path node in the 3D journey', () => {
    expect(timeline).toHaveLength(8)
  })

  it('has camera shots for every chapter', () => {
    for (const c of chapters) expect(shots[c.id]?.length).toBeGreaterThan(0)
  })
})
