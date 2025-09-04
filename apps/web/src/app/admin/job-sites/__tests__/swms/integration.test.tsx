import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SwmsJobsSection } from '@/components/swms/SwmsJobsSection'
import { SwmsJobForm } from '@/components/swms/SwmsJobForm'
import { SubmissionStatusTable } from '@/components/swms/SubmissionStatusTable'
import type { SwmsJob, SwmsSubmission, JobSite } from '@/types/swms'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock SwmsStatusIndicator
jest.mock('@/components/swms/SwmsStatusIndicator', () => ({
  SwmsStatusIndicator: ({ status, size }: { status: string; size: string }) => (
    <span data-testid="status-indicator" data-status={status} data-size={size}>
      {status}
    </span>
  )
}))

// Mock fetch
global.fetch = jest.fn()

const mockJobSite: JobSite = {
  id: 'job-site-1',
  name: 'Perth Construction Site',
  address: '123 Construction Ave, Perth WA 6000',
  lat: -31.9505,
  lng: 115.8605,
  active: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
}

const mockSwmsJobs: SwmsJob[] = [
  {
    id: 'swms-job-1',
    job_site_id: 'job-site-1',
    name: 'Structural Steel Installation',
    description: 'Installation of main structural framework',
    start_date: '2025-01-15',
    end_date: '2025-01-30',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'swms-job-2',
    job_site_id: 'job-site-1',
    name: 'Concrete Foundation Work',
    description: 'Foundation concrete pour and finishing',
    start_date: '2025-02-01',
    end_date: '2025-02-15',
    status: 'planned',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  }
]

interface SubmissionWithJob extends SwmsSubmission {
  swms_job: SwmsJob
  contractor_name?: string
  worker_name?: string
}

const mockSubmissions: SubmissionWithJob[] = [
  {
    id: 'submission-1',
    swms_job_id: 'swms-job-1',
    contractor_id: 'contractor-1',
    worker_id: 'worker-1',
    status: 'submitted',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
    swms_job: mockSwmsJobs[0],
    contractor_name: 'Steel Works Ltd',
    worker_name: 'John Smith'
  },
  {
    id: 'submission-2',
    swms_job_id: 'swms-job-2',
    contractor_id: 'contractor-2',
    worker_id: 'worker-2',
    status: 'approved',
    created_at: '2025-01-10T14:20:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    swms_job: mockSwmsJobs[1],
    contractor_name: 'Concrete Masters',
    worker_name: 'Jane Doe'
  }
]

describe('SWMS Admin Workflow Integration Tests', () => {
  const jobSiteId = 'job-site-1'
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  })

  describe('SWMS Jobs Section Integration', () => {
    it('renders SWMS jobs with proper navigation links', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Check main create button
      const createButton = screen.getByText('Create SWMS Job').closest('a')
      expect(createButton).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/new`)
      
      // Check view links for each job
      const viewButtons = screen.getAllByText('View')
      expect(viewButtons[0].closest('a')).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/swms-job-1`)
      expect(viewButtons[1].closest('a')).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/swms-job-2`)
      
      // Check edit links
      const editButtons = screen.getAllByText('Edit')
      expect(editButtons[0].closest('a')).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/swms-job-1/edit`)
      expect(editButtons[1].closest('a')).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/swms-job-2/edit`)
    })

    it('displays comprehensive job statistics', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Check statistics display
      expect(screen.getByText('1')).toBeInTheDocument() // Active jobs
      expect(screen.getByText('0')).toBeInTheDocument() // Completed jobs
      expect(screen.getByText('1')).toBeInTheDocument() // Planned jobs
      
      expect(screen.getByText('Active Jobs')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Planned')).toBeInTheDocument()
    })

    it('handles job status changes correctly', () => {
      const jobsWithVariedStatuses: SwmsJob[] = [
        { ...mockSwmsJobs[0], status: 'completed' },
        { ...mockSwmsJobs[1], status: 'cancelled' }
      ]
      
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={jobsWithVariedStatuses} />)
      
      // Should show updated statistics
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Cancelled')).toBeInTheDocument()
    })

    it('transitions properly from empty to populated state', () => {
      const { rerender } = render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[]} />)
      
      expect(screen.getByText('No SWMS Jobs')).toBeInTheDocument()
      expect(screen.getByText('Create First SWMS Job')).toBeInTheDocument()
      
      // Rerender with jobs
      rerender(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      expect(screen.queryByText('No SWMS Jobs')).not.toBeInTheDocument()
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByText('Concrete Foundation Work')).toBeInTheDocument()
    })
  })

  describe('SWMS Job Form Integration', () => {
    it('creates new SWMS job with full workflow', async () => {
      const user = userEvent.setup()
      render(<SwmsJobForm jobSite={mockJobSite} onCancel={mockOnCancel} />)
      
      // Verify inherited site information is displayed
      expect(screen.getByText('Perth Construction Site')).toBeInTheDocument()
      expect(screen.getByText('123 Construction Ave, Perth WA 6000')).toBeInTheDocument()
      expect(screen.getByText('-31.950500, 115.860500')).toBeInTheDocument()
      
      // Fill out the form
      const nameInput = screen.getByLabelText('SWMS Job Name *')
      await user.clear(nameInput)
      await user.type(nameInput, 'Integration Test SWMS')
      
      const descriptionInput = screen.getByLabelText('Description')
      await user.type(descriptionInput, 'This is a test SWMS job for integration testing')
      
      const startDateInput = screen.getByLabelText('Start Date *')
      await user.clear(startDateInput)
      await user.type(startDateInput, '2025-03-01')
      
      const endDateInput = screen.getByLabelText('End Date (Optional)')
      await user.type(endDateInput, '2025-03-15')
      
      // Change status
      const statusTrigger = screen.getByRole('combobox')
      await user.click(statusTrigger)
      await user.click(screen.getByText('Active'))
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)
      
      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/job-sites/job-site-1/swms', {
          method: 'POST',
          body: expect.any(FormData)
        })
      })
      
      // Verify FormData contents
      const call = (global.fetch as jest.Mock).mock.calls[0]
      const formData = call[1].body as FormData
      expect(formData.get('name')).toBe('Integration Test SWMS')
      expect(formData.get('description')).toBe('This is a test SWMS job for integration testing')
      expect(formData.get('start_date')).toBe('2025-03-01')
      expect(formData.get('end_date')).toBe('2025-03-15')
      expect(formData.get('status')).toBe('active')
      
      // Verify navigation
      expect(mockPush).toHaveBeenCalledWith('/admin/job-sites/job-site-1?tab=swms')
      expect(mockRefresh).toHaveBeenCalled()
    })

    it('updates existing SWMS job with full workflow', async () => {
      const user = userEvent.setup()
      const existingJob = mockSwmsJobs[0]
      
      render(<SwmsJobForm jobSite={mockJobSite} swmsJob={existingJob} onCancel={mockOnCancel} />)
      
      // Verify form is pre-populated
      expect(screen.getByDisplayValue('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Installation of main structural framework')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2025-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2025-01-30')).toBeInTheDocument()
      
      // Update the name
      const nameInput = screen.getByLabelText('SWMS Job Name *')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Steel Installation')
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /Update SWMS Job/ })
      await user.click(submitButton)
      
      // Verify API call for update
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/job-sites/job-site-1/swms/swms-job-1', {
          method: 'PUT',
          body: expect.any(FormData)
        })
      })
    })

    it('handles form validation errors in full workflow', async () => {
      const user = userEvent.setup()
      render(<SwmsJobForm jobSite={mockJobSite} onCancel={mockOnCancel} />)
      
      // Clear required fields
      const nameInput = screen.getByLabelText('SWMS Job Name *')
      await user.clear(nameInput)
      
      const startDateInput = screen.getByLabelText('Start Date *')
      await user.clear(startDateInput)
      
      // Try to submit
      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)
      
      // Check validation errors appear
      await waitFor(() => {
        expect(screen.getByText('SWMS job name is required')).toBeInTheDocument()
        expect(screen.getByText('Start date is required')).toBeInTheDocument()
      })
      
      // Verify no API call was made
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('handles server errors gracefully', async () => {
      const user = userEvent.setup()
      
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Server validation failed' })
      })
      
      render(<SwmsJobForm jobSite={mockJobSite} onCancel={mockOnCancel} />)
      
      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Server validation failed')).toBeInTheDocument()
      })
      
      // Verify no navigation occurred
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Submission Status Table Integration', () => {
    it('displays comprehensive submission data with full functionality', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Verify header and counts
      expect(screen.getByText('SWMS Submissions')).toBeInTheDocument()
      expect(screen.getByText('2 of 2')).toBeInTheDocument()
      
      // Verify job information is displayed
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByText('Concrete Foundation Work')).toBeInTheDocument()
      
      // Verify contractor and worker information
      expect(screen.getByText('Steel Works Ltd')).toBeInTheDocument()
      expect(screen.getByText('Concrete Masters')).toBeInTheDocument()
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      
      // Verify status indicators
      const statusIndicators = screen.getAllByTestId('status-indicator')
      expect(statusIndicators).toHaveLength(2)
      
      // Verify summary statistics
      expect(screen.getByText('Total Submissions')).toBeInTheDocument()
      expect(screen.getByText('Approved')).toBeInTheDocument()
      expect(screen.getByText('Pending Review')).toBeInTheDocument()
      expect(screen.getByText('Needs Attention')).toBeInTheDocument()
    })

    it('handles search and filter operations together', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Test search functionality
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'steel')
      
      expect(screen.getByText('1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.queryByText('Concrete Foundation Work')).not.toBeInTheDocument()
      
      // Clear search and apply status filter
      await user.clear(searchInput)
      
      const filterTrigger = screen.getByRole('combobox')
      await user.click(filterTrigger)
      await user.click(screen.getByText('Approved (1)'))
      
      expect(screen.getByText('1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Concrete Foundation Work')).toBeInTheDocument()
      expect(screen.queryByText('Structural Steel Installation')).not.toBeInTheDocument()
    })

    it('handles sorting operations correctly', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Sort by contractor name
      const contractorHeader = screen.getByText('Contractor')
      await user.click(contractorHeader)
      
      // Verify rows are sorted (first should be Concrete Masters alphabetically)
      const rows = screen.getAllByRole('row').slice(1) // Skip header
      expect(rows[0]).toHaveTextContent('Concrete Masters')
      expect(rows[1]).toHaveTextContent('Steel Works Ltd')
      
      // Reverse sort
      await user.click(contractorHeader)
      
      const reversedRows = screen.getAllByRole('row').slice(1)
      expect(reversedRows[0]).toHaveTextContent('Steel Works Ltd')
      expect(reversedRows[1]).toHaveTextContent('Concrete Masters')
    })

    it('displays appropriate action buttons based on status', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // All submissions should have View button
      const viewButtons = screen.getAllByText('View')
      expect(viewButtons).toHaveLength(2)
      
      // Submitted status should have Approve and Reject buttons
      expect(screen.getByText('Approve')).toBeInTheDocument()
      expect(screen.getByText('Reject')).toBeInTheDocument()
      
      // Approved status should not have additional action buttons
      const approvedRow = screen.getByText('Concrete Masters').closest('tr')
      expect(approvedRow).not.toHaveTextContent('Approve')
      expect(approvedRow).not.toHaveTextContent('Reject')
    })

    it('transitions properly from empty to populated state', () => {
      const { rerender } = render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[]} />)
      
      expect(screen.getByText('No Submissions Yet')).toBeInTheDocument()
      expect(screen.getByText(/SWMS submissions will appear here/)).toBeInTheDocument()
      
      // Rerender with submissions
      rerender(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.queryByText('No Submissions Yet')).not.toBeInTheDocument()
      expect(screen.getByText('SWMS Submissions')).toBeInTheDocument()
      expect(screen.getByText('2 of 2')).toBeInTheDocument()
    })
  })

  describe('Cross-Component Integration', () => {
    it('maintains consistent job site ID across all components', () => {
      // Render jobs section
      const { unmount: unmountJobs } = render(
        <SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />
      )
      
      const createJobsButton = screen.getByText('Create SWMS Job').closest('a')
      expect(createJobsButton).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/new`)
      
      unmountJobs()
      
      // Render submission table
      const { unmount: unmountTable } = render(
        <SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />
      )
      
      expect(screen.getByText('SWMS Submissions')).toBeInTheDocument()
      
      unmountTable()
      
      // Render job form
      render(<SwmsJobForm jobSite={mockJobSite} onCancel={mockOnCancel} />)
      
      expect(screen.getByText('Perth Construction Site')).toBeInTheDocument()
    })

    it('handles data relationships correctly across components', () => {
      // Test that submissions reference correct SWMS jobs
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Verify submission shows correct job information
      const steelSubmissionRow = screen.getByText('Steel Works Ltd').closest('tr')
      expect(steelSubmissionRow).toHaveTextContent('Structural Steel Installation')
      expect(steelSubmissionRow).toHaveTextContent('Job: active')
      
      const concreteSubmissionRow = screen.getByText('Concrete Masters').closest('tr')
      expect(concreteSubmissionRow).toHaveTextContent('Concrete Foundation Work')
      expect(concreteSubmissionRow).toHaveTextContent('Job: planned')
    })

    it('maintains consistent status handling across all components', () => {
      // Render jobs section with various statuses
      const jobsWithStatuses: SwmsJob[] = [
        { ...mockSwmsJobs[0], status: 'active' },
        { ...mockSwmsJobs[1], status: 'completed' }
      ]
      
      const { unmount } = render(
        <SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={jobsWithStatuses} />
      )
      
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
      
      unmount()
      
      // Render submission table with corresponding statuses
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const statusIndicators = screen.getAllByTestId('status-indicator')
      expect(statusIndicators[0]).toHaveAttribute('data-status', 'submitted')
      expect(statusIndicators[1]).toHaveAttribute('data-status', 'approved')
    })
  })

  describe('Error Handling Integration', () => {
    it('handles form submission errors without breaking workflow', async () => {
      const user = userEvent.setup()
      
      // Mock network error
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
      
      render(<SwmsJobForm jobSite={mockJobSite} onCancel={mockOnCancel} />)
      
      const submitButton = screen.getByRole('button', { name: /Create SWMS Job/ })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
      
      // Form should still be interactive
      const nameInput = screen.getByLabelText('SWMS Job Name *')
      expect(nameInput).toBeEnabled()
      
      // Cancel button should still work
      const cancelButton = screen.getByRole('button', { name: /Cancel/ })
      expect(cancelButton).toBeEnabled()
    })

    it('handles data loading states gracefully', () => {
      // Test with empty data
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[]} />)
      expect(screen.getByText('No SWMS Jobs')).toBeInTheDocument()
      
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[]} />)
      expect(screen.getByText('No Submissions Yet')).toBeInTheDocument()
    })

    it('maintains component stability with invalid data', () => {
      // Test with malformed job data
      const invalidJobs = [
        {
          ...mockSwmsJobs[0],
          name: '',
          start_date: 'invalid-date'
        }
      ] as SwmsJob[]
      
      expect(() => {
        render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={invalidJobs} />)
      }).not.toThrow()
      
      // Should still render basic structure
      expect(screen.getByText('SWMS Jobs')).toBeInTheDocument()
    })
  })

  describe('Performance and Responsiveness', () => {
    it('handles large datasets efficiently', () => {
      // Create a large dataset
      const largeJobsDataset: SwmsJob[] = Array.from({ length: 50 }, (_, i) => ({
        id: `job-${i}`,
        job_site_id: jobSiteId,
        name: `SWMS Job ${i + 1}`,
        description: `Description for job ${i + 1}`,
        start_date: '2025-01-01',
        end_date: '2025-01-15',
        status: i % 2 === 0 ? 'active' : 'planned',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }))
      
      const startTime = performance.now()
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={largeJobsDataset} />)
      const endTime = performance.now()
      
      // Should render within reasonable time (less than 100ms for 50 items)
      expect(endTime - startTime).toBeLessThan(100)
      
      // Should display correct counts
      expect(screen.getByText('25')).toBeInTheDocument() // Active jobs
      expect(screen.getByText('25')).toBeInTheDocument() // Planned jobs
    })

    it('handles rapid state changes without errors', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      
      // Rapidly type and clear search
      await user.type(searchInput, 'steel')
      await user.clear(searchInput)
      await user.type(searchInput, 'concrete')
      await user.clear(searchInput)
      
      // Should maintain stability
      expect(screen.getByText('2 of 2')).toBeInTheDocument()
    })
  })
})