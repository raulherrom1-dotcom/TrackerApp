import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import type { Routine, Session } from '../../types'
import { getAllRoutines, saveSession } from '../../db/repository'
import { buildSessionFromRoutine } from './sessionLogic'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

interface RoutinePickerViewProps {
  onStart: (session: Session) => void
}

export function RoutinePickerView({ onStart }: RoutinePickerViewProps) {
  const [routines, setRoutines] = useState<Routine[] | null>(null)
  const [startingId, setStartingId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllRoutines().then(setRoutines)
  }, [])

  async function handleStart(routine: Routine) {
    if (startingId) return
    setStartingId(routine.id)
    const session = await buildSessionFromRoutine(routine)
    await saveSession(session)
    onStart(session)
  }

  return (
    <div className="px-5 pb-6 pt-4">
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight">Entrenar</h1>

      {routines === null ? null : routines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <Dumbbell size={28} className="text-muted" />
          </div>
          <p className="mt-4 max-w-[26ch] text-muted">
            Todavía no tienes rutinas. Crea una para poder empezar a entrenar.
          </p>
          <Button className="mt-5" onClick={() => navigate('/rutinas')}>
            Crear rutina
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted">Elige una rutina para empezar</p>
          {routines.map((routine) => (
            <Card key={routine.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-bold">{routine.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {routine.exercises.length} ejercicio{routine.exercises.length === 1 ? '' : 's'}
                </p>
              </div>
              <Button
                className="shrink-0 px-5"
                disabled={startingId !== null || routine.exercises.length === 0}
                onClick={() => handleStart(routine)}
              >
                Empezar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
