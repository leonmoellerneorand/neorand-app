// src/app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
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

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const db = createServerClient()
  const { data: deal } = await db
    .from('deals')
    .select('stripe_customer_id')
    .eq('auth_user_id', session.user.id)
    .single()

  if (!deal?.stripe_customer_id) {
    return NextResponse.json({ error: 'No hay cliente de Stripe vinculado' }, { status: 400 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: deal.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/pagos`,
  })

  return NextResponse.json({ url: portalSession.url })
}
