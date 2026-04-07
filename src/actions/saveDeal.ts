// src/actions/saveDeal.ts
'use server'
import { createServerClient } from '@/lib/supabase/server'
import type { Deal } from '@/types'

type DealUpdate = Partial<Pick<Deal,
  'solution_name' | 'solution_description' | 'status' | 'subscription_status' |
  'next_payment_date' | 'payment_method_last4' | 'stripe_customer_id' | 'stripe_subscription_id'
>>

export async function saveDeal(id: string, data: DealUpdate) {
  const db = createServerClient()
  const { error } = await db
    .from('deals')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error('Error al guardar')
}
