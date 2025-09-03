import { createClient } from '@supabase/supabase-js'

// Server-only admin client using the service role key.
// Never import this file in Client Components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin env vars missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  // Note: Using the service role key elevates auth.role() to 'service_role'.
  // RLS policies must explicitly allow desired operations for service_role.
  return createClient(url, serviceKey)
}
