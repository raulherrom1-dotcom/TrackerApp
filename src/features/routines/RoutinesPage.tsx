import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Dumbbell, Plus, Trash2 } from 'lucide-react'
import type { Routine } from '../../types'
import { createRoutine, deleteRoutine, duplicateRoutine, getAllRoutines } from '../../db/repository'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { IconButton } from '../../components/ui/IconButton'

export function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[] | null>(null)
  const navigate = useNavigate()

  async function reload() {
    setRoutines(await getAllRoutines())
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleCreate() {
    const routine = await createRoutine('Rutina nueva')
    navigate(`/rutinas/${routine.id}`)
  }

  async function handleDuplicate(id: string) {
    await duplicateRoutine(id)
    reload()
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    await deleteRoutine(id)
    reload()
  }

  return (
    <div className="px-5 pb-6 pt-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Rutinas</h1>
      </div>

      {routines === null ? null : routines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <Dumbbell size={28} className="text-muted" />
          </div>
          <p className="mt-4 max-w-[26ch] text-muted">
            Todavía no tienes rutinas. Crea la primera para empezar a registrar tus entrenamientos.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {routines.map((routine) => (
            <Card key={routine.id} className="flex items-center gap-3" interactive>
              <button
                type="button"
                onClick={() => navigate(`/rutinas/${routine.id}`)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-lg font-bold">{routine.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {routine.exercises.length === 0
                    ? 'Sin ejercicios todavía'
                    : `${routine.exercises.length} ejercicio${routine.exercises.length === 1 ? '' : 's'}`}
                </p>
              </button>
              <IconButton aria-label="Duplicar rutina" onClick={() => handleDuplicate(routine.id)}>
                <Copy size={18} />
              </IconButton>
              <IconButton
                aria-label="Eliminar rutina"
                variant="danger"
                onClick={() => handleDelete(routine.id, routine.name)}
              >
                <Trash2 size={18} />
              </IconButton>
            </Card>
          ))}
        </div>
      )}

      <div className="sticky bottom-4 z-10 mt-6">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-base via-base to-transparent" />
        <Button onClick={handleCreate} className="w-full shadow-lg shadow-black/40">
          <Plus size={20} strokeWidth={2.5} />
          Nueva rutina
        </Button>
      </div>
    </div>
  )
}
