// src/app/(portal)/dashboard/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge, SubscriptionBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ActivityFeed } from '@/components/portal/ActivityFeed'
import { formatCurrency, formatDate, getGreeting } from '@/lib/utils'
import Link from 'next/link'
import type { DealWithContact, ActivityLog } from '@/types'

export default async function DashboardPage() {
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

  const { data: logs } = await db
    .from('activity_logs')
    .select('*')
    .eq('deal_id', deal.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const d = deal as DealWithContact
  const greeting = getGreeting()

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text-primary">
          {greeting}, {d.contacts.full_name.split(' ')[0]}
        </h1>
        <p className="text-brand-text-muted text-sm mt-1">{d.contacts.company}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Solución"
          value={d.solution_name ?? '—'}
        />
        <StatCard
          label="Estado"
          value={<StatusBadge status={d.status} />}
        />
        <StatCard
          label="Suscripción"
          value={formatCurrency(d.subscription_amount)}
          sub={
            <span className="flex items-center gap-2">
              <SubscriptionBadge status={d.subscription_status} />
              <span>· {formatDate(d.next_payment_date)}</span>
            </span>
          }
        />
        <StatCard
          label="Método de pago"
          value={d.payment_method_last4 ? `•••• ${d.payment_method_last4}` : '—'}
        />
      </div>

      {/* Activity feed */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-brand-text-primary uppercase tracking-widest">
            Actividad Reciente
          </h2>
          <Link href="/actividad" className="text-xs text-brand-sky hover:underline">
            Ver todo
          </Link>
        </div>
        <ActivityFeed dealId={deal.id} initialLogs={(logs ?? []) as ActivityLog[]} />
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/nueva-solucion">
          <Button variant="primary">Solicitar nueva solución</Button>
        </Link>
        <Link href="/chat">
          <Button variant="secondary">Ir al chat</Button>
        </Link>
      </div>
    </div>
  )
}
