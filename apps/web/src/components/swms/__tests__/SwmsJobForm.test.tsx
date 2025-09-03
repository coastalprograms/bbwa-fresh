import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SwmsJobForm } from '../SwmsJobForm'
import type { JobSite, SwmsJob } from '@/types/swms'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock fetch
global.fetch = jest.fn()

const mockJobSite: JobSite = {
  id: 'job-site-1',
  name: 'Test Construction Site',
  address: '123 Test Street, Perth WA 6000',
  lat: -31.9505,
  lng: 115.8605,
  status: 'active',
  created_at: '2025-01-01T00:00:00Z'
}

const mockSwmsJob: SwmsJob = {
  id: 'swms-job-1',
  job_site_id: 'job-site-1',
  name: 'Structural Steel Installation',
  description: 'Installation of structural steel framework',
  start_date: '2025-01-15',
  end_date: '2025-01-30',
  status: 'active',
  created_at: '2025-01-01T00:00:00Z'
}

describe('SwmsJobForm', () => {
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  })

  describe('Form Rendering', () => {
    it('renders create form correctly', () => {
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.getByText('Create SWMS Job')).toBeInTheDocument()
      expect(screen.getByText(/Create a new SWMS job for Test Construction Site/)).toBeInTheDocument()
      expect(screen.getByLabelText('SWMS Job Name *')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Start Date *')).toBeInTheDocument()
      expect(screen.getByLabelText('End Date (Optional)')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Create SWMS Job/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument()
    })

    it('renders edit form correctly with existing SWMS job', () => {
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          swmsJob={mockSwmsJob}
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.getByText('Edit SWMS Job')).toBeInTheDocument()
      expect(screen.getByText('Update the SWMS job details below')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Update SWMS Job/ })).toBeInTheDocument()
    })

    it('displays inherited job site information', () => {
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.getByText('Test Construction Site')).toBeInTheDocument()
      expect(screen.getByText('123 Test Street, Perth WA 6000')).toBeInTheDocument()
      expect(screen.getByText('-31.950500, 115.860500')).toBeInTheDocument()
    })

    it('pre-fills form with existing SWMS job data', () => {
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          swmsJob={mockSwmsJob}
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.getByDisplayValue('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Installation of structural steel framework')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2025-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2025-01-30')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      // Clear the pre-filled name field
      const nameInput = screen.getByLabelText('SWMS Job Name *')
      await user.clear(nameInput)

      // Clear the pre-filled start date field
      const startDateInput = screen.getByLabelText('Start Date *')
      await user.clear(startDateInput)

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('SWMS job name is required')).toBeInTheDocument()
        expect(screen.getByText('Start date is required')).toBeInTheDocument()
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('validates name length limits', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const nameInput = screen.getByLabelText('SWMS Job Name *')
      
      // Test max length validation (over 200 characters)
      const longName = 'A'.repeat(201)
      await user.clear(nameInput)
      await user.type(nameInput, longName)

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Name must be under 200 characters')).toBeInTheDocument()
      })
    })

    it('validates end date is after start date', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const startDateInput = screen.getByLabelText('Start Date *')
      const endDateInput = screen.getByLabelText('End Date (Optional)')

      await user.clear(startDateInput)
      await user.type(startDateInput, '2025-01-30')

      await user.clear(endDateInput)
      await user.type(endDateInput, '2025-01-15')

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('End date must be after start date')).toBeInTheDocument()
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('Form Submission', () => {
    it('submits create form with correct data', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const nameInput = screen.getByLabelText('SWMS Job Name *')
      const descriptionInput = screen.getByLabelText('Description')
      const startDateInput = screen.getByLabelText('Start Date *')
      const endDateInput = screen.getByLabelText('End Date (Optional)')

      await user.clear(nameInput)
      await user.type(nameInput, 'Test SWMS Job')
      await user.type(descriptionInput, 'Test description')
      await user.clear(startDateInput)
      await user.type(startDateInput, '2025-02-01')
      await user.type(endDateInput, '2025-02-15')

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/job-sites/job-site-1/swms', {
          method: 'POST',
          body: expect.any(FormData)
        })
      })

      // Verify FormData contents
      const call = (global.fetch as jest.Mock).mock.calls[0]
      const formData = call[1].body as FormData
      expect(formData.get('name')).toBe('Test SWMS Job')
      expect(formData.get('description')).toBe('Test description')
      expect(formData.get('start_date')).toBe('2025-02-01')
      expect(formData.get('end_date')).toBe('2025-02-15')
      expect(formData.get('status')).toBe('planned')
    })

    it('submits update form with correct endpoint', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          swmsJob={mockSwmsJob}
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Update SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/job-sites/job-site-1/swms/swms-job-1', {
          method: 'PUT',
          body: expect.any(FormData)
        })
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({}) }), 100))
      )

      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      // Check for loading spinner
      expect(screen.getByTestId('loading-spinner') || screen.getByRole('button', { name: /Create SWMS Job/ })).toBeDisabled()
    })

    it('redirects after successful submission', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin/job-sites/job-site-1?tab=swms')
        expect(mockRefresh).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling', () => {
    it('displays error message on submission failure', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Submission failed' })
      })

      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Submission failed')).toBeInTheDocument()
      })
    })

    it('displays generic error message for unknown errors', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('clears error message on successful resubmission', async () => {
      const user = userEvent.setup()
      
      // First call fails
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'First attempt failed' })
      })

      // Second call succeeds
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })

      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      
      // First submission
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText('First attempt failed')).toBeInTheDocument()
      })

      // Second submission
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.queryByText('First attempt failed')).not.toBeInTheDocument()
      })
    })
  })

  describe('Status Selection', () => {
    it('allows changing status via select dropdown', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      // Click status select trigger
      const statusTrigger = screen.getByRole('combobox')
      await user.click(statusTrigger)

      // Select "Active" status
      const activeOption = screen.getByText('Active')
      await user.click(activeOption)

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        const call = (global.fetch as jest.Mock).mock.calls[0]
        const formData = call[1].body as FormData
        expect(formData.get('status')).toBe('active')
      })
    })
  })

  describe('Cancel Functionality', () => {
    it('navigates back on cancel button click', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const cancelButton = screen.getByRole('button', { name: /Cancel/ })
      await user.click(cancelButton)

      expect(mockPush).toHaveBeenCalledWith('/admin/job-sites/job-site-1?tab=swms')
    })

    it('disables cancel button during submission', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({}) }), 100))
      )

      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      const cancelButton = screen.getByRole('button', { name: /Cancel/ })
      expect(cancelButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('associates labels with form inputs', () => {
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.getByLabelText('SWMS Job Name *')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Start Date *')).toBeInTheDocument()
      expect(screen.getByLabelText('End Date (Optional)')).toBeInTheDocument()
    })

    it('shows error messages with proper styling', async () => {
      const user = userEvent.setup()
      render(
        <SwmsJobForm 
          jobSite={mockJobSite} 
          onCancel={mockOnCancel} 
        />
      )

      const nameInput = screen.getByLabelText('SWMS Job Name *')
      await user.clear(nameInput)

      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText('SWMS job name is required')
        expect(errorMessage).toHaveClass('text-red-500')
      })
    })
  })

  describe('Job Site Information Display', () => {
    it('handles job site without coordinates', () => {
      const jobSiteWithoutCoords = {
        ...mockJobSite,
        lat: null,
        lng: null
      }

      render(
        <SwmsJobForm 
          jobSite={jobSiteWithoutCoords} 
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.queryByText('Coordinates')).not.toBeInTheDocument()
    })

    it('handles job site without address', () => {
      const jobSiteWithoutAddress = {
        ...mockJobSite,
        address: null
      }

      render(
        <SwmsJobForm 
          jobSite={jobSiteWithoutAddress} 
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.queryByText('123 Test Street, Perth WA 6000')).not.toBeInTheDocument()
    })
  })
})