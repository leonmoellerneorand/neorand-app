'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Give webhook a moment to process then redirect to dashboard
    const timer = setTimeout(() => router.replace('/dashboard'), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-text-primary mb-2">¡Pago exitoso!</h1>
        <p className="text-brand-text-muted mb-2">Tu solución está siendo activada.</p>
        <p className="text-brand-text-muted text-sm">Redirigiendo a tu dashboard...</p>
      </div>
    </div>
  )
}
