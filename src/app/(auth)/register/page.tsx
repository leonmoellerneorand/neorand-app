// src/app/(auth)/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

type Step = 1 | 2

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [dealId, setDealId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    setStep(2)
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/link-deal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId: dealId.trim() }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Error al vincular')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#04070f' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-blue shadow-glow-sm" />
            <span className="text-brand-gradient font-black text-xl tracking-widest uppercase">NEORAND</span>
          </div>
          <p className="text-brand-text-muted text-sm">Portal de Clientes</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-brand-blue' : 'bg-brand-card-border'}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-brand-blue' : 'bg-brand-card-border'}`} />
        </div>

        <div className="card-base p-8">
          {step === 1 ? (
            <>
              <h1 className="text-brand-text-primary font-bold text-lg mb-6">Crear cuenta</h1>
              <form onSubmit={handleStep1} className="flex flex-col gap-4">
                <Input label="Correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@empresa.com" required autoComplete="email" />
                <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required autoComplete="new-password" />
                <Input label="Confirmar contraseña" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required autoComplete="new-password" />
                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                <Button type="submit" loading={loading} className="w-full mt-2" size="lg">Continuar</Button>
              </form>
              <p className="text-center text-sm text-brand-text-muted mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-brand-sky hover:underline">Inicia sesión</Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-brand-text-primary font-bold text-lg mb-2">Vincula tu solución</h1>
              <p className="text-sm text-brand-text-muted mb-6">
                Ingresa el código UUID que NEORAND te proporcionó para vincular tu cuenta a tu solución.
              </p>
              <form onSubmit={handleStep2} className="flex flex-col gap-4">
                <Input
                  label="Código de solución"
                  type="text"
                  value={dealId}
                  onChange={e => setDealId(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  required
                  className="font-mono text-xs"
                />
                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                <Button type="submit" loading={loading} className="w-full mt-2" size="lg">Activar portal</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
