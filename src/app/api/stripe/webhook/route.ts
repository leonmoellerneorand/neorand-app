// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  const db = createServerClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      metadata?: { deal_id?: string }
      subscription?: string
      customer?: string
    }
    const dealId = session.metadata?.deal_id
    const subscriptionId = session.subscription
    const customerId = session.customer

    if (dealId) {
      await db
        .from('deals')
        .update({
          payment_status: 'active',
          subscription_status: 'activa',
          ...(subscriptionId && { stripe_subscription_id: subscriptionId }),
          ...(customerId && { stripe_customer_id: customerId }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', dealId)
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as { subscription?: string; customer?: string; lines?: { data: Array<{ period?: { end?: number } }> } }
    const subscriptionId = invoice.subscription
    const customerId = invoice.customer
    const periodEnd = invoice.lines?.data?.[0]?.period?.end

    const nextPaymentDate = periodEnd
      ? new Date(periodEnd * 1000).toISOString().split('T')[0]
      : null

    if (subscriptionId) {
      await db
        .from('deals')
        .update({
          subscription_status: 'activa',
          ...(nextPaymentDate && { next_payment_date: nextPaymentDate }),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId)
    } else if (customerId) {
      await db
        .from('deals')
        .update({
          subscription_status: 'activa',
          ...(nextPaymentDate && { next_payment_date: nextPaymentDate }),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId)
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as { subscription?: string; customer?: string }
    const subscriptionId = invoice.subscription
    const customerId = invoice.customer

    if (subscriptionId) {
      await db
        .from('deals')
        .update({ subscription_status: 'pago fallido', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscriptionId)
    } else if (customerId) {
      await db
        .from('deals')
        .update({ subscription_status: 'pago fallido', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId)
    }
  }

  return NextResponse.json({ received: true })
}
