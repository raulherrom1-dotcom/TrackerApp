import { useEffect, useState } from 'react'

/** Reloj que se re-sincroniza al volver de segundo plano, para sobrevivir al backgrounding de iOS. */
export function useNow(intervalMs = 1000, enabled = true) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    function handleVisibility() {
      if (document.visibilityState === 'visible') setNow(Date.now())
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [intervalMs, enabled])

  return now
}
