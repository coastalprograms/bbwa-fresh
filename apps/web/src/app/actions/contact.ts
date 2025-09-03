'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const ContactFormSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  service_interest: z.string().optional(),
  source_page: z.string().optional(),
  honeypot: z.string().optional(), // Anti-spam
})

type ContactFormData = z.infer<typeof ContactFormSchema>

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 3

  const requests = rateLimitMap.get(ip) || []
  const recentRequests = requests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return true
  }

  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  
  return false
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Check honeypot (anti-spam)
    if (formData.honeypot) {
      return { success: false, error: 'Invalid submission' }
    }

    // Validate input
    const validatedData = ContactFormSchema.parse(formData)

    // Get IP for rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown'

    // Check rate limit
    if (isRateLimited(ip)) {
      return { 
        success: false, 
        error: 'Too many requests. Please wait a minute before trying again.' 
      }
    }

    // Submit to Supabase
    const supabase = await createClient()
    const { error } = await supabase
      .from('contact_leads')
      .insert({
        name: `${validatedData.first_name} ${validatedData.last_name}`, // Combine first and last name
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
        service_interest: validatedData.service_interest || null,
        source_page: validatedData.source_page || null,
        ip_address: ip !== 'unknown' ? ip : null,
      })

    if (error) {
      console.error('Supabase error:', error)
      return { 
        success: false, 
        error: 'Failed to submit form. Please try again.' 
      }
    }

    return { 
      success: true, 
      message: 'Thank you for your message! We&apos;ll get back to you within 24 hours.' 
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0].message
      }
    }
    
    console.error('Contact form error:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    }
  }
}
