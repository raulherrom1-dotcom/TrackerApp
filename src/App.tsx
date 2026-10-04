import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './app/Layout'
import { HomePage } from './features/home/HomePage'
import { TrainPage } from './features/session/TrainPage'
import { RoutinesPage } from './features/routines/RoutinesPage'
import { RoutineEditorPage } from './features/routines/RoutineEditorPage'
import { ProgressPage } from './features/progress/ProgressPage'
import { SessionDetailPage } from './features/progress/SessionDetailPage'
import { SettingsPage } from './features/settings/SettingsPage'

// Recharts es pesado y solo se usa en esta pantalla: se separa en su propio chunk.
const ExerciseProgressPage = lazy(() =>
  import('./features/progress/ExerciseProgressPage').then((m) => ({ default: m.ExerciseProgressPage })),
)

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/entrenar" element={<TrainPage />} />
          <Route path="/rutinas" element={<RoutinesPage />} />
          <Route path="/rutinas/:id" element={<RoutineEditorPage />} />
          <Route path="/progreso" element={<ProgressPage />} />
          <Route path="/progreso/sesion/:id" element={<SessionDetailPage />} />
          <Route
            path="/progreso/ejercicio/:id"
            element={
              <Suspense fallback={null}>
                <ExerciseProgressPage />
              </Suspense>
            }
          />
          <Route path="/ajustes" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
