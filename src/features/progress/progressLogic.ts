import type { Session } from '../../types'
import { maxWeightInExercise } from '../../utils/calculations'

export interface ExerciseHistoryPoint {
  date: string
  sessionId: string
  maxWeight: number
  volume: number
}

/** `sessions` debe venir ordenado de más reciente a más antigua (getCompletedSessions). */
export function buildExerciseHistory(sessions: Session[], exerciseId: string): ExerciseHistoryPoint[] {
  const points: ExerciseHistoryPoint[] = []
  for (const session of sessions) {
    const ex = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (!ex) continue
    const completedSets = ex.sets.filter((s) => s.completed)
    if (completedSets.length === 0) continue
    points.push({
      date: session.date,
      sessionId: session.id,
      maxWeight: completedSets.reduce((m, s) => Math.max(m, s.weight), 0),
      volume: completedSets.reduce((v, s) => v + s.weight * s.reps, 0),
    })
  }
  return points.reverse() // cronológico: más antigua primero, para graficar de izquierda a derecha
}

export interface PersonalRecord {
  weight: number
  date: string
}

export function personalRecordForExercise(sessions: Session[], exerciseId: string): PersonalRecord | null {
  let best: PersonalRecord | null = null
  for (const session of sessions) {
    const ex = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (!ex) continue
    const weight = maxWeightInExercise(ex)
    if (weight > 0 && (!best || weight > best.weight)) {
      best = { weight, date: session.date }
    }
  }
  return best
}

export function loggedExerciseIds(sessions: Session[]): Set<string> {
  const ids = new Set<string>()
  for (const session of sessions) {
    for (const ex of session.exercises) {
      if (ex.sets.some((s) => s.completed)) ids.add(ex.exerciseId)
    }
  }
  return ids
}
