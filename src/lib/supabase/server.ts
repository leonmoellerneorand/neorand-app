import { createClient } from '@supabase/supabase-js'

/**
 * Service role client — use in Server Components, API routes, Server Actions.
 * NEVER expose to the browser.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
