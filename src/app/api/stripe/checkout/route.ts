import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createServerClient as createSupabaseAuthClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function POST(req: Request) {
  // Auth: accept either cookie session or Bearer token (mobile)
  const headersList = await headers()
  const authHeader = headersList.get('authorization')

  let userId: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const db = createServerClient()
    const { data: { user } } = await db.auth.getUser(token)
    userId = user?.id ?? null
  } else {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const authClient = createSupabaseAuthClient(
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
    userId = session?.user?.id ?? null
  }

  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const db = createServerClient()
  const { data: deal } = await db
    .from('deals')
    .select('id, solution_name, subscription_amount, one_time_amount, stripe_customer_id, payment_status')
    .eq('auth_user_id', userId)
    .single()

  if (!deal) {
    return NextResponse.json({ error: 'Deal no encontrado' }, { status: 404 })
  }

  if (deal.payment_status === 'active') {
    return NextResponse.json({ error: 'Ya pagado' }, { status: 400 })
  }

  const stripe = getStripe()

  // Get or create Stripe customer
  let customerId = deal.stripe_customer_id
  if (!customerId) {
    const { data: contact } = await db
      .from('contacts')
      .select('email, full_name')
      .eq('id', (await db.from('deals').select('contact_id').eq('id', deal.id).single()).data?.contact_id)
      .single()

    const customer = await stripe.customers.create({
      name: contact?.full_name ?? undefined,
      email: contact?.email ?? undefined,
      metadata: { deal_id: deal.id },
    })
    customerId = customer.id
    await db.from('deals').update({ stripe_customer_id: customerId }).eq('id', deal.id)
  }

  const lineItems: { price_data: { currency: string; product_data: { name: string }; unit_amount: number; recurring?: { interval: string } }; quantity: number }[] = [
    {
      price_data: {
        currency: 'mxn',
        product_data: { name: deal.solution_name ?? 'Solución NEORAND' },
        unit_amount: Math.round(deal.subscription_amount * 100),
        recurring: { interval: 'month' },
      },
      quantity: 1,
    },
  ]

  if (deal.one_time_amount > 0) {
    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: { name: `Configuración: ${deal.solution_name ?? 'NEORAND'}` },
        unit_amount: Math.round(deal.one_time_amount * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: lineItems,
    success_url: `${APP_URL}/payment-success`,
    cancel_url: `${APP_URL}/payment-cancel`,
    metadata: { deal_id: deal.id },
  })

  return NextResponse.json({ url: session.url })
}
