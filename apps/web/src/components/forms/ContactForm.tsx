'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { submitContactForm } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const services = [
  'New Home Construction',
  'Renovations & Extensions',
  'Commercial Projects',
  'Heritage Restoration',
  'Maintenance & Repairs',
  'Project Management',
  'Consulting Services',
]

export function ContactForm() {
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    service_interest: '',
    honeypot: '', // Hidden field for spam protection
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const response = await submitContactForm({
      ...formData,
      source_page: pathname,
    })

    setResult(response)
    setIsSubmitting(false)

    if (response.success) {
      // Reset form on success
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        service_interest: '',
        honeypot: '',
      })

      // Clear success message after 5 seconds
      setTimeout(() => setResult(null), 5000)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => handleChange('honeypot', e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            required
            minLength={2}
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            disabled={isSubmitting}
            placeholder="John"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            required
            minLength={2}
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            disabled={isSubmitting}
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isSubmitting}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={isSubmitting}
            placeholder="0400 000 000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service Interest</Label>
          <Select
            value={formData.service_interest}
            onValueChange={(value) => handleChange('service_interest', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          disabled={isSubmitting}
          placeholder="Tell us about your project..."
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Minimum 20 characters
        </p>
      </div>

      {result && (
        <Alert variant={result.success ? 'default' : 'destructive'}>
          {result.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {result.success ? result.message : result.error}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        * Required fields. We&apos;ll respond within 24 hours.
      </p>
    </form>
  )
}
