'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function signInAction({
  email,
  password,
  csrfToken,
}: {
  email: string
  password: string
  csrfToken: string
}) {
  const cookieToken = cookies().get('csrf_token')?.value
  if (!cookieToken || cookieToken !== csrfToken) {
    return { error: 'Invalid CSRF token' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: error.message }
  }

  redirect('/admin')
}
