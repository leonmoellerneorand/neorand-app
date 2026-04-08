// src/components/portal/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Cpu, CreditCard, Activity,
  FileText, PlusCircle, MessageSquare, LogOut
} from 'lucide-react'
import type { Contact } from '@/types'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mi-solucion', label: 'Mi Solución', icon: Cpu },
  { href: '/pagos', label: 'Pagos', icon: CreditCard },
  { href: '/actividad', label: 'Actividad', icon: Activity },
  { href: '/reportes', label: 'Reportes', icon: FileText },
  { href: '/nueva-solucion', label: 'Nueva Solución', icon: PlusCircle },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
]

export function Sidebar({ contact }: { contact: Contact }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 border-r border-brand-blue/20 bg-[#020510]/90 z-40" style={{ boxShadow: '1px 0 30px rgba(59,130,246,0.08)', backdropFilter: 'blur(16px)' }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b border-brand-blue/10">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-brand-blue flex-shrink-0 animate-pulse" style={{ boxShadow: '0 0 8px #3b82f6, 0 0 16px rgba(59,130,246,0.4)' }} />
            <span className="text-brand-gradient font-black text-base tracking-[0.2em] uppercase">NEORAND</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-brand-blue/10 text-brand-sky border border-brand-blue/25 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
                  : 'text-[#2d5a8e] hover:text-brand-text-secondary hover:bg-brand-blue/5'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-brand-blue/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-blue to-brand-sky flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
              {contact?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-text-primary truncate">{contact?.full_name ?? 'Usuario'}</p>
              <p className="text-[10px] text-brand-text-muted truncate">{contact?.company ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-brand-card-border bg-[#020510] flex">
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center py-3 gap-1 text-[10px] transition-colors',
              pathname === href ? 'text-brand-sky' : 'text-brand-text-muted'
            )}
          >
            <Icon size={18} />
            {label.split(' ')[0]}
          </Link>
        ))}
      </nav>
    </>
  )
}
