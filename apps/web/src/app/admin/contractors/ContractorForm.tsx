'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Save, Building2 } from 'lucide-react'
import { Contractor } from '@/types/contractors'
import { createContractor, updateContractor } from './actions'

// ABN validation regex (Australian Business Number format: 11 digits with spaces optional)
const ABN_REGEX = /^[0-9]{2}\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/

const contractorSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255, 'Company name must be less than 255 characters'),
  abn: z.string().optional().refine(
    (val) => !val || ABN_REGEX.test(val.replace(/\s/g, '')),
    'ABN must be in the format: XX XXX XXX XXX (11 digits)'
  ),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  active: z.boolean(),
})

type ContractorFormData = z.infer<typeof contractorSchema>

interface ContractorFormProps {
  contractor?: Contractor
}

export default function ContractorForm({ contractor }: ContractorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!contractor

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      name: contractor?.name || '',
      abn: contractor?.abn || '',
      contact_email: contractor?.contact_email || '',
      contact_phone: contractor?.contact_phone || '',
      address: contractor?.address || '',
      active: contractor?.active ?? true,
    }
  })

  const watchActive = watch('active')

  const onSubmit = async (data: ContractorFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = isEditing 
        ? await updateContractor(contractor.id, data)
        : await createContractor(data)

      if (result.success) {
        router.push('/admin/contractors')
        router.refresh()
      } else {
        setSubmitError(result.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatABN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Limit to 11 digits
    const truncated = digits.slice(0, 11)
    
    // Format as XX XXX XXX XXX
    if (truncated.length <= 2) return truncated
    if (truncated.length <= 5) return `${truncated.slice(0, 2)} ${truncated.slice(2)}`
    if (truncated.length <= 8) return `${truncated.slice(0, 2)} ${truncated.slice(2, 5)} ${truncated.slice(5)}`
    return `${truncated.slice(0, 2)} ${truncated.slice(2, 5)} ${truncated.slice(5, 8)} ${truncated.slice(8)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/contractors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contractors
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            {isEditing ? 'Edit Contractor' : 'Add New Contractor'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. ABC Construction Pty Ltd"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* ABN */}
            <div className="space-y-2">
              <Label htmlFor="abn" className="text-sm font-medium">
                Australian Business Number (ABN)
              </Label>
              <Input
                id="abn"
                {...register('abn')}
                placeholder="XX XXX XXX XXX"
                onChange={(e) => {
                  const formatted = formatABN(e.target.value)
                  setValue('abn', formatted)
                }}
                className={errors.abn ? 'border-red-500' : ''}
              />
              {errors.abn && (
                <p className="text-sm text-red-600">{errors.abn.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Enter 11 digits. Format: XX XXX XXX XXX
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-sm font-medium">
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  {...register('contact_email')}
                  placeholder="contact@company.com.au"
                  className={errors.contact_email ? 'border-red-500' : ''}
                />
                {errors.contact_email && (
                  <p className="text-sm text-red-600">{errors.contact_email.message}</p>
                )}
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="text-sm font-medium">
                  Contact Phone
                </Label>
                <Input
                  id="contact_phone"
                  {...register('contact_phone')}
                  placeholder="(02) 9XXX XXXX or 04XX XXX XXX"
                  className={errors.contact_phone ? 'border-red-500' : ''}
                />
                {errors.contact_phone && (
                  <p className="text-sm text-red-600">{errors.contact_phone.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Business Address
              </Label>
              <Textarea
                id="address"
                {...register('address')}
                placeholder="Street address, city, state, postcode"
                rows={3}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-xs text-gray-500">
                  {watchActive 
                    ? 'This contractor can be assigned to new projects and workers'
                    : 'This contractor is inactive and cannot be assigned to new projects'
                  }
                </p>
              </div>
              <Switch
                checked={watchActive}
                onCheckedChange={(checked) => setValue('active', checked)}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/contractors">
                  Cancel
                </Link>
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Contractor' : 'Create Contractor'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}