import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'danger'
}

export function IconButton({ children, variant = 'default', className = '', ...props }: IconButtonProps) {
  const color = variant === 'danger' ? 'text-red-400 active:bg-red-400/10' : 'text-muted active:bg-surface-2'
  return (
    <button
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${color} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
