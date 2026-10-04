import { Minus, Plus } from 'lucide-react'
import type { SessionExercise, SetEntry } from '../../types'
import { SetRow } from './SetRow'

interface SessionExerciseBlockProps {
  exercise: SessionExercise
  onChangeSet: (setIndex: number, patch: Partial<SetEntry>) => void
  onToggleSet: (setIndex: number) => void
  onAddSet: () => void
  onRemoveLastSet: () => void
}

export function SessionExerciseBlock({
  exercise,
  onChangeSet,
  onToggleSet,
  onAddSet,
  onRemoveLastSet,
}: SessionExerciseBlockProps) {
  const completedCount = exercise.sets.filter((s) => s.completed).length

  return (
    <div className="rounded-card bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-bold">{exercise.name}</h3>
        <span className="shrink-0 text-xs font-semibold text-muted">
          {completedCount}/{exercise.sets.length} sets
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {exercise.sets.map((set, i) => (
          <SetRow
            key={i}
            index={i}
            set={set}
            onChange={(patch) => onChangeSet(i, patch)}
            onToggleComplete={() => onToggleSet(i)}
          />
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onRemoveLastSet}
          disabled={exercise.sets.length === 0}
          className="flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-full border border-line text-sm font-semibold text-muted disabled:opacity-30"
        >
          <Minus size={15} />
          Set
        </button>
        <button
          type="button"
          onClick={onAddSet}
          className="flex min-h-[40px] flex-1 items-center justify-center gap-1 rounded-full border border-line text-sm font-semibold text-ink"
        >
          <Plus size={15} />
          Set
        </button>
      </div>
    </div>
  )
}
