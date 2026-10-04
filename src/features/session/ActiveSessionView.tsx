import { useEffect, useRef, useState } from 'react'
import { Flag, Plus } from 'lucide-react'
import type { Exercise, Session, SessionExercise, SetEntry } from '../../types'
import { getAllExercises, getSettings, saveSession } from '../../db/repository'
import { buildAdHocSessionExercise } from './sessionLogic'
import { computeNewPersonalRecords, computeSessionTotals, type NewPersonalRecord, type SessionTotals } from '../../utils/calculations'
import { useNow } from '../../hooks/useNow'
import { useWakeLock } from '../../hooks/useWakeLock'
import { unlockAudio, playRestFinishedSound } from '../../utils/sound'
import { Button } from '../../components/ui/Button'
import { SessionExerciseBlock } from './SessionExerciseBlock'
import { RestTimerBar } from './RestTimerBar'
import { ExercisePicker } from '../routines/ExercisePicker'

interface ActiveSessionViewProps {
  session: Session
  onFinish: (session: Session, totals: SessionTotals, records: NewPersonalRecord[]) => void
}

export function ActiveSessionView({ session: initialSession, onFinish }: ActiveSessionViewProps) {
  const [session, setSession] = useState(initialSession)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [defaultRest, setDefaultRest] = useState(90)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const isFirstRender = useRef(true)

  const now = useNow(1000)
  const elapsedSeconds = Math.max(0, Math.floor((now - session.startedAt) / 1000))

  useWakeLock(true)

  useEffect(() => {
    getAllExercises().then(setExercises)
    getSettings().then((s) => {
      setDefaultRest(s.defaultRestSeconds)
      setSoundEnabled(s.soundEnabled)
    })
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveSession(session)
  }, [session])

  function updateExercise(index: number, updater: (ex: SessionExercise) => SessionExercise) {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => (i === index ? updater(ex) : ex)),
    }))
  }

  function handleChangeSet(exerciseIndex: number, setIndex: number, patch: Partial<SetEntry>) {
    updateExercise(exerciseIndex, (ex) => ({
      ...ex,
      sets: ex.sets.map((s, i) => (i === setIndex ? { ...s, ...patch } : s)),
    }))
  }

  function handleToggleSet(exerciseIndex: number, setIndex: number) {
    unlockAudio()
    setSession((prev) => {
      const ex = prev.exercises[exerciseIndex]
      const set = ex.sets[setIndex]
      const nowCompleted = !set.completed
      const newSets = ex.sets.map((s, i) =>
        i === setIndex ? { ...s, completed: nowCompleted, completedAt: nowCompleted ? Date.now() : undefined } : s,
      )
      const newExercises = prev.exercises.map((e, i) => (i === exerciseIndex ? { ...e, sets: newSets } : e))
      const restTimer = nowCompleted
        ? { startedAt: Date.now(), durationSeconds: ex.restSeconds }
        : prev.restTimer
      return { ...prev, exercises: newExercises, restTimer }
    })
  }

  function handleAddSet(exerciseIndex: number) {
    updateExercise(exerciseIndex, (ex) => {
      const last = ex.sets[ex.sets.length - 1]
      return { ...ex, sets: [...ex.sets, { weight: last?.weight ?? 0, reps: last?.reps ?? 10, completed: false }] }
    })
  }

  function handleRemoveLastSet(exerciseIndex: number) {
    updateExercise(exerciseIndex, (ex) => ({ ...ex, sets: ex.sets.slice(0, -1) }))
  }

  async function handleAddExercise(exercise: Exercise) {
    const newExercise = await buildAdHocSessionExercise(exercise, session.exercises.length, defaultRest)
    setSession((prev) => ({ ...prev, exercises: [...prev.exercises, newExercise] }))
    setPickerOpen(false)
  }

  function handleExerciseCreated(exercise: Exercise) {
    setExercises((prev) => [...prev, exercise])
  }

  function handleAdjustRest(delta: number) {
    setSession((prev) =>
      prev.restTimer
        ? { ...prev, restTimer: { ...prev.restTimer, durationSeconds: Math.max(0, prev.restTimer.durationSeconds + delta) } }
        : prev,
    )
  }

  function handleSkipRest() {
    setSession((prev) => ({ ...prev, restTimer: null }))
  }

  async function handleFinish() {
    const completedSets = computeSessionTotals(session).completedSets
    if (completedSets === 0) {
      const ok = window.confirm('No completaste ningún set. ¿Terminar de todas formas?')
      if (!ok) return
    }
    setFinishing(true)
    const finalSession: Session = { ...session, status: 'completed', endedAt: Date.now(), restTimer: null }
    const records = await computeNewPersonalRecords(finalSession)
    await saveSession(finalSession)
    const totals = computeSessionTotals(finalSession)
    onFinish(finalSession, totals, records)
  }

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')
  const seconds = String(elapsedSeconds % 60).padStart(2, '0')

  return (
    <div className="px-5 pb-6 pt-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">{session.routineName}</h1>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-muted">
            {minutes}:{seconds}
          </p>
        </div>
        <Button variant="secondary" className="shrink-0 px-4" onClick={handleFinish} disabled={finishing}>
          <Flag size={16} />
          Finalizar
        </Button>
      </div>

      {session.restTimer && (
        <div className="mb-4">
          <RestTimerBar
            restTimer={session.restTimer}
            onAdjust={handleAdjustRest}
            onSkip={handleSkipRest}
            onFinish={soundEnabled ? playRestFinishedSound : undefined}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => (
          <SessionExerciseBlock
            key={`${exercise.exerciseId}-${index}`}
            exercise={exercise}
            onChangeSet={(setIndex, patch) => handleChangeSet(index, setIndex, patch)}
            onToggleSet={(setIndex) => handleToggleSet(index, setIndex)}
            onAddSet={() => handleAddSet(index)}
            onRemoveLastSet={() => handleRemoveLastSet(index)}
          />
        ))}
      </div>

      <Button variant="ghost" className="mt-4 w-full" onClick={() => setPickerOpen(true)}>
        <Plus size={20} />
        Agregar ejercicio
      </Button>

      <div className="mt-4">
        <label className="text-xs font-semibold text-muted" htmlFor="session-notes">
          Notas
        </label>
        <textarea
          id="session-notes"
          value={session.notes ?? ''}
          onChange={(e) => setSession((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="¿Cómo te sentiste hoy?"
          rows={2}
          className="mt-1 w-full resize-none rounded-card bg-surface p-3 text-base text-ink outline-none placeholder:text-muted"
        />
      </div>

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
