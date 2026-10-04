import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, ListChecks, LineChart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const items: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/entrenar', label: 'Entrenar', icon: Dumbbell },
  { to: '/rutinas', label: 'Rutinas', icon: ListChecks },
  { to: '/progreso', label: 'Progreso', icon: LineChart },
]

export function BottomNav() {
  return (
    <nav className="shrink-0 border-t border-line bg-surface pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex min-h-[52px] flex-col items-center justify-center gap-1 pt-2 transition-colors ${
                  isActive ? 'text-accent' : 'text-muted'
                }`
              }
            >
              <Icon size={24} strokeWidth={2.25} />
              <span className="text-[11px] font-semibold leading-none">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
