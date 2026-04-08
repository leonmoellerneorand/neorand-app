'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(amount)
}

export default function PayPage() {
  const router = useRouter()
  const [deal, setDeal] = useState<{ solution_name: string | null; subscription_amount: number; one_time_amount: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch('/api/deal/me')
      .then(r => r.json())
      .then(data => { setDeal(data.deal); setFetching(false) })
      .catch(() => setFetching(false))
  }, [])

  async function handlePay() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const total = (deal?.subscription_amount ?? 0) + (deal?.one_time_amount ?? 0)

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
          <span className="text-brand-blue font-black text-lg tracking-widest">NEORAND</span>
        </div>

        <h1 className="text-3xl font-extrabold text-brand-text-primary text-center mb-2">Activa tu solución</h1>
        <p className="text-brand-text-muted text-center mb-8">Completa el pago para comenzar</p>

        {/* Card */}
        <div className="card-base p-6 mb-4">
          {/* Solution */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center text-xl">⚡</div>
            <div>
              <p className="text-xs text-brand-text-muted mb-0.5">Tu solución</p>
              <p className="font-bold text-brand-text-primary">{deal?.solution_name ?? 'Solución NEORAND'}</p>
            </div>
          </div>

          <div className="border-t border-brand-card-border mb-4" />

          {/* Line items */}
          {(deal?.one_time_amount ?? 0) > 0 && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-brand-text-secondary text-sm">Configuración inicial</span>
              <span className="font-semibold text-brand-text-primary">{formatMXN(deal!.one_time_amount)}</span>
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-brand-text-secondary text-sm">Suscripción mensual</p>
              <p className="text-xs text-brand-text-muted">Se cobra cada mes</p>
            </div>
            <span className="font-semibold text-brand-text-primary">{formatMXN(deal?.subscription_amount ?? 0)}/mes</span>
          </div>

          <div className="border-t border-brand-card-border mb-4" />

          <div className="flex justify-between items-center">
            <span className="font-bold text-brand-text-primary">Total hoy</span>
            <span className="text-2xl font-extrabold text-brand-blue">{formatMXN(total)}</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mb-6 text-xs text-brand-text-muted">
          <span>🔒 Pago seguro</span>
          <span>✓ Stripe</span>
          <span>↩ Cancela cuando quieras</span>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-brand-blue/30"
        >
          {loading ? 'Redirigiendo...' : 'Pagar ahora →'}
        </button>
      </div>
    </div>
  )
}
