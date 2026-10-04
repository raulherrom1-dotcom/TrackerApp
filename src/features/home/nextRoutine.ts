import type { Routine, Session } from '../../types'

/** Sugiere la rutina entrenada menos recientemente (o nunca entrenada). */
export function pickNextRoutine(routines: Routine[], sessions: Session[]): Routine | null {
  if (routines.length === 0) return null

  const lastTrainedAt = new Map<string, number>()
  for (const session of sessions) {
    if (!session.routineId) continue
    const prev = lastTrainedAt.get(session.routineId) ?? -Infinity
    if (session.startedAt > prev) lastTrainedAt.set(session.routineId, session.startedAt)
  }

  return [...routines].sort(
    (a, b) => (lastTrainedAt.get(a.id) ?? -Infinity) - (lastTrainedAt.get(b.id) ?? -Infinity),
  )[0]
}
