import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Dumbbell, Flame, Clock, Layers } from 'lucide-react'
import type { Routine, Session } from '../../types'
import { getAllRoutines, getCompletedSessions, getSettings } from '../../db/repository'
import { addDays, startOfWeek, toDateString } from '../../utils/date'
import { computeSessionTotals, formatDuration } from '../../utils/calculations'
import { CircularProgress } from '../../components/ui/CircularProgress'
import { StatTile } from '../../components/ui/StatTile'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { DayRow } from './DayRow'
import { pickNextRoutine } from './nextRoutine'

interface HomeData {
  weeklyGoal: number
  weekSessions: Session[]
  routines: Routine[]
  nextRoutine: Routine | null
}

export function HomePage() {
  const navigate = useNavigate()
  const [data, setData] = useState<HomeData | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [settings, routines, completedSessions] = await Promise.all([
        getSettings(),
        getAllRoutines(),
        getCompletedSessions(),
      ])
      const weekStart = startOfWeek(new Date())
      const weekDates = new Set(Array.from({ length: 7 }, (_, i) => toDateString(addDays(weekStart, i))))
      const weekSessions = completedSessions.filter((s) => weekDates.has(s.date))

      if (cancelled) return
      setData({
        weeklyGoal: settings.weeklyGoal,
        weekSessions,
        routines,
        nextRoutine: pickNextRoutine(routines, completedSessions),
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) return null

  const weekStart = startOfWeek(new Date())
  const trainedDates = new Set(data.weekSessions.map((s) => s.date))
  const workoutsDone = trainedDates.size

  const totals = data.weekSessions.reduce(
    (acc, s) => {
      const t = computeSessionTotals(s)
      return { volume: acc.volume + t.totalVolume, duration: acc.duration + t.durationSeconds, sets: acc.sets + t.completedSets }
    },
    { volume: 0, duration: 0, sets: 0 },
  )

  function handleStart(routine: Routine) {
    navigate('/entrenar', { state: { routineId: routine.id } })
  }

  return (
    <div className="px-5 pb-6 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Hola, Raúl</h1>
        <IconButton aria-label="Ajustes" onClick={() => navigate('/ajustes')}>
          <Settings size={22} />
        </IconButton>
      </div>

      <div className="mt-6 flex items-center gap-5 rounded-card bg-surface p-5">
        <CircularProgress progress={data.weeklyGoal > 0 ? workoutsDone / data.weeklyGoal : 0} size={92} strokeWidth={9}>
          <span className="text-xl font-extrabold tabular-nums">{workoutsDone}</span>
          <span className="text-[11px] font-semibold text-muted">de {data.weeklyGoal}</span>
        </CircularProgress>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-muted">Meta semanal</p>
          <p className="mt-0.5 text-lg font-bold leading-snug">
            {workoutsDone >= data.weeklyGoal
              ? '¡Meta cumplida esta semana!'
              : `${data.weeklyGoal - workoutsDone} entrenamiento${data.weeklyGoal - workoutsDone === 1 ? '' : 's'} para tu meta`}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-card bg-surface p-5">
        <DayRow weekStart={weekStart} trainedDates={trainedDates} />
      </div>

      <div className="mt-4 rounded-card-lg bg-surface p-5">
        {data.nextRoutine ? (
          <>
            <p className="text-sm font-semibold text-muted">Siguiente rutina</p>
            <p className="mt-0.5 text-2xl font-extrabold tracking-tight">{data.nextRoutine.name}</p>
            <p className="mt-1 text-sm text-muted">
              {data.nextRoutine.exercises.length} ejercicio{data.nextRoutine.exercises.length === 1 ? '' : 's'}
            </p>
            <Button className="mt-4 w-full" onClick={() => handleStart(data.nextRoutine!)}>
              <Dumbbell size={20} />
              Empezar entrenamiento
            </Button>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
              <Dumbbell size={22} className="text-muted" />
            </div>
            <p className="mt-3 text-lg font-bold">Crea tu primera rutina</p>
            <p className="mt-1 text-sm text-muted">Arma tus ejercicios para poder empezar a entrenar.</p>
            <Button className="mt-4 w-full" onClick={() => navigate('/rutinas')}>
              Ir a Rutinas
            </Button>
          </>
        )}
      </div>

      <p className="mb-2 mt-6 text-sm font-semibold text-muted">Esta semana</p>
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Volumen" value={totals.volume.toLocaleString('es')} unit="kg" icon={<Flame size={18} />} />
        <StatTile label="Duración" value={formatDuration(totals.duration)} icon={<Clock size={18} />} />
        <StatTile label="Sets" value={String(totals.sets)} icon={<Layers size={18} />} />
      </div>
    </div>
  )
}
