import { db } from './schema'
import type { Exercise, MuscleGroup, Routine, Session, Settings } from '../types'

function newId() {
  return crypto.randomUUID()
}

// ---------- Ejercicios ----------

export function getAllExercises() {
  return db.exercises.orderBy('muscleGroup').toArray()
}

export async function addCustomExercise(name: string, muscleGroup: MuscleGroup) {
  const exercise: Exercise = {
    id: newId(),
    name: name.trim(),
    muscleGroup,
    isCustom: true,
  }
  await db.exercises.add(exercise)
  return exercise
}

// ---------- Rutinas ----------

export function getAllRoutines() {
  return db.routines.orderBy('order').toArray()
}

export function getRoutine(id: string) {
  return db.routines.get(id)
}

export async function createRoutine(name: string) {
  const count = await db.routines.count()
  const now = Date.now()
  const routine: Routine = {
    id: newId(),
    name: name.trim(),
    order: count,
    exercises: [],
    createdAt: now,
    updatedAt: now,
  }
  await db.routines.add(routine)
  return routine
}

export async function updateRoutine(routine: Routine) {
  routine.updatedAt = Date.now()
  await db.routines.put(routine)
}

export async function duplicateRoutine(id: string) {
  const original = await db.routines.get(id)
  if (!original) throw new Error('Rutina no encontrada')
  const count = await db.routines.count()
  const now = Date.now()
  const copy: Routine = {
    ...original,
    id: newId(),
    name: `${original.name} (copia)`,
    order: count,
    createdAt: now,
    updatedAt: now,
  }
  await db.routines.add(copy)
  return copy
}

export async function deleteRoutine(id: string) {
  await db.routines.delete(id)
}

// ---------- Sesiones ----------

export function getActiveSession() {
  return db.sessions.where('status').equals('in-progress').first()
}

export function getSessionById(id: string) {
  return db.sessions.get(id)
}

export async function saveSession(session: Session) {
  await db.sessions.put(session)
}

export async function deleteSession(id: string) {
  await db.sessions.delete(id)
}

export async function getCompletedSessions() {
  // Dexie sortBy() siempre ordena ascendente por la keyPath dada, sin importar
  // reverse(); para obtener "más reciente primero" hay que invertir el array ya ordenado.
  const sessions = await db.sessions.where('status').equals('completed').sortBy('startedAt')
  return sessions.reverse()
}

export async function getLastCompletedSessionForExercise(exerciseId: string) {
  const sessions = await getCompletedSessions()
  return sessions.find((session) => session.exercises.some((e) => e.exerciseId === exerciseId))
}

export async function getSessionsForExercise(exerciseId: string) {
  const sessions = await getCompletedSessions()
  return sessions.filter((session) => session.exercises.some((e) => e.exerciseId === exerciseId))
}

// ---------- Ajustes ----------

export async function getSettings(): Promise<Settings> {
  const settings = await db.settings.get('singleton')
  if (settings) return settings
  const fallback: Settings = {
    id: 'singleton',
    weeklyGoal: 4,
    defaultRestSeconds: 90,
    soundEnabled: true,
  }
  await db.settings.put(fallback)
  return fallback
}

export async function updateSettings(patch: Partial<Omit<Settings, 'id'>>) {
  const current = await getSettings()
  const updated: Settings = { ...current, ...patch }
  await db.settings.put(updated)
  return updated
}
