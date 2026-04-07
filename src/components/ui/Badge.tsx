// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils'
import type { Deal } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
      className
    )}>
      {children}
    </span>
  )
}

const STATUS_CONFIG: Record<Deal['status'], { label: string; className: string }> = {
  'funcionando': {
    label: 'Funcionando',
    className: 'bg-green-500/10 text-green-400 border border-green-500/20',
  },
  'en desarrollo': {
    label: 'En Desarrollo',
    className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  },
  'en pruebas': {
    label: 'En Pruebas',
    className: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  },
  'en mantenimiento': {
    label: 'En Mantenimiento',
    className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  },
}

export function StatusBadge({ status }: { status: Deal['status'] }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['en desarrollo']
  return <Badge className={config.className}><span aria-hidden>●</span> {config.label}</Badge>
}

const SUB_CONFIG: Record<Deal['subscription_status'], { label: string; className: string }> = {
  'activa': {
    label: 'Activa',
    className: 'bg-green-500/10 text-green-400 border border-green-500/20',
  },
  'pago fallido': {
    label: 'Pago Fallido',
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  'cancelada': {
    label: 'Cancelada',
    className: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
  },
}

export function SubscriptionBadge({ status }: { status: Deal['subscription_status'] }) {
  const config = SUB_CONFIG[status] ?? SUB_CONFIG['activa']
  return <Badge className={config.className}>{config.label}</Badge>
}

export function ActivityTypeBadge({ type }: { type: 'info' | 'success' | 'error' }) {
  const config = {
    success: { label: 'Éxito', className: 'bg-green-500/10 text-green-400 border border-green-500/20' },
    error: { label: 'Error', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
    info: { label: 'Info', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  }[type]
  return <Badge className={config.className}>{config.label}</Badge>
}

export function UrgencyBadge({ urgency }: { urgency: 'baja' | 'media' | 'alta' }) {
  const config = {
    baja: { label: 'Baja', className: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20' },
    media: { label: 'Media', className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
    alta: { label: 'Alta', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  }[urgency]
  return <Badge className={config.className}>{config.label}</Badge>
}
