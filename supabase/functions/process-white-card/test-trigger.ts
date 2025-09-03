/**
 * Test script to manually trigger white card processing
 * This simulates what the database trigger would do
 */

import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function triggerProcessing(certificationId: string) {
  try {
    // Get certification details
    const { data: cert, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', certificationId)
      .single()
    
    if (error || !cert) {
      console.error('Failed to find certification:', error)
      return
    }
    
    if (!cert.white_card_path) {
      console.error('Certification has no white_card_path')
      return
    }
    
    console.log('Triggering processing for:', cert)
    
    // Call the Edge Function
    const { data, error: funcError } = await supabase.functions.invoke('process-white-card', {
      body: {
        certification_id: cert.id,
        worker_id: cert.worker_id,
        white_card_path: cert.white_card_path
      }
    })
    
    if (funcError) {
      console.error('Function error:', funcError)
      return
    }
    
    console.log('Function response:', data)
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Example usage - replace with actual certification ID
// triggerProcessing('your-certification-id-here')

export { triggerProcessing }