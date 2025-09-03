'use server'

import { createClient } from '@/lib/supabase/server'
import { validateSwmsToken } from '../[token]/actions'

interface UploadResult {
  success: boolean
  data?: {
    submissionId: string
    fileUrl: string
  }
  error?: string
}

/**
 * Upload SWMS document to Supabase Storage and create submission record
 */
export async function uploadSwmsDocument(formData: FormData): Promise<UploadResult> {
  try {
    // Extract form data
    const file = formData.get('file') as File
    const swmsJobId = formData.get('swmsJobId') as string
    const contractorId = formData.get('contractorId') as string
    const token = formData.get('token') as string

    // Validate inputs
    if (!file || !swmsJobId || !contractorId || !token) {
      return { success: false, error: 'Missing required fields' }
    }

    // Validate token is still valid
    const tokenValidation = await validateSwmsToken(token)
    if (!tokenValidation.success) {
      return { success: false, error: 'Invalid or expired token' }
    }

    // Validate file size and type
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]

    if (file.size > maxSize) {
      return { success: false, error: 'File size exceeds 10MB limit' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'File type not supported' }
    }

    const supabase = createClient()

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    
    // Storage path: /swms-documents/job-sites/{job_id}/submissions/{contractor_id}/
    const { swmsJob } = tokenValidation.data
    const storagePath = `swms-documents/job-sites/${swmsJob.job_site_id}/submissions/${contractorId}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return { success: false, error: 'Failed to upload file' }
    }

    // Get signed URL for the uploaded file
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 86400) // 24 hour expiry

    if (!signedUrlData?.signedUrl) {
      return { success: false, error: 'Failed to generate file access URL' }
    }

    // Create submission record in database
    const { data: submission, error: dbError } = await supabase
      .from('swms_submissions')
      .insert({
        swms_job_id: swmsJobId,
        contractor_id: contractorId,
        document_name: file.name,
        file_url: storagePath,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (dbError || !submission) {
      console.error('Database insert error:', dbError)
      
      // Clean up uploaded file on database error
      await supabase.storage
        .from('documents')
        .remove([storagePath])

      return { success: false, error: 'Failed to create submission record' }
    }

    // Create audit log entry
    await supabase
      .from('swms_audit_log')
      .insert({
        swms_job_id: swmsJobId,
        contractor_id: contractorId,
        action: 'document_submitted',
        details: {
          submission_id: submission.id,
          document_name: file.name,
          file_size: file.size,
          file_type: file.type
        },
        occurred_at: new Date().toISOString()
      })

    // Trigger file validation (security scanning)
    try {
      await supabase.functions.invoke('swms-file-validator', {
        body: {
          file_url: storagePath,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          submission_id: submission.id,
          contractor_id: contractorId
        }
      })
    } catch (validationError) {
      console.error('File validation failed (non-blocking):', validationError)
      // Don't fail the upload if validation fails, but log it
    }

    // Trigger email confirmation
    try {
      const { swmsJob, jobSite, contractor } = tokenValidation.data
      const confirmationNumber = `SWMS-${swmsJobId.slice(0, 8).toUpperCase()}-${submission.id.slice(0, 8).toUpperCase()}`
      
      await supabase.functions.invoke('swms-email-confirmation', {
        body: {
          submission_id: submission.id,
          contractor_email: contractor.contact_email,
          contractor_name: contractor.company_name,
          job_site_name: jobSite.name,
          swms_job_name: swmsJob.name,
          document_name: file.name,
          confirmation_number: confirmationNumber,
          submitted_at: new Date().toISOString()
        }
      })
    } catch (emailError) {
      console.error('Email confirmation failed (non-blocking):', emailError)
      // Don't fail the upload if email fails
    }

    return {
      success: true,
      data: {
        submissionId: submission.id,
        fileUrl: signedUrlData.signedUrl
      }
    }

  } catch (error) {
    console.error('Unexpected error uploading document:', error)
    return { success: false, error: 'An unexpected error occurred during upload' }
  }
}

/**
 * Get signed URL for viewing an uploaded document
 */
export async function getDocumentUrl(filePath: string, token: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate token
    const tokenValidation = await validateSwmsToken(token)
    if (!tokenValidation.success) {
      return { success: false, error: 'Invalid or expired token' }
    }

    const supabase = createClient()

    // Create signed URL with 1 hour expiry
    const { data: signedUrlData, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600)

    if (error || !signedUrlData?.signedUrl) {
      return { success: false, error: 'Failed to generate document URL' }
    }

    return { success: true, url: signedUrlData.signedUrl }

  } catch (error) {
    console.error('Error generating document URL:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}