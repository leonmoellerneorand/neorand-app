// src/components/ui/Input.tsx
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-brand-text-muted uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl text-sm text-brand-text-primary placeholder:text-brand-text-muted',
            'bg-brand-card-bg border border-brand-card-border',
            'focus:outline-none focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/30',
            'transition-colors',
            error && 'border-red-500/50 focus:border-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-brand-text-muted uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl text-sm text-brand-text-primary placeholder:text-brand-text-muted',
            'bg-brand-card-bg border border-brand-card-border',
            'focus:outline-none focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/30',
            'transition-colors resize-none',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export function Select({ label, error, className, id, children, ...props }: InputProps & { children?: React.ReactNode }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-brand-text-muted uppercase tracking-widest">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl text-sm text-brand-text-primary',
          'bg-[#04070f] border border-brand-card-border',
          'focus:outline-none focus:border-brand-blue/60',
          'transition-colors',
          className
        )}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
