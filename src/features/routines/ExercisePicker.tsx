import { useMemo, useState } from 'react'
import { Search, X, Plus } from 'lucide-react'
import type { Exercise, MuscleGroup } from '../../types'
import { MUSCLE_GROUPS } from '../../utils/muscleGroups'
import { addCustomExercise } from '../../db/repository'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'

interface ExercisePickerProps {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  onClose: () => void
  onExerciseCreated: (exercise: Exercise) => void
}

export function ExercisePicker({ exercises, onSelect, onClose, onExerciseCreated }: ExercisePickerProps) {
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newGroup, setNewGroup] = useState<MuscleGroup>('Otro')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? exercises.filter((e) => e.name.toLowerCase().includes(q)) : exercises
    const map = new Map<MuscleGroup, Exercise[]>()
    for (const group of MUSCLE_GROUPS) map.set(group, [])
    for (const exercise of filtered) {
      map.get(exercise.muscleGroup)?.push(exercise)
    }
    return map
  }, [exercises, query])

  async function handleCreateCustom() {
    if (!newName.trim()) return
    const exercise = await addCustomExercise(newName, newGroup)
    onExerciseCreated(exercise)
    onSelect(exercise)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-base">
      <div className="flex shrink-0 items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <h2 className="text-xl font-extrabold">Agregar ejercicio</h2>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </IconButton>
      </div>

      <div className="shrink-0 px-4 pb-3 pt-3">
        <div className="flex items-center gap-2 rounded-full bg-surface px-4">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ejercicio"
            className="min-h-[48px] w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="scroll-area flex-1 px-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {!creating ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mb-4 flex min-h-[52px] w-full items-center gap-3 rounded-card border border-dashed border-line px-4 text-left font-semibold text-ink active:bg-surface"
          >
            <Plus size={20} className="text-accent" />
            Crear ejercicio propio
          </button>
        ) : (
          <div className="mb-4 rounded-card bg-surface p-4">
            <label className="text-xs font-semibold text-muted" htmlFor="new-ex-name">
              Nombre del ejercicio
            </label>
            <input
              id="new-ex-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Press en máquina"
              className="mt-1 min-h-[48px] w-full rounded-xl bg-surface-2 px-4 text-base text-ink outline-none placeholder:text-muted"
            />
            <label className="mt-3 block text-xs font-semibold text-muted">Grupo muscular</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setNewGroup(group)}
                  className={`min-h-[36px] rounded-full px-3 text-sm font-semibold transition-colors ${
                    newGroup === group ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-muted'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setCreating(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleCreateCustom} disabled={!newName.trim()}>
                Agregar
              </Button>
            </div>
          </div>
        )}

        {MUSCLE_GROUPS.map((group) => {
          const items = grouped.get(group)
          if (!items || items.length === 0) return null
          return (
            <div key={group} className="mb-5">
              <h3 className="mb-2 text-sm font-bold text-muted">{group}</h3>
              <div className="overflow-hidden rounded-card bg-surface">
                {items.map((exercise, i) => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => onSelect(exercise)}
                    className={`flex min-h-[52px] w-full items-center px-4 text-left text-base font-medium text-ink active:bg-surface-2 ${
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
    </div>
  )
}
