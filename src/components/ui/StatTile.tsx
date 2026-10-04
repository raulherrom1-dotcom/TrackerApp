import type { ReactNode } from 'react'

interface StatTileProps {
  label: string
  value: string
  unit?: string
  icon?: ReactNode
}

export function StatTile({ label, value, unit, icon }: StatTileProps) {
  return (
    <div className="rounded-card bg-surface p-4">
      {icon && <div className="mb-2 text-muted">{icon}</div>}
      <p className="whitespace-nowrap text-xl font-extrabold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-xs font-bold text-muted">{unit}</span>}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-muted">{label}</p>
    </div>
  )
}
