'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '.' : d + '.')
    }, 500)

    // Poll until payment_status is active
    const pollInterval = setInterval(async () => {
      const res = await fetch('/api/deal/me')
      const data = await res.json()
      if (data.deal?.payment_status === 'active') {
        clearInterval(pollInterval)
        clearInterval(dotsInterval)
        router.replace('/dashboard')
      }
    }, 2000)

    return () => {
      clearInterval(pollInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-text-primary mb-2">¡Pago exitoso!</h1>
        <p className="text-brand-text-muted mb-2">Activando tu solución{dots}</p>
        <p className="text-brand-text-muted text-sm">Esto tomará unos segundos.</p>
      </div>
    </div>
  )
}
