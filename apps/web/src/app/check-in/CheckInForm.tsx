'use client'
import { useEffect, useRef, useState } from 'react'
import { checkIn } from './actions'
import { getCurrentLocation, formatCoordinates, type Coordinates } from '@/lib/geo'

type Status = 'idle' | 'locating' | 'submitting'

interface CheckInFormState {
  email: string
  coords: Coordinates | null
  csrfToken: string
  status: Status
  success: string
  errors: Record<string, string>
  locationError: string
}

export default function CheckInForm() {
  const [state, setState] = useState<CheckInFormState>({
    email: '',
    coords: null,
    csrfToken: '',
    status: 'idle',
    success: '',
    errors: {},
    locationError: ''
  })
  
  const errorRef = useRef<HTMLDivElement | null>(null)
  const locationButtonRef = useRef<HTMLButtonElement | null>(null)

  // Get CSRF token on component mount
  useEffect(() => {
    const token = document.cookie.split('; ').find((c) => c.startsWith('csrf_token='))?.split('=')[1] || ''
    setState(prev => ({ ...prev, csrfToken: token }))
  }, [])

  // Focus error summary when errors appear
  useEffect(() => { 
    if (Object.keys(state.errors).length && errorRef.current) {
      errorRef.current.focus()
      errorRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [state.errors])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      email: e.target.value,
      errors: {} // Clear errors when user starts typing
    }))
  }

  const handleGetLocation = async () => {
    setState(prev => ({ 
      ...prev, 
      status: 'locating', 
      locationError: '',
      errors: {} 
    }))

    try {
      const coords = await getCurrentLocation()
      setState(prev => ({ 
        ...prev, 
        coords, 
        status: 'idle',
        locationError: ''
      }))
    } catch (error) {
      console.error('Geolocation error:', error)
      setState(prev => ({ 
        ...prev, 
        status: 'idle',
        locationError: error instanceof Error ? error.message : 'Unable to get your location'
      }))
      
      // Focus back to the location button for accessibility
      if (locationButtonRef.current) {
        locationButtonRef.current.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Clear previous state
    setState(prev => ({ 
      ...prev, 
      errors: {}, 
      success: '', 
      status: 'submitting' 
    }))

    // Client-side validation
    const clientErrors: Record<string, string> = {}
    
    if (!state.email.trim()) {
      clientErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      clientErrors.email = 'Please enter a valid email address'
    }
    
    if (!state.coords) {
      clientErrors.location = 'Please share your location to check in'
    }

    if (Object.keys(clientErrors).length > 0) {
      setState(prev => ({ 
        ...prev, 
        errors: clientErrors, 
        status: 'idle' 
      }))
      return
    }

    try {
      const result = await checkIn({
        email: state.email.trim(),
        coords: state.coords!, // Non-null assertion: validated above
        csrfToken: state.csrfToken,
        website: '' // Honeypot field
      })

      if (result?.errors) {
        setState(prev => ({ 
          ...prev, 
          errors: result.errors || {}, 
          status: 'idle' 
        }))
      } else if (result?.success) {
        const successMessage = result.message || 'Successfully checked in! Stay safe on site.'
        setState(prev => ({ 
          ...prev, 
          success: successMessage,
          status: 'idle',
          email: '', // Clear form on success
          coords: null
        }))
        
        // Announce success to screen readers
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', 'polite')
        announcement.textContent = successMessage
        announcement.className = 'sr-only'
        document.body.appendChild(announcement)
        setTimeout(() => document.body.removeChild(announcement), 1000)
      }
    } catch (error) {
      console.error('Check-in error:', error)
      setState(prev => ({
        ...prev,
        errors: { form: 'An unexpected error occurred. Please try again.' },
        status: 'idle'
      }))
    }
  }

  const hasErrors = Object.keys(state.errors).length > 0
  const isSubmitting = state.status === 'submitting'
  const isLocating = state.status === 'locating'

  return (
    <div>
      {/* Success Message */}
      {state.success && (
        <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">{state.success}</p>
          </div>
        </div>
      )}

      {/* Error Summary */}
      {hasErrors && (
        <div 
          ref={errorRef}
          tabIndex={-1}
          className={`mb-6 rounded-lg border p-4 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            state.errors.form?.includes('Sorry, your white card is out of date')
              ? 'border-orange-300 bg-orange-50 focus:ring-orange-500'
              : 'border-red-300 bg-red-50 focus:ring-red-500'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex">
            {state.errors.form?.includes('Sorry, your white card is out of date') ? (
              <svg className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <div className="flex-1">
              {state.errors.form?.includes('Sorry, your white card is out of date') ? (
                <div>
                  <h3 className="text-orange-800 font-semibold text-lg">Site Entry Denied</h3>
                  <div className="mt-2 text-orange-700">
                    <p className="font-medium">{state.errors.form}</p>
                    <div className="mt-3 p-3 bg-orange-100 rounded border border-orange-200">
                      <p className="text-sm">
                        <strong>Next steps:</strong> Visit the worker registration page to upload your renewed white card certificate before attempting to check in again.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-red-800 font-medium">Please correct the following errors:</h3>
                  <ul className="mt-2 text-red-700 space-y-1">
                    {Object.entries(state.errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Check-in Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={state.email}
            onChange={handleEmailChange}
            required
            disabled={isSubmitting}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              state.errors.email 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-white hover:border-gray-400'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="Enter your registered email address"
            aria-describedby={state.errors.email ? 'email-error' : undefined}
          />
          {state.errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
              {state.errors.email}
            </p>
          )}
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-3">
            <button
              ref={locationButtonRef}
              type="button"
              onClick={handleGetLocation}
              disabled={isSubmitting || isLocating}
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              {isLocating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting location...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Share Location
                </>
              )}
            </button>
            
            {state.coords && (
              <div className="flex items-center text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                <svg className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>
                  Location obtained: {formatCoordinates(state.coords)}
                </span>
              </div>
            )}
            
            {state.locationError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                <div className="flex">
                  <svg className="mr-2 h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{state.locationError}</span>
                </div>
              </div>
            )}
          </div>
          
          {state.errors.location && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {state.errors.location}
            </p>
          )}
        </div>

        {/* Honeypot Field */}
        <input 
          type="text" 
          name="website" 
          tabIndex={-1} 
          autoComplete="off" 
          className="hidden" 
          aria-hidden="true"
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLocating}
          className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking in...
            </>
          ) : (
            'Check In'
          )}
        </button>
      </form>

      {/* Screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {state.success}
      </div>
    </div>
  )
}