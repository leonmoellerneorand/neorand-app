'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Anon key client — use in Client Components for polling.
 * Session is managed automatically via cookies.
 */
export function createBrowserClient() {
  return createClientComponentClient()
}
