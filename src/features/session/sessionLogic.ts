import type { Exercise, Routine, Session, SessionExercise, SetEntry } from '../../types'
import { getAllExercises, getLastCompletedSessionForExercise } from '../../db/repository'
import { todayDateString } from '../../utils/date'

const DEFAULT_AD_HOC_SETS = 3

export async function buildSessionFromRoutine(routine: Routine): Promise<Session> {
  const allExercises = await getAllExercises()
  const nameFor = (id: string) => allExercises.find((e) => e.id === id)?.name ?? 'Ejercicio'

  const exercises: SessionExercise[] = []
  for (const re of routine.exercises) {
    const lastSession = await getLastCompletedSessionForExercise(re.exerciseId)
    const lastExercise = lastSession?.exercises.find((e) => e.exerciseId === re.exerciseId)

    const sets: SetEntry[] = Array.from({ length: re.targetSets }, (_, i) => {
      const prev = lastExercise?.sets[i]
      return {
        weight: prev?.weight ?? re.suggestedWeight ?? 0,
        reps: prev?.reps ?? re.targetReps,
        completed: false,
      }
    })

    exercises.push({
      exerciseId: re.exerciseId,
      name: nameFor(re.exerciseId),
      order: re.order,
      restSeconds: re.restSeconds,
      sets,
    })
  }

  return {
    id: crypto.randomUUID(),
    routineId: routine.id,
    routineName: routine.name,
    date: todayDateString(),
    startedAt: Date.now(),
    exercises,
    status: 'in-progress',
    restTimer: null,
  }
}

export async function buildAdHocSessionExercise(
  exercise: Exercise,
  order: number,
  defaultRestSeconds: number,
): Promise<SessionExercise> {
  const lastSession = await getLastCompletedSessionForExercise(exercise.id)
  const lastExercise = lastSession?.exercises.find((e) => e.exerciseId === exercise.id)

  const sets: SetEntry[] =
    lastExercise && lastExercise.sets.length > 0
      ? lastExercise.sets.map((s) => ({ weight: s.weight, reps: s.reps, completed: false }))
      : Array.from({ length: DEFAULT_AD_HOC_SETS }, () => ({ weight: 0, reps: 10, completed: false }))

  return {
    exerciseId: exercise.id,
    name: exercise.name,
    order,
    restSeconds: lastExercise?.restSeconds ?? defaultRestSeconds,
    sets,
  }
}
