import { Contractor } from './contractors'

export interface Worker {
  id: string
  first_name: string
  last_name?: string
  email: string
  company?: string // Legacy field - will be removed after migration
  contractor_id: string
  trade?: string
  phone?: string
  created_at: string
}

// Worker with contractor relationship populated
export interface WorkerWithContractor extends Worker {
  contractor: Contractor
}

export interface Certification {
  id: string
  worker_id: string
  type: string
  number?: string
  status?: 'Valid' | 'Expired' | 'Awaiting Review'
  expiry_date?: string
  file_url?: string
  white_card_path?: string
  card_number?: string
  name_on_card?: string
  processed_at?: string
  processing_error?: string
  created_at: string
}

export interface WorkerCertSummary {
  worker_id: string
  first_name: string
  last_name?: string
  email: string
  company?: string // Legacy field - will be removed after migration
  contractor_id: string
  contractor_name?: string
  trade?: string
  status: 'Valid' | 'Expired' | 'Awaiting Review'
  expiry_date?: string
  last_updated?: string
}

export interface UpdateCertificationRequest {
  workerId: string
  status: 'Valid' | 'Expired' | 'Awaiting Review'
  expiryDate?: string
}

export interface UpdateCertificationResponse {
  success?: boolean
  errors?: Record<string, string>
}