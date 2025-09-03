/**
 * Type definitions for project management system
 */

export type PhotoCategory = 'inside' | 'outside' | 'kitchen' | 'bathroom' | 'other'
export type ProjectStatus = 'draft' | 'published'

export interface Project {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectPhoto {
  id: string
  project_id: string
  path: string
  category: PhotoCategory
  alt_text: string | null
  sort_order: number
  created_at: string
}

export interface ProjectWithPhotos extends Project {
  photos: ProjectPhoto[]
}

export interface ProjectFormData {
  name: string
  description?: string
  status?: ProjectStatus
}

export interface PhotoUpload {
  category: PhotoCategory
  files: FileList
}

export interface ProjectFormErrors {
  name?: string
  description?: string
  form?: string
  [key: string]: string | undefined
}

export interface ProjectFormResult {
  success?: boolean
  errors?: ProjectFormErrors
  project?: Project
}

export const PHOTO_CATEGORIES: Array<{ value: PhotoCategory; label: string }> = [
  { value: 'inside', label: 'Inside' },
  { value: 'outside', label: 'Outside' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'other', label: 'Other' }
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const