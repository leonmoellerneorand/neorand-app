// src/components/ui/StatCard.tsx
import { cn } from '@/lib/utils'
import { Card, CardLabel } from './Card'

interface StatCardProps {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function StatCard({ label, value, sub, className, icon }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start justify-between">
        <CardLabel>{label}</CardLabel>
        {icon && <span className="text-brand-text-muted">{icon}</span>}
      </div>
      <div className="text-brand-text-primary font-semibold text-base leading-snug font-data">
        {value}
      </div>
      {sub && <div className="text-xs text-brand-text-muted mt-0.5">{sub}</div>}
    </Card>
  )
}
