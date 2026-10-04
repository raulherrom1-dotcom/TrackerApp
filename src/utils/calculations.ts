import type { Session, SessionExercise } from '../types'
import { getSessionsForExercise } from '../db/repository'

export function sessionVolume(session: Session): number {
  return session.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.completed ? set.weight * set.reps : 0), 0),
    0,
  )
}

export function sessionCompletedSets(session: Session): number {
  return session.exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0)
}

export function sessionDurationSeconds(session: Session): number {
  const end = session.endedAt ?? Date.now()
  return Math.max(0, Math.round((end - session.startedAt) / 1000))
}

export function maxWeightInExercise(sessionExercise: SessionExercise): number {
  return sessionExercise.sets.reduce((max, s) => (s.completed && s.weight > max ? s.weight : max), 0)
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h} h ${m} min`
  return `${m} min`
}

export function formatRestClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export interface SessionTotals {
  durationSeconds: number
  totalVolume: number
  completedSets: number
}

export function computeSessionTotals(session: Session): SessionTotals {
  return {
    durationSeconds: sessionDurationSeconds(session),
    totalVolume: sessionVolume(session),
    completedSets: sessionCompletedSets(session),
  }
}

export interface NewPersonalRecord {
  exerciseId: string
  exerciseName: string
  weight: number
  previousWeight: number
}

/**
 * Compara contra sesiones ya completadas en la base (la sesión actual todavía
 * no se guarda como "completed" en este punto, así que no se auto-compara).
 */
export async function computeNewPersonalRecords(session: Session): Promise<NewPersonalRecord[]> {
  const records: NewPersonalRecord[] = []
  for (const ex of session.exercises) {
    const sessionMax = maxWeightInExercise(ex)
    if (sessionMax <= 0) continue

    const priorSessions = await getSessionsForExercise(ex.exerciseId)
    const priorMax = priorSessions.reduce((max, s) => {
      const match = s.exercises.find((e) => e.exerciseId === ex.exerciseId)
      return match ? Math.max(max, maxWeightInExercise(match)) : max
    }, 0)

    if (sessionMax > priorMax) {
      records.push({
        exerciseId: ex.exerciseId,
        exerciseName: ex.name,
        weight: sessionMax,
        previousWeight: priorMax,
      })
    }
  }
  return records
}
