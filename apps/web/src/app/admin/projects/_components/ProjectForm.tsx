'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProjectAction, updateProjectAction } from '../actions'
import type { ProjectWithPhotos, ProjectFormErrors } from '@/types/projects'
import { PHOTO_CATEGORIES } from '@/types/projects'

interface ProjectFormProps {
  mode: 'create' | 'edit'
  initialProject?: ProjectWithPhotos
}

export function ProjectForm({ mode, initialProject }: ProjectFormProps) {
  const router = useRouter()
  const [errors, setErrors] = useState<ProjectFormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [success, setSuccess] = useState('')
  const [aiStatus, setAiStatus] = useState<'idle' | 'generating' | 'error'>('idle')
  const [aiError, setAiError] = useState('')
  const errorRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const builderNotesRef = useRef<HTMLTextAreaElement | null>(null)

  // Focus error summary when errors appear
  const focusErrorSummary = () => {
    if (Object.keys(errors).length > 0 && errorRef.current) {
      errorRef.current.focus()
      errorRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setStatus('submitting')

    try {
      const formData = new FormData(e.currentTarget)
      
      // Add project ID for edit mode
      if (mode === 'edit' && initialProject) {
        formData.set('projectId', initialProject.id)
      }

      const result = mode === 'create' 
        ? await createProjectAction(formData)
        : await updateProjectAction(formData)

      setStatus('idle')

      if (result.errors) {
        setErrors(result.errors)
        setTimeout(focusErrorSummary, 100)
        return
      }

      if (result.success) {
        setSuccess(mode === 'create' ? 'Project created successfully!' : 'Project updated successfully!')
        
        // Reset form for create mode
        if (mode === 'create' && formRef.current) {
          formRef.current.reset()
        }

        // Redirect to projects list after a short delay
        setTimeout(() => {
          router.push('/admin/projects')
        }, 1500)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('idle')
      setErrors({ form: 'An unexpected error occurred. Please try again.' })
      setTimeout(focusErrorSummary, 100)
    }
  }

  const handleFileChange = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any previous errors for this category when files are selected
    if (errors[category]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[category]
        return newErrors
      })
    }
  }

  const handleAIGenerate = async () => {
    if (!builderNotesRef.current || !descriptionRef.current) return

    const builderNotes = builderNotesRef.current.value.trim()
    if (!builderNotes) {
      setAiError('Please add some builder notes first')
      return
    }

    try {
      setAiStatus('generating')
      setAiError('')
      
      // Get any existing image URLs (for edit mode)
      const imageUrls = initialProject?.photos?.map(photo => photo.path) || []
      
      const response = await fetch('/admin/projects/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builderNotes, imageUrls })
      })

      const data = await response.json()
      
      if (!response.ok || data.error) {
        setAiStatus('error')
        setAiError(data.error || 'Unable to generate description at this time. Please try again.')
        return
      }

      if (data.text) {
        descriptionRef.current.value = data.text
        descriptionRef.current.focus()
        setAiStatus('idle')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      setAiStatus('error')
      setAiError('Network error. Please check your connection and try again.')
    }
  }

  const isSubmitting = status === 'submitting'
  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Summary */}
      {hasErrors && (
        <div 
          ref={errorRef}
          tabIndex={-1}
          className="rounded-lg border border-red-300 bg-red-50 p-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          role="alert"
        >
          <div className="flex">
            <svg className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-red-800 font-medium">Please correct the following errors:</h3>
              <ul className="mt-2 text-red-700 space-y-1 list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
          </div>

          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              defaultValue={initialProject?.name || ''}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="e.g. Modern Kitchen Renovation"
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Builder's Notes */}
          <div>
            <label htmlFor="builderNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Builder&apos;s Notes
            </label>
            <textarea
              ref={builderNotesRef}
              id="builderNotes"
              name="builderNotes"
              rows={3}
              disabled={isSubmitting || aiStatus === 'generating'}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical bg-white hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Quick notes about the job... e.g. 'finished kitchen reno yesterday, new stone benchtops, custom cabinetry, stainless appliances, happy clients'"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Jot down rough notes - AI will turn them into professional copy
              </p>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isSubmitting || aiStatus === 'generating'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                aria-disabled={isSubmitting || aiStatus === 'generating'}
              >
                {aiStatus === 'generating' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Professional Description'
                )}
              </button>
            </div>
            {aiError && (
              <div className="mt-2 p-3 rounded-lg border border-red-300 bg-red-50" role="alert">
                <p className="text-red-700 text-sm">{aiError}</p>
              </div>
            )}
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Project Description
            </label>
            <textarea
              ref={descriptionRef}
              id="description"
              name="description"
              rows={6}
              disabled={isSubmitting}
              defaultValue={initialProject?.description || ''}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
                errors.description 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Professional project description will appear here. You can edit it after AI generation."
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Use the AI generator above or write your own professional description
            </p>
          </div>

          {/* Project Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              disabled={isSubmitting}
              defaultValue={initialProject?.status || 'draft'}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Published projects will be visible on the public website
            </p>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Photos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload photos organised by category. Each photo should be under 10MB and in JPEG, PNG, or WebP format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHOTO_CATEGORIES.map((category) => (
              <div key={category.value} className="space-y-2">
                <label 
                  htmlFor={category.value} 
                  className="block text-sm font-medium text-gray-700"
                >
                  {category.label}
                </label>
                <input
                  id={category.value}
                  name={category.value}
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={(e) => handleFileChange(category.value, e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors[category.value] && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors[category.value]}
                  </p>
                )}
                
                {/* Show existing photos for edit mode */}
                {mode === 'edit' && initialProject?.photos && (
                  <div className="mt-2">
                    {initialProject.photos
                      .filter(photo => photo.category === category.value)
                      .map(photo => (
                        <div key={photo.id} className="text-xs text-gray-500 truncate">
                          📷 {photo.path.split('/').pop()}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              mode === 'create' ? 'Create Project' : 'Update Project'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}