// src/app/(portal)/nueva-solucion/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardLabel } from '@/components/ui/Card'
import { UrgencyBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { NuevaSolucionForm } from './NuevaSolucionForm'
import type { SolutionRequest } from '@/types'

export default async function NuevaSolucionPage() {
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
  const { data: deal } = await db.from('deals').select('id').eq('auth_user_id', session.user.id).single()
  if (!deal) redirect('/register')

  const { data: requests } = await db
    .from('solution_requests')
    .select('*')
    .eq('deal_id', deal.id)
    .order('created_at', { ascending: false })

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text-primary">Solicitar nueva solución</h1>
        <p className="text-brand-text-muted text-sm mt-1">Cuéntanos qué necesitas y nos ponemos en contacto</p>
      </div>

      <Card className="mb-8">
        <NuevaSolucionForm dealId={deal.id} />
      </Card>

      {/* Previous requests */}
      {requests && requests.length > 0 && (
        <Card>
          <CardLabel>Solicitudes anteriores</CardLabel>
          <div className="mt-3 flex flex-col gap-2">
            {(requests as SolutionRequest[]).map(req => (
              <div key={req.id} className="flex items-start justify-between py-3 border-b border-brand-card-border/40 last:border-0 gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-text-primary">{req.solution_type}</p>
                  <p className="text-xs text-brand-text-muted mt-0.5">{formatDate(req.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <UrgencyBadge urgency={req.urgency} />
                  <span className="text-xs text-brand-text-muted capitalize">{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
