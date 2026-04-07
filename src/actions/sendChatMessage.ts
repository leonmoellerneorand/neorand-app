// src/actions/sendChatMessage.ts
'use server'
import { createServerClient } from '@/lib/supabase/server'

export async function sendChatMessage(dealId: string, message: string, sender: 'client' | 'admin') {
  if (!message.trim()) throw new Error('Mensaje vacío')

  const db = createServerClient()
  const { error } = await db.from('chat_messages').insert({
    deal_id: dealId,
    sender,
    message: message.trim(),
  })

  if (error) throw new Error('Error al enviar mensaje')
}
