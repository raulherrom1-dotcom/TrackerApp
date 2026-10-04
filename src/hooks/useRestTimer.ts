import { useEffect, useRef } from 'react'
import { useNow } from './useNow'
import type { RestTimerState } from '../types'

export function useRestTimer(restTimer: RestTimerState | null | undefined, onFinish?: () => void) {
  const now = useNow(250, !!restTimer)
  const firedRef = useRef(false)

  const durationMs = (restTimer?.durationSeconds ?? 0) * 1000
  const elapsedMs = restTimer ? now - restTimer.startedAt : 0
  const remainingMs = Math.max(0, durationMs - elapsedMs)
  const remaining = Math.ceil(remainingMs / 1000)
  const isDone = !!restTimer && remainingMs <= 0
  const elapsedRatio = restTimer ? Math.min(1, Math.max(0, elapsedMs / durationMs)) : 0

  useEffect(() => {
    if (!restTimer) {
      firedRef.current = false
      return
    }
    if (isDone && !firedRef.current) {
      firedRef.current = true
      onFinish?.()
    }
  }, [isDone, restTimer, onFinish])

  return { remaining, isDone, elapsedRatio }
}
