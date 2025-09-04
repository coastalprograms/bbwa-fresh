import { render, screen } from '@testing-library/react'
import { SwmsJobsSection } from '../SwmsJobsSection'
import type { SwmsJob } from '@/types/swms'

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

const mockSwmsJobs: SwmsJob[] = [
  {
    id: 'job-1',
    job_site_id: 'site-1',
    name: 'Structural Steel Installation',
    description: 'Installation of structural steel framework for building foundation',
    start_date: '2025-01-15',
    end_date: '2025-01-30',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'job-2',
    job_site_id: 'site-1',
    name: 'Concrete Pour Operations',
    description: 'Concrete pouring for foundation slab',
    start_date: '2025-02-01',
    end_date: '2025-02-10',
    status: 'planned',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 'job-3',
    job_site_id: 'site-1',
    name: 'Electrical Installation',
    description: null,
    start_date: '2024-12-01',
    end_date: null,
    status: 'completed',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 'job-4',
    job_site_id: 'site-1',
    name: 'Plumbing Installation',
    description: 'Water and sewer line installation',
    start_date: '2025-01-10',
    end_date: '2025-01-20',
    status: 'cancelled',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

describe('SwmsJobsSection', () => {
  const jobSiteId = 'test-job-site-1'

  describe('Header and Basic Structure', () => {
    it('renders header with correct title and description', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      expect(screen.getByText('SWMS Jobs')).toBeInTheDocument()
      expect(screen.getByText('Manage Safe Work Method Statements for this job site')).toBeInTheDocument()
    })

    it('renders create SWMS job button', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const createButton = screen.getByText('Create SWMS Job').closest('a')
      expect(createButton).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/new`)
    })

    it('applies custom className', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} className="custom-class" />)
      
      const card = screen.getByText('SWMS Jobs').closest('.custom-class')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('renders empty state when no SWMS jobs exist', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[]} />)
      
      expect(screen.getByText('No SWMS Jobs')).toBeInTheDocument()
      expect(screen.getByText(/Create your first SWMS job to start managing/)).toBeInTheDocument()
      expect(screen.getByText('Create First SWMS Job')).toBeInTheDocument()
      
      const createFirstButton = screen.getByText('Create First SWMS Job').closest('a')
      expect(createFirstButton).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/new`)
    })

    it('renders empty state when swmsJobs is null', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={null as any} />)
      
      expect(screen.getByText('No SWMS Jobs')).toBeInTheDocument()
    })

    it('renders empty state when swmsJobs is undefined', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={undefined as any} />)
      
      expect(screen.getByText('No SWMS Jobs')).toBeInTheDocument()
    })
  })

  describe('Summary Statistics', () => {
    it('displays correct summary statistics', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Active jobs: 1 (job-1)
      const activeCount = screen.getByText('1')
      expect(activeCount.nextElementSibling).toHaveTextContent('Active Jobs')
      
      // Completed jobs: 1 (job-3)
      const completedCount = screen.getByText('1')
      expect(completedCount.nextElementSibling).toHaveTextContent('Completed')
      
      // Planned jobs: 1 (job-2)
      const plannedCount = screen.getByText('1')
      expect(plannedCount.nextElementSibling).toHaveTextContent('Planned')
    })

    it('handles zero counts correctly', () => {
      const singleJobArray = [mockSwmsJobs[0]] // Only one active job
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={singleJobArray} />)
      
      // Should show 1 active, 0 completed, 0 planned
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getAllByText('0')).toHaveLength(2)
    })

    it('displays summary statistics with proper styling', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Check for proper styling classes
      const statsContainer = screen.getByText('Active Jobs').closest('.text-center')?.parentElement
      expect(statsContainer).toHaveClass('grid')
      expect(statsContainer).toHaveClass('grid-cols-3')
      expect(statsContainer).toHaveClass('gap-4')
    })
  })

  describe('Jobs Table', () => {
    it('renders table headers correctly', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      expect(screen.getByText('Job Name')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Start Date')).toBeInTheDocument()
      expect(screen.getByText('End Date')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('renders all SWMS jobs in table rows', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByText('Concrete Pour Operations')).toBeInTheDocument()
      expect(screen.getByText('Electrical Installation')).toBeInTheDocument()
      expect(screen.getByText('Plumbing Installation')).toBeInTheDocument()
    })

    it('displays job descriptions when available', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      expect(screen.getByText('Installation of structural steel framework for building foundation')).toBeInTheDocument()
      expect(screen.getByText('Concrete pouring for foundation slab')).toBeInTheDocument()
      expect(screen.getByText('Water and sewer line installation')).toBeInTheDocument()
    })

    it('handles missing job descriptions gracefully', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Job with null description should still render the name without error
      expect(screen.getByText('Electrical Installation')).toBeInTheDocument()
    })
  })

  describe('Status Badges', () => {
    it('renders status badges with correct styling for all statuses', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Check that each status type is rendered
      expect(screen.getByText('Active')).toHaveClass('bg-green-100')
      expect(screen.getByText('Active')).toHaveClass('text-green-800')
      expect(screen.getByText('Planned')).toHaveClass('bg-yellow-100')
      expect(screen.getByText('Planned')).toHaveClass('text-yellow-800')
      expect(screen.getByText('Completed')).toHaveClass('bg-blue-100')
      expect(screen.getByText('Completed')).toHaveClass('text-blue-800')
      expect(screen.getByText('Cancelled')).toHaveClass('bg-red-100')
      expect(screen.getByText('Cancelled')).toHaveClass('text-red-800')
    })

    it('handles unknown status gracefully', () => {
      const jobWithUnknownStatus: SwmsJob = {
        ...mockSwmsJobs[0],
        status: 'unknown' as any
      }
      
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[jobWithUnknownStatus]} />)
      
      expect(screen.getByText('unknown')).toBeInTheDocument()
    })
  })

  describe('Date Formatting', () => {
    it('formats dates correctly in Australian format', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Check start dates - should be in DD/MM/YYYY format
      expect(screen.getByText('15/01/2025')).toBeInTheDocument() // 2025-01-15
      expect(screen.getByText('01/02/2025')).toBeInTheDocument() // 2025-02-01
      expect(screen.getByText('01/12/2024')).toBeInTheDocument() // 2024-12-01
    })

    it('handles missing end dates', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      // Job with null end_date should show em-dash
      const emDashes = screen.getAllByText('—')
      expect(emDashes.length).toBeGreaterThan(0)
    })

    it('handles invalid date strings gracefully', () => {
      const jobWithInvalidDate: SwmsJob = {
        ...mockSwmsJobs[0],
        start_date: 'invalid-date'
      }
      
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[jobWithInvalidDate]} />)
      
      expect(screen.getByText('—')).toBeInTheDocument()
    })
  })

  describe('Action Buttons', () => {
    it('renders view and edit buttons for each job', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const viewButtons = screen.getAllByText('View')
      const editButtons = screen.getAllByText('Edit')
      
      expect(viewButtons).toHaveLength(4) // One for each job
      expect(editButtons).toHaveLength(4) // One for each job
    })

    it('generates correct URLs for view buttons', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const viewLinks = screen.getAllByText('View').map(button => button.closest('a'))
      
      expect(viewLinks[0]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-1`)
      expect(viewLinks[1]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-2`)
      expect(viewLinks[2]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-3`)
      expect(viewLinks[3]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-4`)
    })

    it('generates correct URLs for edit buttons', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const editLinks = screen.getAllByText('Edit').map(button => button.closest('a'))
      
      expect(editLinks[0]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-1/edit`)
      expect(editLinks[1]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-2/edit`)
      expect(editLinks[2]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-3/edit`)
      expect(editLinks[3]).toHaveAttribute('href', `/admin/job-sites/${jobSiteId}/swms/job-4/edit`)
    })

    it('applies correct styling to action buttons', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const viewButton = screen.getAllByText('View')[0].closest('button')
      const editButton = screen.getAllByText('Edit')[0].closest('button')
      
      expect(viewButton).toHaveClass('outline')
      expect(editButton).toHaveClass('outline')
    })
  })

  describe('Table Structure and Accessibility', () => {
    it('uses proper table structure with thead and tbody', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      
      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(5)
      
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(5) // 1 header + 4 data rows
    })

    it('ensures each row has the correct number of cells', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const dataRows = screen.getAllByRole('row').slice(1) // Skip header row
      
      dataRows.forEach(row => {
        const cells = row.querySelectorAll('td')
        expect(cells).toHaveLength(5) // Should match number of columns
      })
    })
  })

  describe('Content Layout and Responsive Design', () => {
    it('applies proper spacing and layout classes', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const contentArea = screen.getByText('SWMS Jobs').closest('.space-y-4')
      expect(contentArea).toBeInTheDocument()
    })

    it('renders with proper card structure', () => {
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={mockSwmsJobs} />)
      
      const cardHeader = screen.getByText('SWMS Jobs').closest('div')
      const cardContent = screen.getByRole('table').closest('div')
      
      expect(cardHeader).toBeInTheDocument()
      expect(cardContent).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles single job correctly', () => {
      const singleJob = [mockSwmsJobs[0]]
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={singleJob} />)
      
      expect(screen.getByText('Structural Steel Installation')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // Active count
      expect(screen.getAllByText('0')).toHaveLength(2) // Completed and planned counts
    })

    it('handles very long job names and descriptions', () => {
      const jobWithLongContent: SwmsJob = {
        ...mockSwmsJobs[0],
        name: 'Very Long SWMS Job Name That Might Wrap To Multiple Lines And Test Layout',
        description: 'This is a very long description that might wrap to multiple lines and needs to be handled properly by the layout system without breaking the table structure'
      }
      
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[jobWithLongContent]} />)
      
      expect(screen.getByText('Very Long SWMS Job Name That Might Wrap To Multiple Lines And Test Layout')).toBeInTheDocument()
    })

    it('handles jobs with only required fields', () => {
      const minimalJob: SwmsJob = {
        id: 'minimal-1',
        job_site_id: 'site-1',
        name: 'Minimal Job',
        description: null,
        start_date: '2025-01-01',
        end_date: null,
        status: 'planned',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
      
      render(<SwmsJobsSection jobSiteId={jobSiteId} swmsJobs={[minimalJob]} />)
      
      expect(screen.getByText('Minimal Job')).toBeInTheDocument()
      expect(screen.getByText('Planned')).toBeInTheDocument()
    })
  })
})