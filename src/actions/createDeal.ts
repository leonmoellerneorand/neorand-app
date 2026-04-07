'use server'
import { createServerClient } from '@/lib/supabase/server'

export interface CreateDealInput {
  full_name: string
  email: string
  company: string
  phone: string
  solution_name: string
  solution_description: string
  subscription_amount: number
  one_time_amount: number
}

export async function createDeal(input: CreateDealInput): Promise<{ id: string }> {
  const db = createServerClient()

  // Create contact
  const { data: contact, error: contactError } = await db
    .from('contacts')
    .insert({
      full_name: input.full_name,
      email: input.email,
      company: input.company || null,
      phone: input.phone || null,
    })
    .select('id')
    .single()

  if (contactError || !contact) throw new Error('Error al crear contacto')

  // Create deal
  const { data: deal, error: dealError } = await db
    .from('deals')
    .insert({
      contact_id: contact.id,
      solution_name: input.solution_name || null,
      solution_description: input.solution_description || null,
      subscription_amount: input.subscription_amount,
      one_time_amount: input.one_time_amount,
      status: 'en desarrollo',
      subscription_status: 'cancelada',
      payment_status: 'pending_payment',
    })
    .select('id')
    .single()

  if (dealError || !deal) throw new Error('Error al crear deal')

  return { id: deal.id }
}
