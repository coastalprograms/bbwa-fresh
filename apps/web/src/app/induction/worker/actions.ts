'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ContractorOption } from '@/types/contractors'

export async function getActiveContractors(): Promise<{ success: boolean; contractors?: ContractorOption[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data: contractors, error } = await supabase
      .from('contractors')
      .select('id, name, abn')
      .eq('active', true)
      .order('name')
    
    if (error) throw error
    
    const contractorOptions: ContractorOption[] = contractors.map(contractor => ({
      value: contractor.id,
      label: contractor.name,
      abn: contractor.abn
    }))
    
    return { success: true, contractors: contractorOptions }
    
  } catch (error) {
    console.error('Get contractors error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function submitWorkerInduction(formData: {
  firstName: string
  lastName: string
  email: string
  mobile: string
  contractorId: string
  position: string
  trade: string
  allergies?: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
  // Safety requirements
  noAlcoholDrugs: boolean
  electricalEquipment: boolean
  hazardousSubstances: boolean
  usePPE: boolean
  highRiskWorkMeeting: boolean
  appropriateSignage: boolean
  noUnauthorizedVisitors: boolean
  housekeeping: boolean
  employerTraining: boolean
  employerSWMS: boolean
  discussedSWMS: boolean
  preStartMeeting: boolean
  readSafetyBooklet: boolean
  understandSMP: boolean
  // License info
  otherLicense?: boolean
  otherLicenseDetails?: string
}): Promise<{ success: boolean; workerId?: string; error?: string }> {
  try {
    const supabase = createClient()
    
    // Insert worker record
    const { data: worker, error } = await supabase
      .from('workers')
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        contractor_id: formData.contractorId,
        trade: formData.trade,
        position: formData.position,
        allergies: formData.allergies || null,
        emergency_name: formData.emergencyName,
        emergency_phone: formData.emergencyPhone,
        emergency_relationship: formData.emergencyRelationship,
        white_card: true, // Mandatory requirement
        other_license: formData.otherLicense || false,
        other_license_details: formData.otherLicenseDetails || null,
        // Safety acknowledgments
        no_alcohol_drugs: formData.noAlcoholDrugs,
        electrical_equipment_responsibility: formData.electricalEquipment,
        hazardous_substances_understanding: formData.hazardousSubstances,
        use_ppe_when_necessary: formData.usePPE,
        high_risk_work_meeting_understanding: formData.highRiskWorkMeeting,
        appropriate_signage_display: formData.appropriateSignage,
        no_unauthorized_visitors_understanding: formData.noUnauthorizedVisitors,
        housekeeping_responsibility: formData.housekeeping,
        employer_provided_training: formData.employerTraining,
        employer_provided_swms: formData.employerSWMS,
        discussed_swms_with_employer: formData.discussedSWMS,
        pre_start_meeting_understanding: formData.preStartMeeting,
        read_safety_booklet: formData.readSafetyBooklet,
        understand_site_management_plan: formData.understandSMP,
        induction_completed: true,
        induction_completed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/admin/workers')
    return { success: true, workerId: worker.id }
    
  } catch (error) {
    console.error('Submit worker induction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}