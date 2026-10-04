let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    if (!audioCtx) audioCtx = new Ctor()
    return audioCtx
  } catch {
    return null
  }
}

/**
 * Safari en iOS solo deja sonar audio si el AudioContext se creó/reanudó
 * dentro de un gesto real del usuario. Se llama al tocar "completar set"
 * (justo antes de que arranque el descanso) para que el beep posterior,
 * disparado por un timeout, sí pueda sonar.
 */
export function unlockAudio() {
  const ctx = getAudioContext()
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {})
}

export function playRestFinishedSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    const now = ctx.currentTime

    const beep = (freq: number, start: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + start)
      gain.gain.setValueAtTime(0, now + start)
      gain.gain.linearRampToValueAtTime(0.25, now + start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + 0.28)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + 0.3)
    }

    beep(880, 0)
    beep(1046.5, 0.16)
  } catch {
    // silencioso: Web Audio bloqueado o no disponible
  }
}
