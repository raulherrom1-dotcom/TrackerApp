import { Plus, Minus, X } from 'lucide-react'
import type { RestTimerState } from '../../types'
import { useRestTimer } from '../../hooks/useRestTimer'
import { formatRestClock } from '../../utils/calculations'

interface RestTimerBarProps {
  restTimer: RestTimerState
  onAdjust: (deltaSeconds: number) => void
  onSkip: () => void
  onFinish?: () => void
}

export function RestTimerBar({ restTimer, onAdjust, onSkip, onFinish }: RestTimerBarProps) {
  const { remaining, isDone, elapsedRatio } = useRestTimer(restTimer, onFinish)

  return (
    <div
      className={`sticky top-2 z-20 overflow-hidden rounded-card p-4 shadow-lg shadow-black/40 transition-colors ${
        isDone ? 'bg-accent' : 'bg-surface-2'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-bold ${isDone ? 'text-accent-ink/70' : 'text-muted'}`}>
            {isDone ? '¡Descanso terminado!' : 'Descanso'}
          </p>
          <p className={`text-3xl font-extrabold tabular-nums ${isDone ? 'text-accent-ink' : 'text-ink'}`}>
            {formatRestClock(remaining)}
          </p>
        </div>

        {!isDone && (
          <button
            type="button"
            aria-label="Restar 15 segundos"
            onClick={() => onAdjust(-15)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-ink active:bg-line"
          >
            <Minus size={18} />
          </button>
        )}
        {!isDone && (
          <button
            type="button"
            aria-label="Sumar 15 segundos"
            onClick={() => onAdjust(15)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-ink active:bg-line"
          >
            <Plus size={18} />
          </button>
        )}

        <button
          type="button"
          aria-label="Saltar descanso"
          onClick={onSkip}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:opacity-70 ${
            isDone ? 'bg-accent-ink/15 text-accent-ink' : 'bg-surface text-ink'
          }`}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {!isDone && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${elapsedRatio * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}
