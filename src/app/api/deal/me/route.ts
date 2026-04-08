import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseAuthClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
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
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const db = createServerClient()
  const { data: deal } = await db
    .from('deals')
    .select('solution_name, subscription_amount, one_time_amount, payment_status')
    .eq('auth_user_id', session.user.id)
    .single()

  return NextResponse.json({ deal })
}
