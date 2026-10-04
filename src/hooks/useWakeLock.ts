import { useEffect } from 'react'

/** Mantiene la pantalla encendida mientras `active` es true. Falla en silencio si no hay soporte. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    async function acquire() {
      try {
        const s = await navigator.wakeLock.request('screen')
        if (cancelled) {
          s.release().catch(() => {})
        } else {
          sentinel = s
        }
      } catch {
        // silencioso: rechazado o no soportado en este contexto
      }
    }

    acquire()

    function handleVisibility() {
      if (document.visibilityState === 'visible' && !sentinel) acquire()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibility)
      sentinel?.release().catch(() => {})
    }
  }, [active])
}
