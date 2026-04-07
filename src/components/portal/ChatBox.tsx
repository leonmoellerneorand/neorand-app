// src/components/portal/ChatBox.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { sendChatMessage } from '@/actions/sendChatMessage'
import { Button } from '@/components/ui/Button'
import { cn, formatDateTime } from '@/lib/utils'
import { Send } from 'lucide-react'
import type { ChatMessage } from '@/types'

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function DateSeparator({ date }: { date: string }) {
  const label = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-brand-card-border" />
      <span className="text-xs text-brand-text-muted px-2">{label}</span>
      <div className="flex-1 h-px bg-brand-card-border" />
    </div>
  )
}

export function ChatBox({ dealId, initialMessages }: { dealId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const supabase = createBrowserClient()
    async function fetchMessages() {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data as ChatMessage[])
    }
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [dealId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    setLoading(true)
    try {
      await sendChatMessage(dealId, input, 'client')
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data as ChatMessage[])
      setInput('')
    } catch {
      // message failed — keep input
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[700px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {messages.length === 0 && (
          <p className="text-center text-sm text-brand-text-muted py-12">
            Aún no hay mensajes. ¡Escribe algo!
          </p>
        )}
        {messages.map((msg, i) => {
          const showDate = i === 0 || !isSameDay(messages[i - 1].created_at, msg.created_at)
          const isClient = msg.sender === 'client'
          return (
            <div key={msg.id}>
              {showDate && <DateSeparator date={msg.created_at} />}
              <div className={cn('flex mb-3', isClient ? 'justify-end' : 'justify-start')}>
                {!isClient && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-blue to-brand-sky flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-white self-end">
                    N
                  </div>
                )}
                <div className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm',
                  isClient
                    ? 'bg-brand-blue text-white rounded-br-sm'
                    : 'card-base text-brand-text-secondary rounded-bl-sm'
                )}>
                  <p>{msg.message}</p>
                  <p className={cn('text-[10px] mt-1', isClient ? 'text-blue-200' : 'text-brand-text-muted')}>
                    {formatDateTime(msg.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-brand-card-border p-4">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-brand-text-primary placeholder:text-brand-text-muted bg-brand-card-bg border border-brand-card-border focus:outline-none focus:border-brand-blue/60 transition-colors"
          />
          <Button type="submit" loading={loading} disabled={!input.trim()} className="flex-shrink-0">
            <Send size={15} />
          </Button>
        </form>
      </div>
    </div>
  )
}
