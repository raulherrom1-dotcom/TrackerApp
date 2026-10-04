import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { Exercise, Session } from '../../types'
import { getAllExercises, getCompletedSessions } from '../../db/repository'
import { buildExerciseHistory, personalRecordForExercise } from './progressLogic'
import { formatChartDate, formatFullDate } from '../../utils/date'
import { IconButton } from '../../components/ui/IconButton'

const ACCENT = '#2F8FFF'

const tooltipProps = {
  contentStyle: { background: '#222222', border: '1px solid #2A2A2A', borderRadius: 12, fontSize: 13 },
  labelStyle: { color: '#9A9A9A', marginBottom: 4 },
  itemStyle: { color: '#FFFFFF' },
}

export function ExerciseProgressPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [sessions, setSessions] = useState<Session[] | null>(null)

  useEffect(() => {
    if (!id) return
    getAllExercises().then((all) => setExercise(all.find((e) => e.id === id) ?? null))
    getCompletedSessions().then(setSessions)
  }, [id])

  if (!exercise || sessions === null) return null

  const history = buildExerciseHistory(sessions, exercise.id)
  const pr = personalRecordForExercise(sessions, exercise.id)
  const chartData = history.map((p) => ({ ...p, label: formatChartDate(p.date) }))

  return (
    <div className="px-5 pb-6 pt-4">
      <div className="mb-4 flex items-center gap-2">
        <IconButton aria-label="Volver a progreso" onClick={() => navigate('/progreso')}>
          <ArrowLeft size={22} />
        </IconButton>
        <h1 className="truncate text-xl font-extrabold tracking-tight">{exercise.name}</h1>
      </div>

      {pr && (
        <div className="mb-5 flex items-center gap-3 rounded-card bg-surface p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15">
            <Trophy size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted">Récord personal</p>
            <p className="text-xl font-extrabold tabular-nums">
              {pr.weight} <span className="text-sm font-semibold text-muted">kg · {formatFullDate(pr.date)}</span>
            </p>
          </div>
        </div>
      )}

      {chartData.length < 2 ? (
        <div className="rounded-card bg-surface p-6 text-center">
          <p className="text-muted">Entrena este ejercicio un par de veces más para ver tu progreso en una gráfica.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-card bg-surface p-4">
            <p className="mb-3 text-sm font-bold text-muted">Peso máximo</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#2A2A2A" />
                  <XAxis dataKey="label" tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip {...tooltipProps} formatter={(v) => [`${v} kg`, 'Peso máximo']} />
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    stroke={ACCENT}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-card bg-surface p-4">
            <p className="mb-3 text-sm font-bold text-muted">Volumen</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#2A2A2A" />
                  <XAxis dataKey="label" tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9A9A9A', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip {...tooltipProps} formatter={(v) => [`${v} kg`, 'Volumen']} />
                  <Bar dataKey="volume" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
