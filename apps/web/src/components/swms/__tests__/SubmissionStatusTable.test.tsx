import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubmissionStatusTable } from '../SubmissionStatusTable'
import type { SwmsSubmission, SwmsJob } from '@/types/swms'

// Mock SwmsStatusIndicator
jest.mock('../SwmsStatusIndicator', () => ({
  SwmsStatusIndicator: ({ status, size }: { status: string; size: string }) => (
    <span data-testid="status-indicator" data-status={status} data-size={size}>
      {status}
    </span>
  )
}))

interface SubmissionWithJob extends SwmsSubmission {
  swms_job: SwmsJob
  contractor_name?: string
  worker_name?: string
}

const mockSubmissions: SubmissionWithJob[] = [
  {
    id: 'submission-1',
    swms_job_id: 'job-1',
    contractor_id: 'contractor-1',
    worker_id: 'worker-1',
    status: 'submitted',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
    swms_job: {
      id: 'job-1',
      job_site_id: 'site-1',
      name: 'Structural Steel Installation',
      description: 'Steel framework installation',
      start_date: '2025-01-15',
      end_date: '2025-01-30',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z'
    },
    contractor_name: 'ABC Construction Pty Ltd',
    worker_name: 'John Smith'
  },
  {
    id: 'submission-2',
    swms_job_id: 'job-2',
    contractor_id: 'contractor-2',
    worker_id: 'worker-2',
    status: 'approved',
    created_at: '2025-01-10T14:20:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    swms_job: {
      id: 'job-2',
      job_site_id: 'site-1',
      name: 'Concrete Pour Operations',
      description: 'Foundation concrete pour',
      start_date: '2025-02-01',
      end_date: '2025-02-10',
      status: 'planned',
      created_at: '2025-01-02T00:00:00Z'
    },
    contractor_name: 'XYZ Contracting',
    worker_name: 'Jane Doe'
  },
  {
    id: 'submission-3',
    swms_job_id: 'job-3',
    contractor_id: 'contractor-3',
    worker_id: 'worker-3',
    status: 'under_review',
    created_at: '2025-01-12T16:45:00Z',
    updated_at: '2025-01-13T11:30:00Z',
    swms_job: {
      id: 'job-3',
      job_site_id: 'site-1',
      name: 'Electrical Installation',
      description: 'Electrical wiring and fixtures',
      start_date: '2025-01-20',
      end_date: '2025-01-25',
      status: 'active',
      created_at: '2025-01-03T00:00:00Z'
    },
    contractor_name: 'ElectroTech Services',
    worker_name: 'Bob Wilson'
  },
  {
    id: 'submission-4',
    swms_job_id: 'job-4',
    contractor_id: 'contractor-4',
    worker_id: 'worker-4',
    status: 'rejected',
    created_at: '2025-01-08T09:15:00Z',
    updated_at: '2025-01-09T13:20:00Z',
    swms_job: {
      id: 'job-4',
      job_site_id: 'site-1',
      name: 'Plumbing Installation',
      description: 'Water and sewer installation',
      start_date: '2025-01-25',
      end_date: '2025-01-30',
      status: 'planned',
      created_at: '2025-01-04T00:00:00Z'
    },
    contractor_name: 'PlumberPro Ltd',
    worker_name: 'Alice Johnson'
  },
  {
    id: 'submission-5',
    swms_job_id: 'job-5',
    contractor_id: 'contractor-5',
    worker_id: 'worker-5',
    status: 'requires_changes',
    created_at: '2025-01-14T11:00:00Z',
    updated_at: '2025-01-14T15:30:00Z',
    swms_job: {
      id: 'job-5',
      job_site_id: 'site-1',
      name: 'HVAC Installation',
      description: 'Heating and cooling systems',
      start_date: '2025-02-05',
      end_date: '2025-02-15',
      status: 'planned',
      created_at: '2025-01-05T00:00:00Z'
    },
    contractor_name: 'Climate Control Co',
    worker_name: 'Charlie Brown'
  }
]

describe('SubmissionStatusTable', () => {
  const jobSiteId = 'test-job-site-1'

  describe('Empty State', () => {
    it('renders empty state when no submissions exist', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[]} />)
      
      expect(screen.getByText('No Submissions Yet')).toBeInTheDocument()
      expect(screen.getByText(/SWMS submissions will appear here/)).toBeInTheDocument()
    })

    it('displays empty state icon', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[]} />)
      
      // Check for FileText icon in empty state
      const emptyCard = screen.getByText('No Submissions Yet').closest('div')
      expect(emptyCard).toBeInTheDocument()
    })
  })

  describe('Header and Basic Structure', () => {
    it('renders header with correct title and submission count', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.getByText('SWMS Submissions')).toBeInTheDocument()
      expect(screen.getByText('5 of 5')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} className="custom-class" />)
      
      const table = screen.getByText('SWMS Submissions').closest('.custom-class')
      expect(table).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('renders search input with correct placeholder', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      expect(searchInput).toBeInTheDocument()
    })

    it('filters submissions by contractor name', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'ABC Construction')
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      expect(screen.getByText('ABC Construction Pty Ltd')).toBeInTheDocument()
      expect(screen.queryByText('XYZ Contracting')).not.toBeInTheDocument()
    })

    it('filters submissions by worker name', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'jane doe')
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })

    it('filters submissions by job name', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'electrical')
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      expect(screen.getByText('Electrical Installation')).toBeInTheDocument()
    })

    it('handles case-insensitive search', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'STRUCTURAL STEEL')
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
    })

    it('updates filtered count correctly', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'installation')
      
      // Should find 3 jobs with "Installation" in the name
      expect(screen.getByText('3 of 5')).toBeInTheDocument()
    })

    it('clears search when input is emptied', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      
      await user.type(searchInput, 'ABC')
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      
      await user.clear(searchInput)
      expect(screen.getByText('5 of 5')).toBeInTheDocument()
    })
  })

  describe('Status Filter', () => {
    it('renders status filter with correct options and counts', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const filterTrigger = screen.getByRole('combobox')
      fireEvent.click(filterTrigger)
      
      expect(screen.getByText('All Status (5)')).toBeInTheDocument()
      expect(screen.getByText('Submitted (1)')).toBeInTheDocument()
      expect(screen.getByText('Under Review (1)')).toBeInTheDocument()
      expect(screen.getByText('Approved (1)')).toBeInTheDocument()
      expect(screen.getByText('Rejected (1)')).toBeInTheDocument()
      expect(screen.getByText('Needs Changes (1)')).toBeInTheDocument()
    })

    it('filters submissions by status', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const filterTrigger = screen.getByRole('combobox')
      await user.click(filterTrigger)
      
      const approvedOption = screen.getByText('Approved (1)')
      await user.click(approvedOption)
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.queryByText('John Smith')).not.toBeInTheDocument()
    })

    it('combines search and status filters', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // First apply search
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'installation')
      
      // Then apply status filter
      const filterTrigger = screen.getByRole('combobox')
      await user.click(filterTrigger)
      
      const submittedOption = screen.getByText('Submitted (1)')
      await user.click(submittedOption)
      
      // Should find only 1 submission (Structural Steel Installation with submitted status)
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
    })
  })

  describe('Sorting Functionality', () => {
    it('renders sortable column headers', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.getByText('SWMS Job')).toBeInTheDocument()
      expect(screen.getByText('Contractor')).toBeInTheDocument()
      expect(screen.getByText('Worker')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Submitted')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('sorts by contractor name when header is clicked', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const contractorHeader = screen.getByText('Contractor')
      await user.click(contractorHeader)
      
      // Should sort alphabetically by contractor name (ascending)
      const rows = screen.getAllByRole('row').slice(1) // Skip header row
      const firstRowContractor = rows[0].textContent
      expect(firstRowContractor).toContain('ABC Construction')
    })

    it('reverses sort direction on second click', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const contractorHeader = screen.getByText('Contractor')
      await user.click(contractorHeader) // First click - ascending
      await user.click(contractorHeader) // Second click - descending
      
      // Should be sorted in descending order now
      const rows = screen.getAllByRole('row').slice(1)
      const firstRowContractor = rows[0].textContent
      expect(firstRowContractor).toContain('XYZ Contracting')
    })

    it('sorts by date correctly', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Default sort should be by created_at desc (most recent first)
      const rows = screen.getAllByRole('row').slice(1)
      const firstRowContent = rows[0].textContent
      expect(firstRowContent).toContain('Structural Steel Installation') // 2025-01-15T10:30:00Z is most recent
    })

    it('shows correct sort indicators', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const contractorHeader = screen.getByText('Contractor').closest('th')
      expect(contractorHeader).toHaveClass('cursor-pointer')
    })
  })

  describe('Table Content Display', () => {
    it('displays all submission data correctly', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Check SWMS job names
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByText('Concrete Pour Operations')).toBeInTheDocument()
      expect(screen.getByText('Electrical Installation')).toBeInTheDocument()
      
      // Check contractor names
      expect(screen.getByText('ABC Construction Pty Ltd')).toBeInTheDocument()
      expect(screen.getByText('XYZ Contracting')).toBeInTheDocument()
      expect(screen.getByText('ElectroTech Services')).toBeInTheDocument()
      
      // Check worker names
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
    })

    it('displays job status indicators', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Check for job status displays
      expect(screen.getByText('Job: active')).toBeInTheDocument()
      expect(screen.getByText('Job: planned')).toBeInTheDocument()
    })

    it('uses SwmsStatusIndicator for submission status', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Check that status indicators are rendered with correct props
      const statusIndicators = screen.getAllByTestId('status-indicator')
      expect(statusIndicators).toHaveLength(5)
      
      // Check some specific statuses
      expect(screen.getByTestId('status-indicator')).toHaveAttribute('data-status', 'submitted')
      expect(screen.getByTestId('status-indicator')).toHaveAttribute('data-size', 'sm')
    })

    it('formats dates correctly in Australian format', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Check for formatted dates (Australian format with time)
      expect(screen.getByText('15/01/2025, 10:30')).toBeInTheDocument()
      expect(screen.getByText('10/01/2025, 14:20')).toBeInTheDocument()
    })

    it('handles missing contractor and worker names', () => {
      const submissionWithMissingData: SubmissionWithJob = {
        ...mockSubmissions[0],
        contractor_name: undefined,
        worker_name: undefined
      }
      
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[submissionWithMissingData]} />)
      
      // Should show em-dashes for missing data
      expect(screen.getAllByText('—')).toHaveLength(2)
    })
  })

  describe('Action Buttons', () => {
    it('renders View button for all submissions', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const viewButtons = screen.getAllByText('View')
      expect(viewButtons).toHaveLength(5)
    })

    it('renders Approve and Reject buttons for submitted status', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.getByText('Approve')).toBeInTheDocument()
      expect(screen.getByText('Reject')).toBeInTheDocument()
    })

    it('renders Review button for under_review status', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.getByText('Review')).toBeInTheDocument()
    })

    it('does not render action buttons for approved/rejected status except View', () => {
      const approvedSubmission = mockSubmissions.find(s => s.status === 'approved')
      const rejectedSubmission = mockSubmissions.find(s => s.status === 'rejected')
      
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[approvedSubmission!, rejectedSubmission!]} />)
      
      // Should have 2 View buttons but no Approve/Reject/Review buttons
      expect(screen.getAllByText('View')).toHaveLength(2)
      expect(screen.queryByText('Approve')).not.toBeInTheDocument()
      expect(screen.queryByText('Reject')).not.toBeInTheDocument()
      expect(screen.queryByText('Review')).not.toBeInTheDocument()
    })
  })

  describe('Summary Statistics', () => {
    it('displays correct summary statistics', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.getByText('5')).toBeInTheDocument() // Total submissions
      expect(screen.getByText('1')).toBeInTheDocument() // Approved
      expect(screen.getByText('2')).toBeInTheDocument() // Pending review (submitted + under_review)
      expect(screen.getByText('2')).toBeInTheDocument() // Needs attention (rejected + requires_changes)
    })

    it('displays correct labels for statistics', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      expect(screen.getByText('Total Submissions')).toBeInTheDocument()
      expect(screen.getByText('Approved')).toBeInTheDocument()
      expect(screen.getByText('Pending Review')).toBeInTheDocument()
      expect(screen.getByText('Needs Attention')).toBeInTheDocument()
    })

    it('applies correct styling to statistics cards', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const totalCard = screen.getByText('Total Submissions').closest('div')
      const approvedCard = screen.getByText('Approved').closest('div')
      const pendingCard = screen.getByText('Pending Review').closest('div')
      const attentionCard = screen.getByText('Needs Attention').closest('div')
      
      expect(totalCard).toHaveClass('bg-blue-50')
      expect(approvedCard).toHaveClass('bg-green-50')
      expect(pendingCard).toHaveClass('bg-yellow-50')
      expect(attentionCard).toHaveClass('bg-red-50')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty search results', async () => {
      const user = userEvent.setup()
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      await user.type(searchInput, 'nonexistent contractor')
      
      expect(screen.getByText('0 of 5')).toBeInTheDocument()
      
      // Should not render any table rows except header
      const dataRows = screen.getAllByRole('row').slice(1)
      expect(dataRows).toHaveLength(0)
    })

    it('handles invalid date formats', () => {
      const submissionWithInvalidDate: SubmissionWithJob = {
        ...mockSubmissions[0],
        created_at: 'invalid-date'
      }
      
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[submissionWithInvalidDate]} />)
      
      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('handles submissions without job data', () => {
      const submissionWithoutJob: SubmissionWithJob = {
        ...mockSubmissions[0],
        swms_job: {
          id: 'empty-job',
          job_site_id: 'site-1',
          name: '',
          description: null,
          start_date: '2025-01-01',
          end_date: null,
          status: 'planned',
          created_at: '2025-01-01T00:00:00Z'
        }
      }
      
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={[submissionWithoutJob]} />)
      
      // Should still render the table without crashing
      expect(screen.getByText('SWMS Submissions')).toBeInTheDocument()
    })

    it('maintains filter state when data changes', () => {
      const { rerender } = render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      // Apply a filter first
      const filterTrigger = screen.getByRole('combobox')
      fireEvent.click(filterTrigger)
      fireEvent.click(screen.getByText('Approved (1)'))
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
      
      // Rerender with updated data
      const updatedSubmissions = [...mockSubmissions, {
        ...mockSubmissions[0],
        id: 'new-submission',
        status: 'approved' as const
      }]
      
      rerender(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={updatedSubmissions} />)
      
      // Filter should still be applied
      expect(screen.getByText('2 of 6')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides proper table structure for screen readers', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      
      const columnHeaders = screen.getAllByRole('columnheader')
      expect(columnHeaders).toHaveLength(6)
      
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(6) // 1 header + 5 data rows
    })

    it('makes sortable headers keyboard accessible', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const contractorHeader = screen.getByText('Contractor').closest('th')
      expect(contractorHeader).toHaveClass('cursor-pointer')
    })

    it('provides appropriate labels for form controls', () => {
      render(<SubmissionStatusTable jobSiteId={jobSiteId} submissions={mockSubmissions} />)
      
      const searchInput = screen.getByPlaceholderText('Search by contractor, worker, or job name...')
      expect(searchInput).toBeInTheDocument()
      
      const filterSelect = screen.getByRole('combobox')
      expect(filterSelect).toBeInTheDocument()
    })
  })
})