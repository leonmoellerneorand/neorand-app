'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardLabel } from '@/components/ui/Card'
import { createDeal } from '@/actions/createDeal'
import Link from 'next/link'
import { ChevronLeft, Copy, CheckCircle } from 'lucide-react'

export default function NewDealPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [solutionName, setSolutionName] = useState('')
  const [description, setDescription] = useState('')
  const [subscriptionAmount, setSubscriptionAmount] = useState('')
  const [oneTimeAmount, setOneTimeAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit() {
    if (!fullName || !email || !subscriptionAmount) {
      setError('Nombre, email y monto mensual son obligatorios')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { id } = await createDeal({
        full_name: fullName,
        email,
        company,
        phone,
        solution_name: solutionName,
        solution_description: description,
        subscription_amount: parseFloat(subscriptionAmount) || 0,
        one_time_amount: parseFloat(oneTimeAmount) || 0,
      })
      setCreatedId(id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear deal')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!createdId) return
    navigator.clipboard.writeText(createdId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (createdId) {
    return (
      <div className="max-w-lg">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-brand-text-primary">Deal creado</p>
              <p className="text-xs text-brand-text-muted">Comparte este ID con el cliente</p>
            </div>
          </div>
          <div className="bg-brand-bg border border-brand-card-border rounded-xl px-4 py-3 flex items-center justify-between gap-3 mb-4">
            <code className="text-xs text-brand-sky break-all">{createdId}</code>
            <button onClick={handleCopy} className="shrink-0 text-brand-text-muted hover:text-brand-text-primary transition-colors">
              {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-brand-text-muted mb-6">
            El cliente descarga la app, se registra e ingresa este ID. Luego se le mostrará la pantalla de pago automáticamente.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => router.push(`/admin/deals/${createdId}`)}>Ver deal</Button>
            <Button variant="secondary" onClick={() => { setCreatedId(null); setFullName(''); setEmail(''); setCompany(''); setPhone(''); setSolutionName(''); setDescription(''); setSubscriptionAmount(''); setOneTimeAmount('') }}>
              Crear otro
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin" className="flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-sky transition-colors mb-4">
          <ChevronLeft size={15} />
          Volver a deals
        </Link>
        <h1 className="text-2xl font-bold text-brand-text-primary">Nuevo deal</h1>
        <p className="text-brand-text-muted text-sm mt-1">Crea el deal después de cerrar la reunión</p>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardLabel>Datos del cliente</CardLabel>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre completo *" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Juan García" />
            <Input label="Email *" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="juan@empresa.com" />
            <Input label="Empresa" value={company} onChange={e => setCompany(e.target.value)} placeholder="Empresa S.A." />
            <Input label="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+52 55 1234 5678" />
          </div>
        </Card>

        <Card>
          <CardLabel>Solución</CardLabel>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Nombre de la solución" value={solutionName} onChange={e => setSolutionName(e.target.value)} placeholder="Automatización de Ventas" />
            <Textarea label="Descripción (Markdown)" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe la solución..." />
          </div>
        </Card>

        <Card>
          <CardLabel>Precios</CardLabel>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input label="Pago único (MXN) *" type="number" value={oneTimeAmount} onChange={e => setOneTimeAmount(e.target.value)} placeholder="5000" />
            <Input label="Mensualidad (MXN) *" type="number" value={subscriptionAmount} onChange={e => setSubscriptionAmount(e.target.value)} placeholder="2500" />
          </div>
        </Card>

        {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

        <Button onClick={handleSubmit} loading={loading}>Crear deal y obtener ID</Button>
      </div>
    </div>
  )
}
