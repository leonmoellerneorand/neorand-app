// src/middleware.ts
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return req.cookies.get(name)?.value },
        set(name, value, options) { res.cookies.set({ name, value, ...options }) },
        remove(name, options) { res.cookies.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map(e => e.trim())
      .filter(Boolean)
    if (!adminEmails.includes(session.user.email ?? '')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mi-solucion/:path*',
    '/pagos/:path*',
    '/actividad/:path*',
    '/reportes/:path*',
    '/nueva-solucion/:path*',
    '/chat/:path*',
    '/admin/:path*',
  ],
}
