// src/app/(portal)/mi-solucion/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SolutionTimeline } from '@/components/portal/SolutionTimeline'
import { MarkdownRenderer } from '@/components/portal/MarkdownRenderer'
import type { DealWithContact } from '@/types'

export default async function MiSolucionPage() {
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

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary">
              {d.solution_name ?? 'Mi Solución'}
            </h1>
            <p className="text-brand-text-muted text-sm mt-1">{d.contacts.company}</p>
          </div>
          <StatusBadge status={d.status} />
        </div>
      </div>

      {/* Timeline */}
      <Card className="mb-6">
        <h2 className="text-xs font-semibold text-brand-text-muted uppercase tracking-widest mb-4">
          Progreso
        </h2>
        <SolutionTimeline status={d.status} />
      </Card>

      {/* Documentation */}
      {d.solution_description ? (
        <Card>
          <h2 className="text-xs font-semibold text-brand-text-muted uppercase tracking-widest mb-4">
            Documentación
          </h2>
          <MarkdownRenderer content={d.solution_description} />
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-brand-text-muted text-center py-4">
            La documentación de tu solución estará disponible pronto.
          </p>
        </Card>
      )}
    </div>
  )
}
