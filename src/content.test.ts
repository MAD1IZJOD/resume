import { describe, expect, it } from 'vitest'
import * as content from './content'
import { chapters, hackathon, hackfest, mhmun, person, projects, softworker, timeline } from './content'
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

  it('keeps the internship exact and in the right place in the story', () => {
    expect(softworker).toMatchObject({ company: 'Softworker AI', role: 'Business Research Analyst Intern' })
    expect(softworker.focus.map((f) => [f.name, f.full])).toEqual([
      ['SEO', 'Search Engine Optimization'],
      ['AEO', 'Answer Engine Optimization'],
      ['GEO', 'Generative Engine Optimization'],
    ])
    // work comes after the things I did with people, before the journey
    const ids = chapters.map((c) => c.id)
    expect(ids.indexOf('softworker')).toBe(ids.indexOf('hackfest') + 1)
    expect(ids.indexOf('journey')).toBe(ids.indexOf('softworker') + 1)
    const titles = timeline.map((m) => m.title)
    expect(titles.indexOf('Softworker AI')).toBe(titles.indexOf('Global AI Community, Gurgaon Chapter') + 1)
    expect(titles.indexOf('Zenith School of AI')).toBe(titles.indexOf('Softworker AI') + 1)
  })

  it('has a timeline stop for every path node in the 3D journey', () => {
    expect(timeline).toHaveLength(9)
  })

  it('has camera shots for every chapter', () => {
    for (const c of chapters) expect(shots[c.id]?.length).toBeGreaterThan(0)
  })

  it('keeps em dashes out of the copy', () => {
    expect(JSON.stringify(content)).not.toContain(String.fromCharCode(0x2014))
  })
})
