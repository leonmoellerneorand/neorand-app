// src/app/(portal)/layout.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@/lib/supabase/server'
import { DealProvider } from '@/components/portal/DealContext'
import { Sidebar } from '@/components/portal/Sidebar'
import { PortalBackground } from '@/components/portal/PortalBackground'
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
        <PortalBackground />

        {/* Static ambient glows behind content */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)',
          }} />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 65%)',
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
