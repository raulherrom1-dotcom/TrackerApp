import { Minus, Plus } from 'lucide-react'

interface NumberStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  decimal?: boolean
  suffix?: string
  compact?: boolean
}

export function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  decimal = false,
  suffix,
  compact = false,
}: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const round = (n: number) => (decimal ? Math.round(n * 100) / 100 : Math.round(n))

  function handleInput(raw: string) {
    const normalized = raw.replace(',', '.')
    const parsed = decimal ? parseFloat(normalized) : parseInt(normalized, 10)
    if (Number.isNaN(parsed)) {
      onChange(min)
      return
    }
    onChange(clamp(round(parsed)))
  }

  const buttonSize = compact ? 'h-9 w-9' : 'h-11 w-11'
  const iconSize = compact ? 15 : 18
  const valueSize = compact ? 'text-base' : 'text-[22px]'

  return (
    <div>
      {!compact && <span className="text-xs font-semibold text-muted">{label}</span>}
      <div className={`flex items-center gap-2 ${compact ? '' : 'mt-1'}`}>
        <button
          type="button"
          aria-label={`Restar ${label}`}
          onClick={() => onChange(clamp(round(value - step)))}
          className={`flex shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink active:bg-line ${buttonSize}`}
        >
          <Minus size={iconSize} strokeWidth={2.5} />
        </button>
        <div className={`flex min-w-0 items-baseline justify-center gap-1 ${compact ? 'w-12' : 'flex-1'}`}>
          <input
            type="text"
            inputMode={decimal ? 'decimal' : 'numeric'}
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            className={`w-full min-w-0 bg-transparent text-center font-extrabold tabular-nums text-ink outline-none ${valueSize}`}
          />
          {suffix && <span className="shrink-0 text-sm font-semibold text-muted">{suffix}</span>}
        </div>
        <button
          type="button"
          aria-label={`Sumar ${label}`}
          onClick={() => onChange(clamp(round(value + step)))}
          className={`flex shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink active:bg-line ${buttonSize}`}
        >
          <Plus size={iconSize} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
