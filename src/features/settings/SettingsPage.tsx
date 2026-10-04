import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Upload } from 'lucide-react'
import { getSettings, updateSettings } from '../../db/repository'
import type { Settings } from '../../types'
import { exportBackup, importBackup } from '../../utils/backup'
import { NumberStepper } from '../../components/ui/NumberStepper'
import { Switch } from '../../components/ui/Switch'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'

export function SettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  async function patch(p: Partial<Omit<Settings, 'id'>>) {
    const updated = await updateSettings(p)
    setSettings(updated)
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const ok = window.confirm(
      'Importar reemplazará todos tus datos actuales (rutinas, historial y ejercicios). ¿Continuar?',
    )
    if (!ok) return
    setImporting(true)
    try {
      await importBackup(file)
      window.alert('Datos importados correctamente.')
      window.location.reload()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo importar el archivo.')
    } finally {
      setImporting(false)
    }
  }

  if (!settings) return null

  return (
    <div className="px-5 pb-6 pt-4">
      <div className="mb-5 flex items-center gap-2">
        <IconButton aria-label="Volver a inicio" onClick={() => navigate('/')}>
          <ArrowLeft size={22} />
        </IconButton>
        <h1 className="text-2xl font-extrabold tracking-tight">Ajustes</h1>
      </div>

      <p className="mb-2 text-sm font-semibold text-muted">Entrenamiento</p>
      <div className="flex flex-col gap-4 rounded-card bg-surface p-4">
        <NumberStepper
          label="Meta semanal (entrenamientos)"
          value={settings.weeklyGoal}
          min={1}
          max={7}
          onChange={(v) => patch({ weeklyGoal: v })}
        />
        <div className="h-px bg-line" />
        <NumberStepper
          label="Descanso por defecto"
          value={settings.defaultRestSeconds}
          min={0}
          max={600}
          step={15}
          suffix="s"
          onChange={(v) => patch({ defaultRestSeconds: v })}
        />
        <div className="h-px bg-line" />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold">Sonido al terminar descanso</p>
            <p className="text-sm text-muted">Un beep corto cuando se acaba el tiempo</p>
          </div>
          <Switch
            label="Sonido al terminar descanso"
            checked={settings.soundEnabled}
            onChange={(v) => patch({ soundEnabled: v })}
          />
        </div>
      </div>

      <p className="mb-2 mt-6 text-sm font-semibold text-muted">Respaldo</p>
      <div className="flex flex-col gap-3 rounded-card bg-surface p-4">
        <p className="text-sm text-muted">Guarda una copia de tus datos o restaura un respaldo anterior.</p>
        <Button variant="secondary" className="w-full" onClick={() => exportBackup()}>
          <Download size={18} />
          Exportar datos
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={importing}>
          <Upload size={18} />
          {importing ? 'Importando…' : 'Importar datos'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>
    </div>
  )
}
