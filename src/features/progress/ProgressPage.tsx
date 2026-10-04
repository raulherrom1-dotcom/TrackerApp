import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History } from 'lucide-react'
import type { Exercise, Session } from '../../types'
import { getAllExercises, getCompletedSessions } from '../../db/repository'
import { MUSCLE_GROUPS } from '../../utils/muscleGroups'
import { formatDuration, computeSessionTotals } from '../../utils/calculations'
import { formatSessionDate } from '../../utils/date'
import { loggedExerciseIds } from './progressLogic'

type Tab = 'historial' | 'ejercicios'

export function ProgressPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('historial')
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    getCompletedSessions().then(setSessions)
    getAllExercises().then(setExercises)
  }, [])

  const loggedIds = sessions ? loggedExerciseIds(sessions) : new Set<string>()
  const trainedExercises = exercises.filter((e) => loggedIds.has(e.id))

  return (
    <div className="px-5 pb-6 pt-4">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight">Progreso</h1>

      <div className="mb-5 flex rounded-full bg-surface p-1">
        {(['historial', 'ejercicios'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-[40px] flex-1 rounded-full text-sm font-bold transition-colors ${
              tab === t ? 'bg-accent text-accent-ink' : 'text-muted'
            }`}
          >
            {t === 'historial' ? 'Historial' : 'Ejercicios'}
          </button>
        ))}
      </div>

      {sessions === null ? null : tab === 'historial' ? (
        sessions.length === 0 ? (
          <EmptyState text="Todavía no completaste ningún entrenamiento. Cuando termines uno, aparecerá aquí." />
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => {
              const totals = computeSessionTotals(session)
              return (
                <div key={session.id} className="overflow-hidden rounded-card bg-surface">
                  <button
                    type="button"
                    onClick={() => navigate(`/progreso/sesion/${session.id}`)}
                    className="flex w-full items-center gap-3 p-4 text-left active:bg-surface-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold">{session.routineName}</p>
                      <p className="mt-0.5 text-sm text-muted">{formatSessionDate(session.date)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold tabular-nums">{formatDuration(totals.durationSeconds)}</p>
                      <p className="text-sm text-muted tabular-nums">{totals.totalVolume.toLocaleString('es')} kg</p>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        )
      ) : trainedExercises.length === 0 ? (
        <EmptyState text="Cuando completes sets de un ejercicio, su progreso aparecerá aquí." />
      ) : (
        <div className="flex flex-col gap-5">
          {MUSCLE_GROUPS.map((group) => {
            const items = trainedExercises.filter((e) => e.muscleGroup === group)
            if (items.length === 0) return null
            return (
              <div key={group}>
                <h3 className="mb-2 text-sm font-bold text-muted">{group}</h3>
                <div className="overflow-hidden rounded-card bg-surface">
                  {items.map((exercise, i) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => navigate(`/progreso/ejercicio/${exercise.id}`)}
                      className={`flex min-h-[52px] w-full items-center px-4 text-left font-medium active:bg-surface-2 ${
                        i !== items.length - 1 ? 'border-b border-line' : ''
                      }`}
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <History size={28} className="text-muted" />
      </div>
      <p className="mt-4 max-w-[28ch] text-muted">{text}</p>
    </div>
  )
}
