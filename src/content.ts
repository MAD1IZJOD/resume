// Every fact and every line of copy on the site lives here. Keep it accurate:
// nothing in this file should be embellished beyond what Madhavan has actually done.
//
// The thread running through it: I build things. I build things with people.
// I'm still building.

export const person = {
  name: 'Madhavan Sahu',
  firstName: 'Madhavan',
  email: 'madhavansahu@gmail.com',
  github: 'https://github.com/MAD1IZJOD',
  githubHandle: 'MAD1IZJOD',
  linkedin: 'https://www.linkedin.com/in/madhavan-sahu-9a5097302/',
  roles: ['builder', 'developer', 'designer', 'product builder', 'creative technologist', 'entrepreneur', 'event organiser'],
}

export const education = {
  school: { name: 'Mahatma Hansraj Modern School', city: 'Jhansi', note: 'Until Class 12' },
  current: { name: 'Zenith School of AI', city: 'Gurugram', note: 'Currently studying' },
}

export type Project = {
  id: 'unioffice' | 'orcades' | 'simulator' | 'vinacou'
  index: string
  name: string
  kicker: string
  status: string
  lines: string[]
  proves: string
  url: string
  displayUrl: string
  accent: string
}

export const projects: Project[] = [
  {
    id: 'unioffice',
    index: '01',
    name: 'UNIOFFICE',
    kicker: 'My biggest build',
    status: 'Live · in testing',
    lines: [
      'The biggest thing I’ve built so far.',
      'It’s live and in testing right now, and I’m still working on it every day, fixing things and making it better.',
    ],
    proves: 'I don’t just make pages. I make products.',
    url: 'https://unioffice.pro',
    displayUrl: 'unioffice.pro',
    accent: '#d7ff4a',
  },
  {
    id: 'orcades',
    index: '02',
    name: 'ORCADES',
    kicker: 'Creative agency',
    status: 'Live',
    lines: ['“We build digital worlds.”', 'That’s ORCADES, a creative agency project I built for websites, software, design and digital experiences.'],
    proves: 'I like making things that look and feel different.',
    url: 'https://orcades.vercel.app',
    displayUrl: 'orcades.vercel.app',
    accent: '#ff5fd2',
  },
  {
    id: 'simulator',
    index: '03',
    name: 'Business Simulator',
    kicker: 'A system you can play',
    status: 'Live',
    lines: ['A business simulator you can play right in your browser.', 'Rules, markets and numbers that react to every decision you make.'],
    proves: 'I like building systems, not just screens.',
    url: 'https://business-simulator-eight.vercel.app/',
    displayUrl: 'business-simulator-eight.vercel.app',
    accent: '#ffb42e',
  },
  {
    id: 'vinacou',
    index: '04',
    name: 'Vinacou',
    kicker: 'Built for a business',
    status: 'Live',
    lines: ['I built the website for Vinacou, a firm that sells acoustic interiors.', 'A real business with real customers, so it had to be clear and genuinely useful.'],
    proves: 'I build for real businesses, too.',
    url: 'https://vinayakoo.vercel.app/',
    displayUrl: 'vinayakoo.vercel.app',
    accent: '#d9a86c',
  },
]

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p])) as Record<Project['id'], Project>

export const hackathon = {
  team: 'NYMERIA',
  org: 'Global AI Community',
  chapter: 'Gurgaon Chapter',
  event: 'Hackathon',
  result: 'Winner',
  // a team achievement plus my part in it, never "I did everything"
  role: 'I took care of the technical side of what we built.',
}

export const mhmun = {
  name: 'MHMUN',
  year: 2024,
  attendees: 1600,
  role: 'Creative Director',
  venue: 'Mahatma Hansraj Modern School, Jhansi',
  note: 'One of the biggest MUN events in North India in 2024.',
  // how it felt, not just the job title
  story: 'I got to help shape an event that brought 1,600+ students together, right at my own school in Jhansi.',
}

export const hackfest = {
  name: 'Hansraj Hackfest',
  attendees: 130,
  role: 'President',
  venue: 'Mahatma Hansraj Modern School, Jhansi',
  tracks: [
    { id: 'cloud', name: 'Cloud', line: 'One track where students learned cloud computing.', color: '#9ec9ff' },
    { id: 'web', name: 'Web', line: 'One where they learned to build for the web.', color: '#7dffb2' },
    { id: 'design', name: 'Design', line: 'And one where they learned design.', color: '#b69cff' },
  ],
}

// an internship: research on a real company's content, never "I ran their growth"
export const softworker = {
  company: 'Softworker AI',
  role: 'Business Research Analyst Intern',
  focus: ['SEO', 'AEO', 'GEO'], // search, answer engine and generative engine optimisation
}

export type Milestone = { place: string; title: string; detail?: string; stat?: string; role?: string }

export const timeline: Milestone[] = [
  { place: 'Jhansi', title: 'Home', detail: 'Where it all starts.' },
  { place: 'Jhansi', title: 'Mahatma Hansraj Modern School', detail: 'School, all the way to Class 12.' },
  { place: 'Jhansi', title: 'MHMUN', stat: '1,600+ students in one place', role: 'Creative Director' },
  { place: 'Jhansi', title: 'Hansraj Hackfest', stat: '130+ students learning to build', role: 'President' },
  { place: 'Gurugram', title: 'Global AI Community, Gurgaon Chapter', detail: 'A hackathon with team NYMERIA.', role: 'We won.' },
  {
    place: 'Work',
    title: softworker.company,
    stat: softworker.focus.join(' · '),
    role: softworker.role,
    detail: 'Real work at a real company. I researched how content gets found by search engines, answer engines and generative AI, and worked on the pipelines behind it.',
  },
  { place: 'Gurugram', title: 'Zenith School of AI', detail: 'Where I’m learning now.' },
  { place: 'Online', title: 'UNIOFFICE · ORCADES · Business Simulator · Vinacou', detail: 'Things I’ve built and put out into the world.' },
  { place: 'Now', title: 'Still building', detail: 'Maybe the next one is yours.' },
]

export type Service = { id: string; title: string; items: string[]; evidence: { label: string; href: string }[] }

// Not a menu of services: the kinds of things I've actually made, each linked to the real thing.
export const services: Service[] = [
  {
    id: 'products',
    title: 'Products',
    items: ['Software you can actually use, from a workspace product to a simulator you can play.'],
    evidence: [
      { label: 'UNIOFFICE', href: '#unioffice' },
      { label: 'Business Simulator', href: '#simulator' },
    ],
  },
  {
    id: 'ai',
    title: 'AI projects',
    items: ['I’m studying AI and building with it. My team and I won a Global AI Community hackathon.'],
    evidence: [{ label: 'NYMERIA', href: '#nymeria' }],
  },
  {
    id: 'immersive',
    title: 'Interactive websites',
    items: ['3D, motion and stories you scroll through. You’re standing inside one right now.'],
    evidence: [{ label: 'This website', href: '#hello' }],
  },
  {
    id: 'brand',
    title: 'Creative websites',
    items: ['Sites with a personality of their own.'],
    evidence: [{ label: 'ORCADES', href: '#orcades' }],
  },
  {
    id: 'business',
    title: 'Business websites',
    items: ['Sites that help a real business reach real customers.'],
    evidence: [{ label: 'Vinacou', href: '#vinacou' }],
  },
]

/* ---------- section copy ---------- */

export const copy = {
  hero: {
    srTagline: ': I build things, often with other people, and I’m still building.',
  },
  about: {
    title: ['I’m Madhavan', 'Sahu.'],
    lede: 'I build software, products, AI projects and websites you can wander around in.',
    ledeEnd: 'Some on my own. Some of the best ones, with other people.',
    evidence: [
      {
        claim: 'I made',
        items: [
          { label: 'UNIOFFICE', id: 'unioffice' },
          { label: 'ORCADES', id: 'orcades' },
          { label: 'Business Simulator', id: 'simulator' },
          { label: 'Vinacou', id: 'vinacou' },
        ],
      },
      {
        claim: 'With people',
        items: [
          { label: 'NYMERIA', id: 'nymeria' },
          { label: 'MHMUN', id: 'mhmun' },
          { label: 'Hansraj Hackfest', id: 'hackfest' },
        ],
      },
    ],
    nowLabel: 'Now',
    schoolLabel: 'School',
    schoolNote: '(until Class 12)',
    aside: 'Before all this, I hosted gaming contests. Nothing official, just my first try at bringing people together.',
  },
  project: {
    provesLabel: 'In one line',
    visit: 'Visit',
  },
  simDemo: {
    head: 'Try a tiny version',
    note: 'Each block in the district is one week of revenue. This is a toy I made just for this page. The real simulator is one click away.',
  },
  nymeria: {
    kicker: 'With my team',
    result: 'We won.',
    partLabel: 'My part',
    part: 'The technical side',
    line: 'We built it together. I took care of the technical side.',
  },
  mhmun: {
    kicker: 'With a lot of people',
    unit: 'students in the room · every figure here is one of them',
  },
  hackfest: {
    kicker: 'With other students',
    roleLabel: 'my role',
    line: 'A group of us put it together so more students could learn to build things too.',
  },
  journey: {
    kicker: 'The story so far',
    title: ['From Jhansi', 'to now.'],
  },
  services: {
    kicker: 'Made so far',
    title: ['What I', 'make.'],
    lede: 'All of it real, all of it linked. If one of these looks like what you need, keep scrolling.',
    proofLabel: 'See it',
  },
}

// Chapters drive the navigation index and the camera. Order = scroll order.
export const chapters = [
  { id: 'hello', label: 'Hello', group: 'Home' },
  { id: 'portal', label: 'Enter', group: 'Home', hidden: true },
  { id: 'about', label: 'About', group: 'About' },
  { id: 'unioffice', label: 'UNIOFFICE', group: 'Work' },
  { id: 'orcades', label: 'ORCADES', group: 'Work' },
  { id: 'simulator', label: 'Business Simulator', group: 'Work' },
  { id: 'vinacou', label: 'Vinacou', group: 'Work' },
  { id: 'nymeria', label: 'NYMERIA', group: 'Experience' },
  { id: 'mhmun', label: 'MHMUN', group: 'Experience' },
  { id: 'hackfest', label: 'Hansraj Hackfest', group: 'Experience' },
  { id: 'journey', label: 'Journey', group: 'Experience' },
  { id: 'services', label: 'What I make', group: 'What I make' },
  { id: 'contact', label: 'Contact', group: 'Contact' },
] as const

export type ChapterId = (typeof chapters)[number]['id']
