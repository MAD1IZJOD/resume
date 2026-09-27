// Every fact on the site lives here. Keep it accurate — nothing in this file
// should be embellished beyond what Madhavan has actually done.

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
    kicker: 'Flagship product',
    status: 'Live · in testing',
    lines: [
      'My biggest project so far.',
      'It’s live, it’s in its testing phase, and I’m building it every day.',
    ],
    proves: 'I build real products — not just pages.',
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
    lines: ['“We build digital worlds.”', 'A creative agency project for websites, software, design and digital experiences.'],
    proves: 'I design and build creative technology.',
    url: 'https://orcades.vercel.app',
    displayUrl: 'orcades.vercel.app',
    accent: '#ff5fd2',
  },
  {
    id: 'simulator',
    index: '03',
    name: 'Business Simulator',
    kicker: 'Interactive system',
    status: 'Live',
    lines: ['A business simulator that runs in the browser.', 'Systems, rules and numbers that react to your decisions.'],
    proves: 'I build systems and interactive products.',
    url: 'https://business-simulator-eight.vercel.app/',
    displayUrl: 'business-simulator-eight.vercel.app',
    accent: '#ffb42e',
  },
  {
    id: 'vinacou',
    index: '04',
    name: 'Vinacou',
    kicker: 'Commercial website',
    status: 'Live',
    lines: ['A website for Vinacou, a firm selling acoustic interiors.', 'Built for a real business with real customers to reach.'],
    proves: 'I build websites for real businesses.',
    url: 'https://vinayakoo.vercel.app/',
    displayUrl: 'vinayakoo.vercel.app',
    accent: '#d9a86c',
  },
]

export const hackathon = {
  team: 'NYMERIA',
  org: 'Global AI Community',
  chapter: 'Gurgaon Chapter',
  event: 'Hackathon',
  result: 'Winner',
  role: 'I handled all of the technical work for my team.',
}

export const mhmun = {
  name: 'MHMUN',
  year: 2024,
  attendees: 1600,
  role: 'Creative Director',
  venue: 'Mahatma Hansraj Modern School, Jhansi',
  note: 'One of the biggest MUN events in North India in 2024.',
}

export const hackfest = {
  name: 'Hansraj Hackfest',
  attendees: 130,
  role: 'President',
  venue: 'Mahatma Hansraj Modern School, Jhansi',
  tracks: [
    { id: 'cloud', name: 'Cloud', line: 'Participants learned cloud computing.' },
    { id: 'web', name: 'Web', line: 'Participants learned web development.' },
    { id: 'design', name: 'Design', line: 'Participants learned design.' },
  ],
}

export type Milestone = { place: string; title: string; detail?: string; stat?: string; role?: string }

export const timeline: Milestone[] = [
  { place: 'Jhansi', title: 'Home city', detail: 'Where it starts.' },
  { place: 'Jhansi', title: 'Mahatma Hansraj Modern School', detail: 'School, until Class 12.' },
  { place: 'Jhansi', title: 'MHMUN', stat: '1600+ students', role: 'Creative Director' },
  { place: 'Jhansi', title: 'Hansraj Hackfest', stat: '130+ students', role: 'President' },
  { place: 'Gurugram', title: 'Global AI Community — Gurgaon Chapter', detail: 'Team NYMERIA', role: 'Hackathon winner' },
  { place: 'Gurugram', title: 'Zenith School of AI', detail: 'Studying now.' },
  { place: 'Online', title: 'UNIOFFICE · ORCADES · Business Simulator · Vinacou', detail: 'Shipped and live.' },
  { place: 'Now', title: 'Building what’s next', detail: 'Maybe yours.' },
]

export type Service = { id: string; title: string; items: string[]; evidence: { label: string; href: string }[] }

export const services: Service[] = [
  {
    id: 'products',
    title: 'Digital products',
    items: ['Web apps', 'SaaS products', 'Interactive tools', 'Business software'],
    evidence: [
      { label: 'UNIOFFICE', href: '#unioffice' },
      { label: 'Business Simulator', href: '#simulator' },
    ],
  },
  {
    id: 'ai',
    title: 'AI systems',
    items: ['AI agents', 'AI-powered workflows', 'Research systems', 'Automation'],
    evidence: [{ label: 'NYMERIA · hackathon win', href: '#nymeria' }],
  },
  {
    id: 'immersive',
    title: 'Immersive websites',
    items: ['GSAP & scroll storytelling', 'Three.js & WebGL', '3D experiences', 'Interactive websites'],
    evidence: [{ label: 'This website', href: '#hello' }],
  },
  {
    id: 'brand',
    title: 'Brand experiences',
    items: ['Creative websites', 'Digital identity', 'Interactive brand experiences'],
    evidence: [{ label: 'ORCADES', href: '#orcades' }],
  },
  {
    id: 'business',
    title: 'Business websites',
    items: ['High-quality websites for companies and products'],
    evidence: [{ label: 'Vinacou', href: '#vinacou' }],
  },
]

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
  { id: 'services', label: 'What I build', group: 'Services' },
  { id: 'contact', label: 'Contact', group: 'Contact' },
] as const

export type ChapterId = (typeof chapters)[number]['id']
