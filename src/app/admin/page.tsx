// src/app/admin/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { StatusBadge, SubscriptionBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { AdminDealRow } from '@/types'

export default async function AdminPage() {
  const db = createServerClient()
  const { data: deals } = await db
    .from('deals')
    .select('*, contacts(*)')
    .order('created_at', { ascending: false })

  const rows = (deals ?? []) as AdminDealRow[]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Deals</h1>
          <p className="text-brand-text-muted text-sm mt-1">{rows.length} clientes</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} />
          Nuevo deal
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-card-border">
                {['Cliente', 'Empresa', 'Solución', 'Estado', 'Suscripción', 'Próximo pago'].map(h => (
                  <th key={h} className="text-left text-xs text-brand-text-muted py-3 px-4 font-semibold uppercase tracking-widest first:pl-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-brand-text-muted">Sin deals registrados</td>
                </tr>
              ) : (
                rows.map(deal => (
                  <tr
                    key={deal.id}
                    className="border-b border-brand-card-border/40 last:border-0 hover:bg-brand-card-bg/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 pl-5 pr-4">
                      <Link href={`/admin/deals/${deal.id}`} className="block hover:text-brand-sky transition-colors">
                        <span className="font-medium text-brand-text-primary">{deal.contacts?.full_name ?? '—'}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-brand-text-secondary">{deal.contacts?.company ?? '—'}</td>
                    <td className="py-3 px-4 text-brand-text-secondary">{deal.solution_name ?? '—'}</td>
                    <td className="py-3 px-4"><StatusBadge status={deal.status} /></td>
                    <td className="py-3 px-4"><SubscriptionBadge status={deal.subscription_status} /></td>
                    <td className="py-3 px-4 text-brand-text-muted">{formatDate(deal.next_payment_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
