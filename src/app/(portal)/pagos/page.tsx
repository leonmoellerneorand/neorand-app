// src/app/(portal)/pagos/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { SubscriptionBadge } from '@/components/ui/Badge'
import { Card, CardLabel } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { DealWithContact } from '@/types'
import type Stripe from 'stripe'
import { StripePortalButton } from './StripePortalButton'

export default async function PagosPage() {
  const cookieStore = await cookies()
  const authClient = createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    }
  )
  const { data: { session } } = await authClient.auth.getSession()
  if (!session) redirect('/login')

  const db = createServerClient()
  const { data: deal } = await db
    .from('deals')
    .select('*, contacts(*)')
    .eq('auth_user_id', session.user.id)
    .single()

  if (!deal) redirect('/register')
  const d = deal as DealWithContact

  let invoices: Stripe.Invoice[] = []
  if (d.stripe_customer_id) {
    try {
      const { data } = await stripe.invoices.list({
        customer: d.stripe_customer_id,
        limit: 6,
      })
      invoices = data
    } catch {
      // Stripe not configured or customer not found — silently fail
    }
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text-primary">Pagos</h1>
        <p className="text-brand-text-muted text-sm mt-1">Gestiona tu suscripción y método de pago</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          label="Suscripción mensual"
          value={formatCurrency(d.subscription_amount)}
          sub={<SubscriptionBadge status={d.subscription_status} />}
        />
        <StatCard
          label="Próximo pago"
          value={formatDate(d.next_payment_date)}
        />
      </div>

      {/* Payment method */}
      <Card className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardLabel>Método de pago</CardLabel>
            <p className="text-brand-text-primary font-semibold">
              {d.payment_method_last4 ? `•••• •••• •••• ${d.payment_method_last4}` : 'Sin método registrado'}
            </p>
          </div>
          <StripePortalButton hasCustomer={!!d.stripe_customer_id} />
        </div>
      </Card>

      {/* Payment history */}
      <Card>
        <CardLabel>Historial de pagos</CardLabel>
        {invoices.length === 0 ? (
          <p className="text-sm text-brand-text-muted py-4">Sin historial de pagos aún</p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-card-border">
                  <th className="text-left text-xs text-brand-text-muted pb-2 font-semibold uppercase tracking-widest">Fecha</th>
                  <th className="text-left text-xs text-brand-text-muted pb-2 font-semibold uppercase tracking-widest">Monto</th>
                  <th className="text-left text-xs text-brand-text-muted pb-2 font-semibold uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-brand-card-border/50 last:border-0">
                    <td className="py-3 text-brand-text-secondary">
                      {new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date((inv.created) * 1000))}
                    </td>
                    <td className="py-3 text-brand-text-primary font-medium">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: inv.currency.toUpperCase() }).format((inv.amount_paid ?? 0) / 100)}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        inv.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {inv.status === 'paid' ? 'Pagado' : 'Fallido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
