// src/components/portal/ActivityTable.tsx
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { ActivityTypeBadge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'
import type { ActivityLog } from '@/types'

export function ActivityTable({ dealId, initialLogs }: { dealId: string; initialLogs: ActivityLog[] }) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs)

  useEffect(() => {
    const supabase = createBrowserClient()
    async function fetchLogs() {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false })
      if (data) setLogs(data as ActivityLog[])
    }
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [dealId])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-card-border">
            <th className="text-left text-xs text-brand-text-muted pb-3 font-semibold uppercase tracking-widest w-40">Fecha / Hora</th>
            <th className="text-left text-xs text-brand-text-muted pb-3 font-semibold uppercase tracking-widest w-24">Tipo</th>
            <th className="text-left text-xs text-brand-text-muted pb-3 font-semibold uppercase tracking-widest">Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-brand-text-muted text-sm">
                Sin registros de actividad
              </td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id} className="border-b border-brand-card-border/40 last:border-0 hover:bg-brand-card-bg/30 transition-colors">
                <td className="py-3 text-brand-text-muted font-mono text-xs">{formatDateTime(log.created_at)}</td>
                <td className="py-3">
                  <ActivityTypeBadge type={log.type as 'info' | 'success' | 'error'} />
                </td>
                <td className="py-3 text-brand-text-secondary">{log.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
