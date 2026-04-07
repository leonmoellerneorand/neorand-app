// src/app/admin/layout.tsx
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)
  if (!adminEmails.includes(session.user.email ?? '')) redirect('/login')

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-card-border bg-[#020510] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-blue shadow-glow-sm" />
            <span className="text-brand-gradient font-black text-sm tracking-widest uppercase">NEORAND</span>
          </Link>
          <span className="text-brand-text-muted text-xs border border-brand-card-border px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
        <span className="text-xs text-brand-text-muted">{session.user.email}</span>
      </header>
      <main className="px-6 py-8 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
