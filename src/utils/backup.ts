import { db } from '../db/schema'
import type { Exercise, Routine, Session, Settings } from '../types'

interface BackupFile {
  version: 1
  exportedAt: string
  exercises: Exercise[]
  routines: Routine[]
  sessions: Session[]
  settings: Settings[]
}

export async function exportBackup() {
  const [exercises, routines, sessions, settings] = await Promise.all([
    db.exercises.toArray(),
    db.routines.toArray(),
    db.sessions.toArray(),
    db.settings.toArray(),
  ])

  const payload: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    exercises,
    routines,
    sessions,
    settings,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const fecha = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `entreno-respaldo-${fecha}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function isBackupFile(data: unknown): data is BackupFile {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return (
    Array.isArray(d.exercises) &&
    Array.isArray(d.routines) &&
    Array.isArray(d.sessions) &&
    Array.isArray(d.settings)
  )
}

export async function importBackup(file: File) {
  const text = await file.text()
  const data: unknown = JSON.parse(text)

  if (!isBackupFile(data)) {
    throw new Error('El archivo no tiene el formato esperado de un respaldo de Entreno.')
  }

  await db.transaction('rw', db.exercises, db.routines, db.sessions, db.settings, async () => {
    await Promise.all([
      db.exercises.clear(),
      db.routines.clear(),
      db.sessions.clear(),
      db.settings.clear(),
    ])
    await Promise.all([
      db.exercises.bulkAdd(data.exercises),
      db.routines.bulkAdd(data.routines),
      db.sessions.bulkAdd(data.sessions),
      db.settings.bulkAdd(data.settings),
    ])
  })
}
