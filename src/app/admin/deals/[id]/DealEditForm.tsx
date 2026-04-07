// src/app/admin/deals/[id]/DealEditForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { saveDeal } from '@/actions/saveDeal'
import { CheckCircle } from 'lucide-react'
import type { Deal } from '@/types'

export function DealEditForm({ deal }: { deal: Deal }) {
  const router = useRouter()
  const [solutionName, setSolutionName] = useState(deal.solution_name ?? '')
  const [description, setDescription] = useState(deal.solution_description ?? '')
  const [status, setStatus] = useState<Deal['status']>(deal.status)
  const [subStatus, setSubStatus] = useState<Deal['subscription_status']>(deal.subscription_status)
  const [paymentStatus, setPaymentStatus] = useState<Deal['payment_status']>(deal.payment_status)
  const [subscriptionAmount, setSubscriptionAmount] = useState(String(deal.subscription_amount ?? 0))
  const [oneTimeAmount, setOneTimeAmount] = useState(String(deal.one_time_amount ?? 0))
  const [nextPayment, setNextPayment] = useState(deal.next_payment_date ?? '')
  const [last4, setLast4] = useState(deal.payment_method_last4 ?? '')
  const [stripeCustomer, setStripeCustomer] = useState(deal.stripe_customer_id ?? '')
  const [stripeSub, setStripeSub] = useState(deal.stripe_subscription_id ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setError('')
    setLoading(true)
    try {
      await saveDeal(deal.id, {
        solution_name: solutionName || null,
        solution_description: description || null,
        status,
        subscription_status: subStatus,
        payment_status: paymentStatus,
        subscription_amount: parseFloat(subscriptionAmount) || 0,
        one_time_amount: parseFloat(oneTimeAmount) || 0,
        next_payment_date: nextPayment || null,
        payment_method_last4: last4 || null,
        stripe_customer_id: stripeCustomer || null,
        stripe_subscription_id: stripeSub || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nombre de solución" value={solutionName} onChange={e => setSolutionName(e.target.value)} />
        <Select label="Estado" value={status} onChange={e => setStatus(e.target.value as Deal['status'])}>
          <option value="en desarrollo">En Desarrollo</option>
          <option value="en pruebas">En Pruebas</option>
          <option value="funcionando">Funcionando</option>
          <option value="en mantenimiento">En Mantenimiento</option>
        </Select>
        <Select label="Estado pago" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value as Deal['payment_status'])}>
          <option value="pending_payment">Pendiente de pago</option>
          <option value="active">Activo</option>
        </Select>
        <Select label="Estado suscripción" value={subStatus} onChange={e => setSubStatus(e.target.value as Deal['subscription_status'])}>
          <option value="activa">Activa</option>
          <option value="pago fallido">Pago Fallido</option>
          <option value="cancelada">Cancelada</option>
        </Select>
        <Input label="Pago único (MXN)" type="number" value={oneTimeAmount} onChange={e => setOneTimeAmount(e.target.value)} placeholder="5000" />
        <Input label="Mensualidad (MXN)" type="number" value={subscriptionAmount} onChange={e => setSubscriptionAmount(e.target.value)} placeholder="2500" />
        <Input label="Próximo pago" type="date" value={nextPayment} onChange={e => setNextPayment(e.target.value)} />
        <Input label="Últimos 4 dígitos" value={last4} onChange={e => setLast4(e.target.value)} placeholder="4242" maxLength={4} />
        <Input label="Stripe Customer ID" value={stripeCustomer} onChange={e => setStripeCustomer(e.target.value)} placeholder="cus_..." />
        <Input label="Stripe Subscription ID" value={stripeSub} onChange={e => setStripeSub(e.target.value)} placeholder="sub_..." className="sm:col-span-2" />
      </div>
      <Textarea label="Descripción / Documentación (Markdown)" value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="Describe la solución en Markdown..." />
      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={loading}>Guardar cambios</Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-400">
            <CheckCircle size={15} /> Guardado
          </span>
        )}
      </div>
    </div>
  )
}
