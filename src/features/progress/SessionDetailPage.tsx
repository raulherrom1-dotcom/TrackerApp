import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import type { Session } from '../../types'
import { getSessionById } from '../../db/repository'
import { computeSessionTotals, formatDuration } from '../../utils/calculations'
import { formatFullDate } from '../../utils/date'
import { StatTile } from '../../components/ui/StatTile'
import { IconButton } from '../../components/ui/IconButton'

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    getSessionById(id).then((s) => setSession(s ?? null))
  }, [id])

  if (session === undefined) return null
  if (session === null) {
    return (
      <div className="px-5 pt-4">
        <p className="text-muted">No se encontró esta sesión.</p>
      </div>
    )
  }

  const totals = computeSessionTotals(session)

  return (
    <div className="px-5 pb-6 pt-4">
      <div className="mb-4 flex items-center gap-2">
        <IconButton aria-label="Volver a progreso" onClick={() => navigate('/progreso')}>
          <ArrowLeft size={22} />
        </IconButton>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold tracking-tight">{session.routineName}</h1>
          <p className="text-sm text-muted">{formatFullDate(session.date)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Duración" value={formatDuration(totals.durationSeconds)} />
        <StatTile label="Volumen" value={totals.totalVolume.toLocaleString('es')} unit="kg" />
        <StatTile label="Sets" value={String(totals.completedSets)} />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {session.exercises.map((exercise, i) => (
          <div key={`${exercise.exerciseId}-${i}`} className="rounded-card bg-surface p-4">
            <h3 className="text-lg font-bold">{exercise.name}</h3>
            <div className="mt-2 flex flex-col gap-1.5">
              {exercise.sets.map((set, si) => (
                <div
                  key={si}
                  className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm ${
                    set.completed ? 'bg-accent/10' : 'opacity-50'
                  }`}
                >
                  <span className="w-4 text-center font-bold text-muted">{si + 1}</span>
                  <span className="font-semibold tabular-nums">
                    {set.weight} kg × {set.reps}
                  </span>
                  {set.completed ? (
                    <Check size={15} className="ml-auto text-accent" strokeWidth={3} />
                  ) : (
                    <X size={15} className="ml-auto text-muted" strokeWidth={3} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {session.notes && (
        <div className="mt-4 rounded-card bg-surface p-4">
          <p className="text-xs font-semibold text-muted">Notas</p>
          <p className="mt-1 text-ink">{session.notes}</p>
        </div>
      )}
    </div>
  )
}
