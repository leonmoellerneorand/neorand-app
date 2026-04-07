// src/components/ui/Card.tsx
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className, glow }: CardProps) {
  return (
    <div className={cn(
      'card-base p-5',
      glow && 'shadow-glow-sm',
      className
    )}>
      {children}
    </div>
  )
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-brand-text-muted uppercase tracking-widest mb-1.5">
      {children}
    </p>
  )
}
