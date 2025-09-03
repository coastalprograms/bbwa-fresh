'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Loader2, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JobSite, SwmsJob, SwmsJobCreateData } from '@/types/swms'

const swmsJobSchema = z.object({
  name: z.string().min(1, 'SWMS job name is required').max(200, 'Name must be under 200 characters'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
}).refine((data) => {
  if (data.end_date && data.start_date) {
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    return endDate >= startDate
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['end_date']
})

type SwmsJobFormData = z.infer<typeof swmsJobSchema>

interface SwmsJobFormProps {
  jobSite: JobSite
  swmsJob?: SwmsJob
  onCancel: () => void
  className?: string
}

export function SwmsJobForm({ jobSite, swmsJob, onCancel, className }: SwmsJobFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SwmsJobFormData>({
    resolver: zodResolver(swmsJobSchema),
    defaultValues: {
      name: swmsJob?.name || `${jobSite.name} - SWMS`,
      description: swmsJob?.description || '',
      start_date: swmsJob?.start_date || new Date().toISOString().split('T')[0],
      end_date: swmsJob?.end_date || '',
      status: swmsJob?.status || 'planned',
    },
  })

  async function onSubmit(data: SwmsJobFormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description || '')
      formData.append('start_date', data.start_date)
      if (data.end_date) {
        formData.append('end_date', data.end_date)
      }
      formData.append('status', data.status)

      const endpoint = swmsJob 
        ? `/admin/job-sites/${jobSite.id}/swms/${swmsJob.id}`
        : `/admin/job-sites/${jobSite.id}/swms`
      
      const method = swmsJob ? 'PUT' : 'POST'

      const response = await fetch(`/api${endpoint}`, {
        method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save SWMS job')
      }

      // Redirect back to job site detail page
      router.push(`/admin/job-sites/${jobSite.id}?tab=swms`)
      router.refresh()
    } catch (error) {
      console.error('Error saving SWMS job:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {swmsJob ? 'Edit SWMS Job' : 'Create SWMS Job'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {swmsJob 
            ? 'Update the SWMS job details below' 
            : `Create a new SWMS job for ${jobSite.name}. Location and site details will be inherited automatically.`
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Inherited Site Information Display */}
          <div className="grid gap-4 md:grid-cols-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-blue-900">Job Site</Label>
              <p className="text-sm text-blue-800 font-semibold">{jobSite.name}</p>
            </div>
            {jobSite.address && (
              <div>
                <Label className="text-sm font-medium text-blue-900">Address</Label>
                <p className="text-sm text-blue-800">{jobSite.address}</p>
              </div>
            )}
            {jobSite.lat && jobSite.lng && (
              <div>
                <Label className="text-sm font-medium text-blue-900">Coordinates</Label>
                <p className="text-sm text-blue-800">
                  {jobSite.lat.toFixed(6)}, {jobSite.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* SWMS Job Name */}
          <div>
            <Label htmlFor="name">SWMS Job Name *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="e.g., Structural Steel Installation, Concrete Pour"
              className={cn(form.formState.errors.name && 'border-red-500')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the work activities and scope covered by this SWMS"
              rows={3}
              className={cn(form.formState.errors.description && 'border-red-500')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                {...form.register('start_date')}
                className={cn(form.formState.errors.start_date && 'border-red-500')}
              />
              {form.formState.errors.start_date && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.start_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                {...form.register('end_date')}
                className={cn(form.formState.errors.end_date && 'border-red-500')}
              />
              {form.formState.errors.end_date && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value: 'planned' | 'active' | 'completed' | 'cancelled') => 
                form.setValue('status', value)
              }
            >
              <SelectTrigger className={cn(form.formState.errors.status && 'border-red-500')}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.status.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {swmsJob ? 'Update SWMS Job' : 'Create SWMS Job'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/job-sites/${jobSite.id}?tab=swms`)}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}