'use client'

import { useRef, useState, useEffect } from 'react'
import { updateCertification } from './actions'

interface UpdateComplianceFormProps {
  initial: {
    workerId: string
    status?: string
    expiryDate?: string
  }
}

export function UpdateComplianceForm({ initial }: UpdateComplianceFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'saving'>('idle')
  const [successMessage, setSuccessMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Focus on first error when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorRef.current) {
      errorRef.current.focus()
    }
  }, [errors])

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    setStatus('saving')

    const formData = new FormData(e.currentTarget)
    const result = await updateCertification(formData)
    
    setStatus('idle')

    if (result?.errors) {
      setErrors(result.errors)
    } else if (result?.success) {
      setSuccessMessage('Certification updated successfully')
      // Optionally reset form or keep current values
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Certification Status</h2>
      
      {hasErrors && (
        <div 
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mb-4 rounded-md border border-red-300 bg-red-50 p-3"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please correct the highlighted fields below
              </h3>
              <ul className="mt-2 text-sm text-red-700">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="mb-4 rounded-md border border-green-300 bg-green-50 p-3"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.77a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" name="workerId" value={initial.workerId} />
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            White Card Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial.status || 'Awaiting Review'}
            className={`w-full rounded-md border ${
              errors.status ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            aria-describedby={errors.status ? 'status-error' : undefined}
          >
            <option value="Awaiting Review">Awaiting Review</option>
            <option value="Valid">Valid</option>
            <option value="Expired">Expired</option>
          </select>
          {errors.status && (
            <p id="status-error" className="mt-1 text-sm text-red-600">
              {errors.status}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            defaultValue={initial.expiryDate || ''}
            className={`w-full rounded-md border ${
              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            aria-describedby={errors.expiryDate ? 'expiry-error' : undefined}
          />
          {errors.expiryDate && (
            <p id="expiry-error" className="mt-1 text-sm text-red-600">
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {status === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}