// src/app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#04070f' }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-blue shadow-glow-sm" />
            <span className="text-brand-gradient font-black text-xl tracking-widest uppercase">
              NEORAND
            </span>
          </div>
          <p className="text-brand-text-muted text-sm">Portal de Clientes</p>
        </div>

        {/* Card */}
        <div className="card-base p-8">
          <h1 className="text-brand-text-primary font-bold text-lg mb-6">Iniciar sesión</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              required
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-brand-text-muted mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-brand-sky hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
