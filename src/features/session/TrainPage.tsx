import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Session } from '../../types'
import { getActiveSession, getRoutine, saveSession } from '../../db/repository'
import type { NewPersonalRecord, SessionTotals } from '../../utils/calculations'
import { buildSessionFromRoutine } from './sessionLogic'
import { RoutinePickerView } from './RoutinePickerView'
import { ActiveSessionView } from './ActiveSessionView'
import { SessionSummaryView } from './SessionSummaryView'

type ViewState =
  | { kind: 'loading' }
  | { kind: 'picker' }
  | { kind: 'active'; session: Session }
  | { kind: 'summary'; session: Session; totals: SessionTotals; records: NewPersonalRecord[] }

export function TrainPage() {
  const [state, setState] = useState<ViewState>({ kind: 'loading' })
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const active = await getActiveSession()
      if (active) {
        if (!cancelled) setState({ kind: 'active', session: active })
        return
      }

      const routineId = (location.state as { routineId?: string } | null)?.routineId
      if (routineId) {
        const routine = await getRoutine(routineId)
        if (routine) {
          const session = await buildSessionFromRoutine(routine)
          await saveSession(session)
          if (!cancelled) setState({ kind: 'active', session })
          return
        }
      }

      if (!cancelled) setState({ kind: 'picker' })
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.kind === 'loading') return null

  if (state.kind === 'picker') {
    return <RoutinePickerView onStart={(session) => setState({ kind: 'active', session })} />
  }

  if (state.kind === 'active') {
    return (
      <ActiveSessionView
        session={state.session}
        onFinish={(session, totals, records) => setState({ kind: 'summary', session, totals, records })}
      />
    )
  }

  return (
    <SessionSummaryView
      session={state.session}
      totals={state.totals}
      records={state.records}
      onDone={() => setState({ kind: 'picker' })}
    />
  )
}
