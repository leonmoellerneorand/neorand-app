// src/app/(portal)/reportes/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardLabel } from '@/components/ui/Card'
import { ActivityChart } from '@/components/portal/ActivityChart'
import { DownloadReportButton } from '@/components/portal/ReportPDF'
import type { ActivityLog, DealWithContact } from '@/types'

function groupByMonth(logs: ActivityLog[]) {
  const map = new Map<string, { total: number; success: number; error: number; info: number }>()
  logs.forEach(log => {
    const date = new Date(log.created_at)
    const key = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(date)
    const entry = map.get(key) ?? { total: 0, success: 0, error: 0, info: 0 }
    entry.total++
    entry[log.type as 'success' | 'error' | 'info']++
    map.set(key, entry)
  })
  return Array.from(map.entries()).map(([month, data]) => ({ month, ...data }))
}

export default async function ReportesPage() {
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
  const { data: deal } = await db.from('deals').select('*, contacts(*)').eq('auth_user_id', session.user.id).single()
  if (!deal) redirect('/register')

  const d = deal as DealWithContact

  const { data: logs } = await db
    .from('activity_logs')
    .select('*')
    .eq('deal_id', deal.id)
    .order('created_at', { ascending: false })

  const monthlyData = groupByMonth((logs ?? []) as ActivityLog[])
  const chartData = monthlyData.slice(0, 6).reverse().map(m => ({
    month: m.month.split(' ')[0].slice(0, 3),
    total: m.total,
    success: m.success,
    error: m.error,
  }))

  const generatedDate = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text-primary">Reportes</h1>
        <p className="text-brand-text-muted text-sm mt-1">Histórico mensual de actividad de tu solución</p>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="mb-6">
          <CardLabel>Actividad — últimos 6 meses</CardLabel>
          <div className="mt-4">
            <ActivityChart data={chartData} />
          </div>
        </Card>
      )}

      {/* Monthly reports table */}
      <Card>
        <CardLabel>Reportes disponibles</CardLabel>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-brand-text-muted py-4">Sin datos de actividad aún</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {monthlyData.map(row => (
              <div key={row.month} className="flex items-center justify-between py-3 border-b border-brand-card-border/40 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-brand-text-primary capitalize">{row.month}</p>
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    {row.total} ejecuciones · {row.success} exitosas · {row.error} errores
                  </p>
                </div>
                <DownloadReportButton data={{
                  month: row.month,
                  contactName: d.contacts.full_name,
                  company: d.contacts.company ?? '',
                  solutionName: d.solution_name ?? '',
                  total: row.total,
                  success: row.success,
                  error: row.error,
                  info: row.info,
                  generatedDate,
                }} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
