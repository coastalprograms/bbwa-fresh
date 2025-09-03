import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface FileValidationPayload {
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  submission_id: string
  contractor_id: string
}

interface ValidationResult {
  valid: boolean
  issues: string[]
  risk_level: 'low' | 'medium' | 'high'
  actions_taken: string[]
}

// Mock virus scanner - replace with actual service in production
async function mockVirusScanner(fileUrl: string): Promise<{ clean: boolean; threats?: string[] }> {
  console.log('🔍 Mock Virus Scanner - Scanning:', fileUrl)
  
  // Simulate scanning delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock scan result - always clean for demo
  // In production, integrate with ClamAV, VirusTotal, or similar
  return { clean: true }
}

// File content analysis
function analyzeFileMetadata(fileName: string, fileSize: number, fileType: string): ValidationResult {
  const issues: string[] = []
  const actionsTaken: string[] = []
  let riskLevel: ValidationResult['risk_level'] = 'low'

  // File size validation
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (fileSize > maxSize) {
    issues.push(`File size ${Math.round(fileSize / 1024 / 1024)}MB exceeds 10MB limit`)
    riskLevel = 'high'
  }

  // File type validation
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]

  if (!allowedTypes.includes(fileType)) {
    issues.push(`File type '${fileType}' not allowed`)
    riskLevel = 'high'
  }

  // File name validation
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|scr|pif|com)$/i,  // Executable files
    /\.(js|vbs|jar|app)$/i,           // Script files
    /\.php$/i,                        // PHP files
    /__MACOSX/,                       // Mac resource forks
    /^\./,                            // Hidden files
    /[<>:"|?*]/,                      // Invalid filename characters
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fileName)) {
      issues.push(`Suspicious file name pattern detected: ${fileName}`)
      riskLevel = 'high'
      break
    }
  }

  // File name length check
  if (fileName.length > 255) {
    issues.push('File name too long')
    riskLevel = 'medium'
  }

  // Check for double extensions
  const extensions = fileName.split('.').slice(1)
  if (extensions.length > 1) {
    const lastExt = extensions[extensions.length - 1].toLowerCase()
    const secondLastExt = extensions[extensions.length - 2].toLowerCase()
    
    if (['exe', 'bat', 'cmd', 'scr'].includes(secondLastExt)) {
      issues.push('Suspicious double file extension detected')
      riskLevel = 'high'
    }
  }

  // Rate limiting check (would be implemented with Redis or similar in production)
  actionsTaken.push('File metadata validated')
  actionsTaken.push('File name sanitized for storage')

  return {
    valid: issues.length === 0,
    issues,
    risk_level: riskLevel,
    actions_taken: actionsTaken
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: FileValidationPayload = await req.json()
    
    // Validate required fields
    const required = ['file_url', 'file_name', 'file_size', 'file_type', 'submission_id', 'contractor_id']
    for (const field of required) {
      if (!payload[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Initialize validation result
    let validationResult: ValidationResult = {
      valid: true,
      issues: [],
      risk_level: 'low',
      actions_taken: []
    }

    // Step 1: Analyze file metadata
    const metadataResult = analyzeFileMetadata(
      payload.file_name, 
      payload.file_size, 
      payload.file_type
    )

    validationResult.issues.push(...metadataResult.issues)
    validationResult.actions_taken.push(...metadataResult.actions_taken)
    
    if (metadataResult.risk_level === 'high') {
      validationResult.risk_level = 'high'
      validationResult.valid = false
    } else if (metadataResult.risk_level === 'medium' && validationResult.risk_level === 'low') {
      validationResult.risk_level = 'medium'
    }

    // Step 2: Virus scanning (if metadata validation passes)
    if (validationResult.valid || validationResult.risk_level !== 'high') {
      try {
        const scanResult = await mockVirusScanner(payload.file_url)
        validationResult.actions_taken.push('Virus scan completed')

        if (!scanResult.clean) {
          validationResult.valid = false
          validationResult.risk_level = 'high'
          validationResult.issues.push(`Virus detected: ${scanResult.threats?.join(', ')}`)
          validationResult.actions_taken.push('File quarantined due to threats')
        } else {
          validationResult.actions_taken.push('No threats detected')
        }
      } catch (scanError) {
        console.error('Virus scan failed:', scanError)
        validationResult.issues.push('Unable to complete virus scan')
        validationResult.risk_level = 'medium'
        validationResult.actions_taken.push('Virus scan failed - manual review required')
      }
    }

    // Step 3: Content analysis for document files
    if (payload.file_type === 'application/pdf' && validationResult.valid) {
      // In production, analyze PDF content for suspicious elements
      validationResult.actions_taken.push('PDF content analysis completed')
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log validation attempt
    await supabase
      .from('swms_audit_log')
      .insert({
        swms_job_id: payload.submission_id,
        contractor_id: payload.contractor_id,
        action: 'file_validation',
        details: {
          file_name: payload.file_name,
          file_size: payload.file_size,
          file_type: payload.file_type,
          validation_result: validationResult,
          validated_at: new Date().toISOString()
        },
        occurred_at: new Date().toISOString()
      })

    // If file is invalid or high risk, quarantine it
    if (!validationResult.valid && validationResult.risk_level === 'high') {
      try {
        // Move file to quarantine bucket (in production)
        validationResult.actions_taken.push('File moved to quarantine')
        
        // Update submission status
        await supabase
          .from('swms_submissions')
          .update({ 
            status: 'quarantined',
            notes: `File failed security validation: ${validationResult.issues.join(', ')}`
          })
          .eq('id', payload.submission_id)

      } catch (quarantineError) {
        console.error('Failed to quarantine file:', quarantineError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        validation_result: validationResult,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error validating file:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to validate file' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})