// src/app/api/auth/link-deal/route.ts
import { NextResponse } from 'next/server'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/utils'

export async function POST(req: Request) {
  const { dealId } = await req.json()

  if (!dealId || !isValidUUID(dealId)) {
    return NextResponse.json({ error: 'Código inválido' }, { status: 400 })
  }

  // Get current auth user
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

  // Use service role to update deal
  const db = createServerClient()

  const { data: deal, error: fetchError } = await db
    .from('deals')
    .select('id, auth_user_id')
    .eq('id', dealId)
    .single()

  if (fetchError || !deal) {
    return NextResponse.json({ error: 'Código inválido o ya en uso' }, { status: 404 })
  }

  if (deal.auth_user_id !== null) {
    return NextResponse.json({ error: 'Código inválido o ya en uso' }, { status: 409 })
  }

  const { error: updateError } = await db
    .from('deals')
    .update({ auth_user_id: session.user.id })
    .eq('id', dealId)

  if (updateError) {
    return NextResponse.json({ error: 'Error al vincular. Intenta de nuevo.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
