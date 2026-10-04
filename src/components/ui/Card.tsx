import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function Card({ children, interactive, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card bg-surface p-4 ${interactive ? 'active:bg-surface-2' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
