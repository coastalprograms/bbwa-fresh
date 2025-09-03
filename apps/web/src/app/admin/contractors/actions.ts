'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ContractorFormData, ContractorWithWorkerCount } from '@/types/contractors'

export async function getContractors(): Promise<{ success: boolean; data?: ContractorWithWorkerCount[]; error?: string }> {
  try {
    const supabase = createClient()
    
    // Fetch contractors with employee counts using LEFT JOIN
    const { data: contractors, error } = await supabase
      .from('contractors')
      .select(`
        id,
        name,
        abn,
        contact_email,
        contact_phone,
        address,
        active,
        created_at,
        updated_at,
        workers:workers(count)
      `)
      .order('name', { ascending: true })
    
    if (error) {
      throw new Error(`Failed to fetch contractors: ${error.message}`)
    }

    // Transform the data to include worker_count
    const contractorsWithCount: ContractorWithWorkerCount[] = contractors?.map(contractor => ({
      id: contractor.id,
      name: contractor.name,
      abn: contractor.abn,
      contact_email: contractor.contact_email,
      contact_phone: contractor.contact_phone,
      address: contractor.address,
      active: contractor.active,
      created_at: contractor.created_at,
      updated_at: contractor.updated_at,
      worker_count: contractor.workers?.[0]?.count || 0
    })) || []

    return { success: true, data: contractorsWithCount }
    
  } catch (error) {
    console.error('Get contractors error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function createContractor(data: ContractorFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('contractors')
      .insert({
        name: data.name,
        abn: data.abn || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        address: data.address || null,
        active: data.active,
      })
    
    if (error) throw error
    
    revalidatePath('/admin/contractors')
    return { success: true }
    
  } catch (error) {
    console.error('Create contractor error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function updateContractor(id: string, data: ContractorFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('contractors')
      .update({
        name: data.name,
        abn: data.abn || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        address: data.address || null,
        active: data.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/contractors')
    return { success: true }
    
  } catch (error) {
    console.error('Update contractor error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteContractor(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    // Soft delete by setting active to false
    const { error } = await supabase
      .from('contractors')
      .update({
        active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    
    if (error) throw error
    
    revalidatePath('/admin/contractors')
    return { success: true }
    
  } catch (error) {
    console.error('Delete contractor error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}