// src/app/admin/deals/[id]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardLabel } from '@/components/ui/Card'
import { DealEditForm } from './DealEditForm'
import { AdminChatPanel } from './AdminChatPanel'
import { UrgencyBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { DealWithContact, ChatMessage, SolutionRequest } from '@/types'

export default async function AdminDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createServerClient()

  const { data: deal } = await db
    .from('deals')
    .select('*, contacts(*)')
    .eq('id', id)
    .single()

  if (!deal) notFound()

  const [{ data: messages }, { data: requests }] = await Promise.all([
    db.from('chat_messages').select('*').eq('deal_id', id).order('created_at', { ascending: true }),
    db.from('solution_requests').select('*').eq('deal_id', id).order('created_at', { ascending: false }),
  ])

  const d = deal as DealWithContact

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-sky transition-colors mb-4">
          <ChevronLeft size={15} />
          Volver a deals
        </Link>
        <h1 className="text-2xl font-bold text-brand-text-primary">
          {d.contacts?.full_name ?? 'Cliente'}
        </h1>
        <p className="text-brand-text-muted text-sm">{d.contacts?.email} · {d.contacts?.company}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form — 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardLabel>Editar deal</CardLabel>
            <div className="mt-4">
              <DealEditForm deal={d} />
            </div>
          </Card>
        </div>

        {/* Sidebar — 1/3 width */}
        <div className="flex flex-col gap-6">
          {/* Chat */}
          <Card>
            <CardLabel>Chat con cliente</CardLabel>
            <div className="mt-3">
              <AdminChatPanel dealId={id} initialMessages={(messages ?? []) as ChatMessage[]} />
            </div>
          </Card>

          {/* Solution requests */}
          <Card>
            <CardLabel>Solicitudes de solución</CardLabel>
            {!requests || requests.length === 0 ? (
              <p className="text-xs text-brand-text-muted mt-3">Sin solicitudes</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {(requests as SolutionRequest[]).map(req => (
                  <div key={req.id} className="py-2 border-b border-brand-card-border/40 last:border-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-brand-text-primary">{req.solution_type}</span>
                      <UrgencyBadge urgency={req.urgency} />
                    </div>
                    <p className="text-xs text-brand-text-muted line-clamp-2">{req.description}</p>
                    <p className="text-[10px] text-brand-text-muted mt-1">{formatDate(req.created_at)} · {req.status}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
