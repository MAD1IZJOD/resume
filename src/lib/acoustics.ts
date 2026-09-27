// A clap in a room, synthesised with WebAudio: no audio files. The "room" is a
// generated impulse response: a long tail for a bare room, a short one for a
// room with acoustic treatment. Only ever started by an explicit click.

let ctx: AudioContext | null = null

function audio() {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function impulse(c: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(c.sampleRate * seconds)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

export function clap(room: 'bare' | 'treated') {
  const c = audio()
  const now = c.currentTime

  // the clap itself: a short, band-passed noise burst
  const len = Math.floor(c.sampleRate * 0.09)
  const noise = c.createBuffer(1, len, c.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.18))
  const src = c.createBufferSource()
  src.buffer = noise
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1400
  band.Q.value = 0.8

  const verb = c.createConvolver()
  verb.buffer = room === 'bare' ? impulse(c, 2.6, 2.2) : impulse(c, 0.35, 5)
  const dry = c.createGain()
  const wet = c.createGain()
  dry.gain.value = 0.55
  wet.gain.value = room === 'bare' ? 0.9 : 0.35
  const out = c.createGain()
  out.gain.setValueAtTime(0.5, now)

  src.connect(band)
  band.connect(dry).connect(out)
  band.connect(verb).connect(wet).connect(out)
  out.connect(c.destination)
  src.start(now)
  src.stop(now + 0.1)
  window.setTimeout(() => out.disconnect(), 3200)
}
