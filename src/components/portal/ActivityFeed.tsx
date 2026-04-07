// src/components/portal/ActivityFeed.tsx
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { ActivityTypeBadge } from '@/components/ui/Badge'
import { relativeTime } from '@/lib/utils'
import type { ActivityLog } from '@/types'

export function ActivityFeed({ dealId, initialLogs }: { dealId: string; initialLogs: ActivityLog[] }) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs)

  useEffect(() => {
    const supabase = createBrowserClient()
    async function fetchLogs() {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false })
        .limit(10)
      if (data) setLogs(data as ActivityLog[])
    }
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [dealId])

  if (logs.length === 0) {
    return (
      <p className="text-sm text-brand-text-muted text-center py-6">
        Sin actividad reciente
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {logs.map(log => (
        <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-brand-card-border last:border-0">
          <div className="mt-0.5 flex-shrink-0">
            <ActivityTypeBadge type={log.type as 'info' | 'success' | 'error'} />
          </div>
          <p className="text-sm text-brand-text-secondary flex-1">{log.message}</p>
          <span className="text-xs text-brand-text-muted flex-shrink-0">{relativeTime(log.created_at)}</span>
        </div>
      ))}
    </div>
  )
}
