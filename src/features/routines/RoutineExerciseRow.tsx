import { ChevronDown, ChevronUp, GripVertical, Trash2 } from 'lucide-react'
import type { RoutineExercise } from '../../types'
import { NumberStepper } from '../../components/ui/NumberStepper'
import { IconButton } from '../../components/ui/IconButton'

interface RoutineExerciseRowProps {
  item: RoutineExercise
  exerciseName: string
  isFirst: boolean
  isLast: boolean
  onChange: (patch: Partial<RoutineExercise>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function RoutineExerciseRow({
  item,
  exerciseName,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: RoutineExerciseRowProps) {
  return (
    <div className="rounded-card bg-surface p-4">
      <div className="flex items-start gap-2">
        <GripVertical size={18} className="mt-1 shrink-0 text-line" />
        <p className="min-w-0 flex-1 truncate text-lg font-bold">{exerciseName}</p>
        <div className="flex shrink-0 flex-col">
          <button
            type="button"
            aria-label="Mover arriba"
            disabled={isFirst}
            onClick={onMoveUp}
            className="flex h-6 w-9 items-center justify-center text-muted disabled:opacity-20"
          >
            <ChevronUp size={18} />
          </button>
          <button
            type="button"
            aria-label="Mover abajo"
            disabled={isLast}
            onClick={onMoveDown}
            className="flex h-6 w-9 items-center justify-center text-muted disabled:opacity-20"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        <IconButton aria-label="Quitar ejercicio" variant="danger" onClick={onRemove}>
          <Trash2 size={18} />
        </IconButton>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <NumberStepper
          label="Sets"
          value={item.targetSets}
          onChange={(v) => onChange({ targetSets: v })}
          min={1}
          max={20}
        />
        <NumberStepper
          label="Reps"
          value={item.targetReps}
          onChange={(v) => onChange({ targetReps: v })}
          min={1}
          max={100}
        />
        <NumberStepper
          label="Peso sugerido"
          value={item.suggestedWeight ?? 0}
          onChange={(v) => onChange({ suggestedWeight: v > 0 ? v : undefined })}
          min={0}
          max={500}
          step={2.5}
          decimal
          suffix="kg"
        />
        <NumberStepper
          label="Descanso"
          value={item.restSeconds}
          onChange={(v) => onChange({ restSeconds: v })}
          min={0}
          max={600}
          step={15}
          suffix="s"
        />
      </div>
    </div>
  )
}
