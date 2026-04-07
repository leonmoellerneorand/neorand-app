// src/components/portal/SolutionTimeline.tsx
import { cn, getStageIndex } from '@/lib/utils'
import { Check } from 'lucide-react'

const STAGES = [
  { index: 1, label: 'Solicitada' },
  { index: 2, label: 'En Desarrollo' },
  { index: 3, label: 'En Pruebas' },
  { index: 4, label: 'En Producción' },
]

export function SolutionTimeline({ status }: { status: string }) {
  const currentStage = getStageIndex(status)

  return (
    <div className="relative flex items-center justify-between py-4">
      {/* Connecting line */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-brand-card-border mx-6" />
      <div
        className="absolute left-6 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-brand-blue to-brand-sky transition-all duration-500"
        style={{ width: `${Math.min(((currentStage - 1) / 3) * 100, 100) * 0.88}%` }}
      />

      {STAGES.map(stage => {
        const isDone = stage.index < currentStage
        const isCurrent = stage.index === currentStage

        return (
          <div key={stage.index} className="relative flex flex-col items-center gap-2 z-10">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
              isDone && 'bg-brand-blue border-brand-blue',
              isCurrent && 'bg-brand-blue/20 border-brand-blue shadow-glow-blue animate-pulse-slow',
              !isDone && !isCurrent && 'bg-[#04070f] border-brand-card-border'
            )}>
              {isDone ? (
                <Check size={14} className="text-white" />
              ) : (
                <span className={cn(
                  'text-xs font-bold',
                  isCurrent ? 'text-brand-sky' : 'text-brand-text-muted'
                )}>
                  {stage.index}
                </span>
              )}
            </div>
            <span className={cn(
              'text-xs font-medium text-center max-w-[80px] leading-tight',
              isCurrent ? 'text-brand-sky' : isDone ? 'text-brand-text-secondary' : 'text-brand-text-muted'
            )}>
              {stage.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
