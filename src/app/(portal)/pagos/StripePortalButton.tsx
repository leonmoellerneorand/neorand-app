// src/app/(portal)/pagos/StripePortalButton.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ExternalLink } from 'lucide-react'

export function StripePortalButton({ hasCustomer }: { hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!hasCustomer) return
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url, error } = await res.json()
    if (error || !url) {
      setLoading(false)
      return
    }
    window.location.href = url
  }

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      loading={loading}
      disabled={!hasCustomer}
    >
      <ExternalLink size={14} />
      Cambiar método de pago
    </Button>
  )
}
