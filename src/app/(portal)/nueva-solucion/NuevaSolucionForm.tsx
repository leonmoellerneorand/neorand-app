// src/app/(portal)/nueva-solucion/NuevaSolucionForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Textarea, Select } from '@/components/ui/Input'
import { submitSolutionRequest } from '@/actions/submitSolutionRequest'
import { CheckCircle } from 'lucide-react'

const SOLUTION_TYPES = [
  'Automatización de Ventas',
  'Automatización de Marketing',
  'Integración de Sistemas',
  'Procesamiento de Datos',
  'Automatización de RRHH',
  'Solución Personalizada',
]

export function NuevaSolucionForm({ dealId }: { dealId: string }) {
  const router = useRouter()
  const [solutionType, setSolutionType] = useState(SOLUTION_TYPES[0])
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<'baja' | 'media' | 'alta'>('media')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (description.trim().length < 50) {
      setError('La descripción debe tener al menos 50 caracteres')
      return
    }
    setLoading(true)
    try {
      await submitSolutionRequest({ dealId, solutionType, description, urgency })
      setSubmitted(true)
      router.refresh()
    } catch {
      setError('Error al enviar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <CheckCircle size={40} className="text-green-400" />
        <h3 className="text-brand-text-primary font-semibold">¡Solicitud enviada!</h3>
        <p className="text-sm text-brand-text-muted text-center">
          Recibimos tu solicitud. El equipo NEORAND se pondrá en contacto contigo pronto.
        </p>
        <Button variant="ghost" onClick={() => setSubmitted(false)} className="mt-2">
          Enviar otra solicitud
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Select
        label="Tipo de solución"
        value={solutionType}
        onChange={e => setSolutionType(e.target.value)}
      >
        {SOLUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </Select>

      <Textarea
        label="Describe el problema"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Explica qué proceso quieres automatizar, qué problema tienes y cuál sería el resultado ideal... (mínimo 50 caracteres)"
        rows={5}
      />

      <Select
        label="Urgencia"
        value={urgency}
        onChange={e => setUrgency(e.target.value as 'baja' | 'media' | 'alta')}
      >
        <option value="baja">Baja — sin prisa</option>
        <option value="media">Media — en los próximos días</option>
        <option value="alta">Alta — lo antes posible</option>
      </Select>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" loading={loading} className="self-start" size="lg">
        Enviar solicitud
      </Button>
    </form>
  )
}
