import Dexie, { type EntityTable } from 'dexie'
import type { Exercise, Routine, Session, Settings } from '../types'
import { seedExercises } from './seedExercises'

export const db = new Dexie('entreno-db') as Dexie & {
  exercises: EntityTable<Exercise, 'id'>
  routines: EntityTable<Routine, 'id'>
  sessions: EntityTable<Session, 'id'>
  settings: EntityTable<Settings, 'id'>
}

db.version(1).stores({
  exercises: 'id, muscleGroup',
  routines: 'id, order',
  sessions: 'id, status, date',
  settings: 'id',
})

db.on('populate', (tx) => {
  tx.table('exercises').bulkAdd(seedExercises)
  tx.table('settings').add({
    id: 'singleton',
    weeklyGoal: 4,
    defaultRestSeconds: 90,
    soundEnabled: true,
  } satisfies Settings)
})

export async function requestPersistentStorage() {
  if (navigator.storage?.persist) {
    try {
      await navigator.storage.persist()
    } catch {
      // silencioso: no es crítico si el navegador lo rechaza
    }
  }
}
