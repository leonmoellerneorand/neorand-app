// src/app/(portal)/actividad/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { ActivityTable } from '@/components/portal/ActivityTable'
import type { ActivityLog } from '@/types'

export default async function ActividadPage() {
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

  const { data: logs } = await db
    .from('activity_logs')
    .select('*')
    .eq('deal_id', deal.id)
    .order('created_at', { ascending: false })

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text-primary">Actividad</h1>
        <p className="text-brand-text-muted text-sm mt-1">Registro en tiempo real · se actualiza cada 30s</p>
      </div>
      <Card>
        <ActivityTable dealId={deal.id} initialLogs={(logs ?? []) as ActivityLog[]} />
      </Card>
    </div>
  )
}
