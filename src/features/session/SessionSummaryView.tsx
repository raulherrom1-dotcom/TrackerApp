import { PartyPopper, Trophy } from 'lucide-react'
import type { Session } from '../../types'
import type { NewPersonalRecord, SessionTotals } from '../../utils/calculations'
import { formatDuration } from '../../utils/calculations'
import { Button } from '../../components/ui/Button'
import { StatTile } from '../../components/ui/StatTile'

interface SessionSummaryViewProps {
  session: Session
  totals: SessionTotals
  records: NewPersonalRecord[]
  onDone: () => void
}

export function SessionSummaryView({ session, totals, records, onDone }: SessionSummaryViewProps) {
  return (
    <div className="flex min-h-full flex-col px-5 pb-6 pt-8">
      <div className="flex flex-col items-center text-center">
        <div className="animate-pop-in flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
          <PartyPopper size={28} className="text-accent" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Entrenamiento completado</h1>
        <p className="mt-1 text-muted">{session.routineName}</p>
      </div>

      <div className="animate-fade-up mt-6 grid grid-cols-3 gap-3 [animation-delay:120ms]">
        <StatTile label="Duración" value={formatDuration(totals.durationSeconds)} />
        <StatTile label="Volumen" value={totals.totalVolume.toLocaleString('es')} unit="kg" />
        <StatTile label="Sets" value={String(totals.completedSets)} />
      </div>

      {records.length > 0 && (
        <div className="animate-fade-up mt-6 [animation-delay:220ms]">
          <h2 className="mb-2 text-sm font-bold text-muted">Récords nuevos</h2>
          <div className="flex flex-col gap-2">
            {records.map((r) => (
              <div key={r.exerciseId} className="flex items-center gap-3 rounded-card bg-surface p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <Trophy size={18} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{r.exerciseName}</p>
                  <p className="text-sm text-muted">
                    {r.previousWeight > 0 ? `antes ${r.previousWeight} kg → ` : ''}
                    <span className="font-semibold text-ink">{r.weight} kg</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-8">
        <Button className="w-full" onClick={onDone}>
          Listo
        </Button>
      </div>
    </div>
  )
}
