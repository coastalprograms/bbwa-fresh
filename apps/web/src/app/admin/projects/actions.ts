'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { ProjectFormResult, PhotoCategory } from '@/types/projects'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function validateFile(file: File): string | null {
  if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload only JPEG, PNG, or WebP images'
  }
  
  if (file.size > MAX_SIZE) {
    return 'File size must be less than 10MB'
  }
  
  return null
}

function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
  
  return `${timestamp}_${safeName.substring(0, 50)}.${extension}`
}

async function uploadPhotos(
  supabase: any,
  projectId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const categories: PhotoCategory[] = ['inside', 'outside', 'kitchen', 'bathroom', 'other']
  
  try {
    for (const category of categories) {
      const files = formData.getAll(category) as File[]
      
      for (const file of files) {
        if (!file || !file.name || file.size === 0) continue
        
        const validation = validateFile(file)
        if (validation) {
          return { success: false, error: `${category}: ${validation}` }
        }
        
        const fileName = generateSafeFileName(file.name)
        const storagePath = `projects/${projectId}/${category}/${fileName}`
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('project-photos')
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false
          })
        
        if (uploadError) {
          console.error('Upload error:', uploadError)
          return { success: false, error: `Failed to upload ${file.name}` }
        }
        
        // Create database record
        const { error: dbError } = await supabase
          .from('project_photos')
          .insert({
            project_id: projectId,
            path: storagePath,
            category: category,
            alt_text: `${category} photo for project`
          })
        
        if (dbError) {
          console.error('Database error:', dbError)
          // Try to clean up uploaded file
          await supabase.storage.from('project-photos').remove([storagePath])
          return { success: false, error: `Failed to save ${file.name} metadata` }
        }
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Upload photos error:', error)
    return { success: false, error: 'Unexpected error uploading photos' }
  }
}

export async function createProjectAction(formData: FormData): Promise<ProjectFormResult> {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/login')
    }
    
    // Validate form data
    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const status = (formData.get('status') as string) || 'draft'
    
    if (!name) {
      return { errors: { name: 'Project name is required' } }
    }
    
    if (name.length > 255) {
      return { errors: { name: 'Project name must be less than 255 characters' } }
    }
    
    if (!['draft', 'published'].includes(status)) {
      return { errors: { form: 'Invalid status' } }
    }
    
    // Create project
    const { data: project, error: createError } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        status
      })
      .select('*')
      .single()
    
    if (createError) {
      console.error('Create project error:', createError)
      return { errors: { form: 'Failed to create project. Please try again.' } }
    }
    
    // Upload photos if any
    const photoResult = await uploadPhotos(supabase, project.id, formData)
    if (!photoResult.success) {
      // Project was created but photos failed - still consider it a success
      console.error('Photo upload failed:', photoResult.error)
    }
    
    // Revalidate pages
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    
    return { success: true, project }
  } catch (error) {
    console.error('Create project action error:', error)
    return { errors: { form: 'An unexpected error occurred. Please try again.' } }
  }
}

export async function updateProjectAction(formData: FormData): Promise<ProjectFormResult> {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/login')
    }
    
    // Get project ID
    const projectId = formData.get('projectId') as string
    if (!projectId) {
      return { errors: { form: 'Project ID is required' } }
    }
    
    // Validate form data
    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const status = (formData.get('status') as string) || 'draft'
    
    if (!name) {
      return { errors: { name: 'Project name is required' } }
    }
    
    if (name.length > 255) {
      return { errors: { name: 'Project name must be less than 255 characters' } }
    }
    
    if (!['draft', 'published'].includes(status)) {
      return { errors: { form: 'Invalid status' } }
    }
    
    // Update project
    const { data: project, error: updateError } = await supabase
      .from('projects')
      .update({
        name,
        description,
        status
      })
      .eq('id', projectId)
      .is('deleted_at', null)
      .select('*')
      .single()
    
    if (updateError) {
      console.error('Update project error:', updateError)
      return { errors: { form: 'Failed to update project. Please try again.' } }
    }
    
    // Upload new photos if any
    const photoResult = await uploadPhotos(supabase, projectId, formData)
    if (!photoResult.success) {
      console.error('Photo upload failed:', photoResult.error)
    }
    
    // Revalidate pages
    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/projects')
    
    return { success: true, project }
  } catch (error) {
    console.error('Update project action error:', error)
    return { errors: { form: 'An unexpected error occurred. Please try again.' } }
  }
}

export async function deleteProjectAction(formData: FormData) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/login')
    }
    
    const projectId = formData.get('projectId') as string
    if (!projectId) {
      throw new Error('Project ID is required')
    }
    
    // Soft delete the project
    const { error } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', projectId)
      .is('deleted_at', null)
    
    if (error) {
      console.error('Delete project error:', error)
      throw new Error('Failed to delete project')
    }
    
    // Revalidate pages
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    
  } catch (error) {
    console.error('Delete project action error:', error)
    // Let the error bubble up to show in the UI
    throw error
  }
  
  // Redirect back to projects list
  redirect('/admin/projects')
}