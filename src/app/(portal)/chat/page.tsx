// src/app/(portal)/chat/page.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { ChatBox } from '@/components/portal/ChatBox'
import type { ChatMessage } from '@/types'

export default async function ChatPage() {
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

  const { data: messages } = await db
    .from('chat_messages')
    .select('*')
    .eq('deal_id', deal.id)
    .order('created_at', { ascending: true })

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text-primary">Chat</h1>
        <p className="text-brand-text-muted text-sm mt-1">Mensajes directos con el equipo NEORAND</p>
      </div>
      <Card className="!p-0 overflow-hidden">
        <ChatBox dealId={deal.id} initialMessages={(messages ?? []) as ChatMessage[]} />
      </Card>
    </div>
  )
}
