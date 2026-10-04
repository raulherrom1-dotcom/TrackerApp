import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import type { Exercise, Routine, RoutineExercise } from '../../types'
import { getAllExercises, getRoutine, getSettings, updateRoutine } from '../../db/repository'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { ExercisePicker } from './ExercisePicker'
import { RoutineExerciseRow } from './RoutineExerciseRow'

export function RoutineEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [defaultRest, setDefaultRest] = useState(90)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    getRoutine(id).then((r) => r && setRoutine(r))
    getAllExercises().then(setExercises)
    getSettings().then((s) => setDefaultRest(s.defaultRestSeconds))
  }, [id])

  const exerciseName = (exerciseId: string) =>
    exercises.find((e) => e.id === exerciseId)?.name ?? 'Ejercicio'

  async function persist(next: Routine) {
    setRoutine(next)
    await updateRoutine(next)
  }

  function handleNameChange(name: string) {
    if (!routine) return
    persist({ ...routine, name })
  }

  function handleAddExercise(exercise: Exercise) {
    if (!routine) return
    const newItem: RoutineExercise = {
      exerciseId: exercise.id,
      order: routine.exercises.length,
      targetSets: 3,
      targetReps: 10,
      suggestedWeight: undefined,
      restSeconds: defaultRest,
    }
    persist({ ...routine, exercises: [...routine.exercises, newItem] })
    setPickerOpen(false)
  }

  function handleExerciseCreated(exercise: Exercise) {
    setExercises((prev) => [...prev, exercise])
  }

  function updateExerciseAt(index: number, patch: Partial<RoutineExercise>) {
    if (!routine) return
    const next = routine.exercises.map((item, i) => (i === index ? { ...item, ...patch } : item))
    persist({ ...routine, exercises: next })
  }

  function removeExerciseAt(index: number) {
    if (!routine) return
    const next = routine.exercises.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i }))
    persist({ ...routine, exercises: next })
  }

  function moveExercise(index: number, direction: -1 | 1) {
    if (!routine) return
    const target = index + direction
    if (target < 0 || target >= routine.exercises.length) return
    const next = [...routine.exercises]
    ;[next[index], next[target]] = [next[target], next[index]]
    persist({ ...routine, exercises: next.map((item, i) => ({ ...item, order: i })) })
  }

  if (!routine) return null

  return (
    <div className="px-5 pb-10 pt-4">
      <div className="mb-4 flex items-center gap-2">
        <IconButton aria-label="Volver a rutinas" onClick={() => navigate('/rutinas')}>
          <ArrowLeft size={22} />
        </IconButton>
        <input
          ref={nameInputRef}
          type="text"
          value={routine.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-2xl font-extrabold tracking-tight text-ink outline-none"
          placeholder="Nombre de la rutina"
        />
      </div>

      <div className="flex flex-col gap-3">
        {routine.exercises.map((item, index) => (
          <RoutineExerciseRow
            key={`${item.exerciseId}-${index}`}
            item={item}
            exerciseName={exerciseName(item.exerciseId)}
            isFirst={index === 0}
            isLast={index === routine.exercises.length - 1}
            onChange={(patch) => updateExerciseAt(index, patch)}
            onRemove={() => removeExerciseAt(index)}
            onMoveUp={() => moveExercise(index, -1)}
            onMoveDown={() => moveExercise(index, 1)}
          />
        ))}
      </div>

      {routine.exercises.length === 0 && (
        <p className="mt-6 text-center text-muted">Agrega el primer ejercicio de esta rutina.</p>
      )}

      <Button variant="ghost" className="mt-4 w-full" onClick={() => setPickerOpen(true)}>
        <Plus size={20} />
        Agregar ejercicio
      </Button>

      {pickerOpen && (
        <ExercisePicker
          exercises={exercises}
          onSelect={handleAddExercise}
          onExerciseCreated={handleExerciseCreated}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
