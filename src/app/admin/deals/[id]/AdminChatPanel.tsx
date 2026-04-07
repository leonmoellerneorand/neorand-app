// src/app/admin/deals/[id]/AdminChatPanel.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { sendChatMessage } from '@/actions/sendChatMessage'
import { Button } from '@/components/ui/Button'
import { cn, formatDateTime } from '@/lib/utils'
import { Send } from 'lucide-react'
import type { ChatMessage } from '@/types'

export function AdminChatPanel({ dealId, initialMessages }: { dealId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const supabase = createBrowserClient()
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data as ChatMessage[])
    }, 10000)
    return () => clearInterval(interval)
  }, [dealId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    setLoading(true)
    try {
      await sendChatMessage(dealId, input, 'admin')
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data as ChatMessage[])
      setInput('')
    } catch { /* keep input */ }
    finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2">
        {messages.length === 0 && <p className="text-xs text-brand-text-muted text-center py-8">Sin mensajes</p>}
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex', msg.sender === 'admin' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-xs px-3 py-2 rounded-xl text-sm',
              msg.sender === 'admin' ? 'bg-brand-blue text-white' : 'card-base text-brand-text-secondary'
            )}>
              <p>{msg.message}</p>
              <p className={cn('text-[10px] mt-0.5', msg.sender === 'admin' ? 'text-blue-200' : 'text-brand-text-muted')}>
                {formatDateTime(msg.created_at)} · {msg.sender}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-brand-card-border">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Responder como admin..."
          className="flex-1 px-3 py-2 rounded-lg text-sm text-brand-text-primary placeholder:text-brand-text-muted bg-brand-card-bg border border-brand-card-border focus:outline-none focus:border-brand-blue/60 transition-colors"
        />
        <Button type="submit" loading={loading} disabled={!input.trim()} size="sm">
          <Send size={13} />
        </Button>
      </form>
    </div>
  )
}
