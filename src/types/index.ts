export type MuscleGroup =
  | 'Pecho'
  | 'Espalda'
  | 'Pierna'
  | 'Hombro'
  | 'Brazo'
  | 'Core'
  | 'Cardio'
  | 'Otro'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  isCustom: boolean
}

export interface RoutineExercise {
  exerciseId: string
  order: number
  targetSets: number
  targetReps: number
  suggestedWeight?: number
  restSeconds: number
}

export interface Routine {
  id: string
  name: string
  order: number
  exercises: RoutineExercise[]
  createdAt: number
  updatedAt: number
}

export interface SetEntry {
  weight: number
  reps: number
  completed: boolean
  completedAt?: number
}

export interface SessionExercise {
  exerciseId: string
  name: string
  order: number
  restSeconds: number
  sets: SetEntry[]
}

export type SessionStatus = 'in-progress' | 'completed'

export interface RestTimerState {
  startedAt: number
  durationSeconds: number
}

export interface Session {
  id: string
  routineId?: string
  routineName: string
  date: string
  startedAt: number
  endedAt?: number
  exercises: SessionExercise[]
  notes?: string
  status: SessionStatus
  restTimer?: RestTimerState | null
}

export interface Settings {
  id: 'singleton'
  weeklyGoal: number
  defaultRestSeconds: number
  soundEnabled: boolean
}
