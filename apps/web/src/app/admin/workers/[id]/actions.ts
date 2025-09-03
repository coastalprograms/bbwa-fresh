'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { UpdateCertificationResponse } from '@/types/workers'

export async function updateCertification(formData: FormData): Promise<UpdateCertificationResponse> {
  const supabase = createClient()

  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { errors: { form: 'Authentication required' } }
  }

  // Get form data
  const workerId = String(formData.get('workerId') || '')
  const status = String(formData.get('status') || '')
  const expiryDate = String(formData.get('expiryDate') || '')

  // Validate required fields
  if (!workerId) {
    return { errors: { form: 'Invalid worker ID' } }
  }

  if (!status || !['Valid', 'Expired', 'Awaiting Review'].includes(status)) {
    return { errors: { status: 'Please select a valid status' } }
  }

  // Validate expiry date logic
  if (status === 'Valid' && expiryDate) {
    const expiry = new Date(expiryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (expiry < today) {
      return { errors: { expiryDate: 'Expiry date must be today or later for Valid status' } }
    }
  }

  try {
    // Check if worker exists
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('id')
      .eq('id', workerId)
      .single()

    if (workerError || !worker) {
      return { errors: { form: 'Worker not found' } }
    }

    // Insert new certification record (append-only)
    const { error: insertError } = await supabase
      .from('certifications')
      .insert({
        worker_id: workerId,
        type: 'White Card', // Default type for now
        status,
        expiry_date: expiryDate || null,
        file_url: null // No file upload in this story
      })

    if (insertError) {
      console.error('Failed to update certification:', insertError)
      return { errors: { form: 'Unable to update certification at this time' } }
    }

    // Revalidate affected pages
    revalidatePath('/admin/workers')
    revalidatePath(`/admin/workers/${workerId}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error updating certification:', error)
    return { errors: { form: 'An unexpected error occurred' } }
  }
}