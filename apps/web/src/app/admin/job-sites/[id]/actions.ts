'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { SwmsJobCreateData, SwmsJobUpdateData } from '@/types/swms'

export async function createSwmsJob(
  jobSiteId: string, 
  data: SwmsJobCreateData
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: swmsJob, error } = await supabase
      .from('swms_jobs')
      .insert({
        job_site_id: jobSiteId,
        name: data.name,
        description: data.description || null,
        start_date: data.start_date,
        end_date: data.end_date || null,
        status: data.status || 'planned'
      })
      .select()
      .single()
      
    if (error) throw error
    
    revalidatePath(`/admin/job-sites/${jobSiteId}`)
    return { success: true, data: swmsJob }
  } catch (error) {
    console.error('Create SWMS job error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function updateSwmsJob(
  jobSiteId: string,
  swmsJobId: string,
  data: SwmsJobUpdateData
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: swmsJob, error } = await supabase
      .from('swms_jobs')
      .update({
        name: data.name,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
      })
      .eq('id', swmsJobId)
      .eq('job_site_id', jobSiteId) // Security: ensure job belongs to the site
      .select()
      .single()
      
    if (error) throw error
    
    revalidatePath(`/admin/job-sites/${jobSiteId}`)
    return { success: true, data: swmsJob }
  } catch (error) {
    console.error('Update SWMS job error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteSwmsJob(
  jobSiteId: string,
  swmsJobId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { error } = await supabase
      .from('swms_jobs')
      .delete()
      .eq('id', swmsJobId)
      .eq('job_site_id', jobSiteId) // Security: ensure job belongs to the site
      
    if (error) throw error
    
    revalidatePath(`/admin/job-sites/${jobSiteId}`)
    return { success: true }
  } catch (error) {
    console.error('Delete SWMS job error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}