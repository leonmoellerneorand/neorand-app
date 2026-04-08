// src/app/(portal)/layout.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { DealProvider } from '@/components/portal/DealContext'
import { Sidebar } from '@/components/portal/Sidebar'
import type { DealWithContact } from '@/types'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // Get session via auth helpers (handles cookie refresh)
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

  // Fetch deal using service role
  const db = createServerClient()
  const { data: deal } = await db
    .from('deals')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()

  if (!deal) redirect('/register')

  if (deal.payment_status === 'pending_payment') redirect('/pay')

  // Fetch contact separately if contact_id exists
  let contact = null
  if (deal.contact_id) {
    const { data } = await db
      .from('contacts')
      .select('*')
      .eq('id', deal.contact_id)
      .single()
    contact = data
  }

  const dealWithContact = { ...deal, contacts: contact } as DealWithContact

  return (
    <DealProvider deal={dealWithContact}>
      <div className="flex min-h-screen relative">
        {/* Background decorative layer */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          {/* Top-left glow */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }} />
          {/* Bottom-right glow */}
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
          }} />
          {/* Center subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]" style={{
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)',
          }} />
        </div>

        <Sidebar contact={dealWithContact.contacts} />
        <main className="flex-1 md:ml-56 pb-20 md:pb-0 relative" style={{ zIndex: 1 }}>
          {children}
        </main>
      </div>
    </DealProvider>
  )
}
