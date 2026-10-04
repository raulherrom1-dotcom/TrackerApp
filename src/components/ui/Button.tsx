import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink active:bg-accent/85',
  secondary: 'bg-surface-2 text-ink active:bg-surface-2/70',
  ghost: 'bg-transparent text-ink border border-line active:bg-surface',
  danger: 'bg-transparent text-red-400 border border-red-400/30 active:bg-red-400/10',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition-colors disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
