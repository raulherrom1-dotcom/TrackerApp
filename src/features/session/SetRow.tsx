import { Check } from 'lucide-react'
import type { SetEntry } from '../../types'
import { NumberStepper } from '../../components/ui/NumberStepper'

interface SetRowProps {
  index: number
  set: SetEntry
  onChange: (patch: Partial<SetEntry>) => void
  onToggleComplete: () => void
}

export function SetRow({ index, set, onChange, onToggleComplete }: SetRowProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors ${
        set.completed ? 'bg-accent/10' : 'bg-surface-2/60'
      }`}
    >
      <span className="w-4 shrink-0 text-center text-sm font-bold text-muted">{index + 1}</span>

      <NumberStepper
        compact
        label={`peso del set ${index + 1}`}
        value={set.weight}
        onChange={(v) => onChange({ weight: v })}
        step={2.5}
        decimal
      />
      <span className="-ml-1 shrink-0 text-xs font-semibold text-muted">kg</span>

      <NumberStepper
        compact
        label={`reps del set ${index + 1}`}
        value={set.reps}
        onChange={(v) => onChange({ reps: v })}
        step={1}
        min={0}
        max={999}
      />
      <span className="-ml-1 shrink-0 text-xs font-semibold text-muted">reps</span>

      <button
        type="button"
        onClick={onToggleComplete}
        aria-label={set.completed ? 'Marcar set como no completado' : 'Marcar set como completado'}
        aria-pressed={set.completed}
        className={`ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
          set.completed
            ? 'animate-set-complete bg-accent text-accent-ink'
            : 'border border-line bg-transparent text-muted active:bg-surface-2'
        }`}
      >
        <Check size={20} strokeWidth={3} />
      </button>
    </div>
  )
}
