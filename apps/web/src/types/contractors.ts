import { Database } from './supabase.generated'

// Base contractor types from generated schema (will be available after migration)
export type Contractor = {
  id: string
  name: string
  abn: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type ContractorInsert = {
  id?: string
  name: string
  abn?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  address?: string | null
  active?: boolean
  created_at?: string
  updated_at?: string
}

export type ContractorUpdate = {
  id?: string
  name?: string
  abn?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  address?: string | null
  active?: boolean
  created_at?: string
  updated_at?: string
}

// Enhanced contractor types for UI
export interface ContractorWithWorkerCount extends Contractor {
  worker_count: number
}

export interface ContractorFormData {
  name: string
  abn?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  active: boolean
}

// Contractor dropdown option for forms
export interface ContractorOption {
  value: string
  label: string
  abn?: string | null
}

// Form validation schema types
export interface ContractorValidationErrors {
  name?: string
  abn?: string
  contact_email?: string
  contact_phone?: string
  address?: string
}