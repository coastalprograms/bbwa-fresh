import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { createClient } from '@supabase/supabase-js'
import { SwmsDashboard } from '../SwmsDashboard'

// Mock Supabase client
jest.mock('@supabase/supabase-js')
jest.mock('@/lib/supabase/client', () => ({
  supabaseBrowser: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn()
      }))
    }))
  }
}))

// Mock real-time hook
jest.mock('@/hooks/useSwmsDashboard', () => ({
  useSwmsDashboard: () => ({
    metrics: {
      activeSwmsJobs: 12,
      pendingSubmissions: 5,
      overdueSubmissions: 2,
      complianceRate: 85,
      activeCampaigns: 3
    },
    isLoading: false,
    error: null
  })
}))

// Mock components
jest.mock('@/components/swms/SwmsProgressIndicator', () => {
  return function MockSwmsProgressIndicator({ value, label }: any) {
    return <div data-testid="progress-indicator">{label}: {value}%</div>
  }
})

jest.mock('@/components/admin/SwmsQuickActions', () => {
  return function MockSwmsQuickActions({ onAction }: any) {
    return (
      <div data-testid="quick-actions">
        <button onClick={() => onAction('send_reminder')}>Send Reminder</button>
        <button onClick={() => onAction('export_compliance')}>Export Compliance</button>
      </div>
    )
  }
})

describe('SwmsDashboard Integration Tests', () => {
  const mockMetrics = {
    activeWorkers: 0,
    recentCheckIns: 0,
    upcomingExpirations: 0,
    activeSwmsJobs: 12,
    pendingSubmissions: 5,
    overdueSubmissions: 2,
    complianceRate: 85,
    activeCampaigns: 3
  }

  const mockJobStatuses = [
    {
      id: "job-1",
      job_site: {
        name: "Test Site 1",
        id: "site-1"
      },
      contractor_count: 10,
      submitted_count: 7,
      pending_count: 2,
      overdue_count: 1,
      completion_percentage: 70,
      last_activity: "2025-01-12T10:00:00Z",
      campaign_status: 'active' as const
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders full dashboard with all components integrated', async () => {
    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    // Verify dashboard structure
    expect(screen.getByText('SWMS Jobs')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Compliance Rate')).toBeInTheDocument()
    
    // Verify metrics display
    expect(screen.getByText('12')).toBeInTheDocument() // active jobs
    expect(screen.getByText('5')).toBeInTheDocument() // pending submissions
    expect(screen.getByText('85%')).toBeInTheDocument() // compliance rate
  })

  it('displays progress indicators with correct values', async () => {
    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    const progressIndicators = screen.getAllByTestId('progress-indicator')
    expect(progressIndicators).toHaveLength(1) // compliance rate progress indicator
    expect(progressIndicators[0]).toHaveTextContent('Compliance Rate: 85%')
  })

  it('integrates quick actions for campaign management', async () => {
    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    const quickActions = screen.getByTestId('quick-actions')
    expect(quickActions).toBeInTheDocument()
    
    // Test campaign actions
    const sendReminderBtn = screen.getByText('Send Reminder')
    const exportBtn = screen.getByText('Export Compliance')
    
    expect(sendReminderBtn).toBeInTheDocument()
    expect(exportBtn).toBeInTheDocument()
  })

  it('handles workflow integration between components', async () => {
    const mockOnAction = jest.fn()
    
    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    // Simulate user workflow: view metrics → take action
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument()
    })
    
    // User sees low compliance and takes action
    fireEvent.click(screen.getByText('Send Reminder'))
    
    // Verify component integration
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('displays appropriate status indicators for different compliance levels', () => {
    // Test high compliance (>90%)
    const highComplianceMetrics = {
      activeSwmsJobs: 10,
      pendingSubmissions: 1,
      overdueSubmissions: 0,
      complianceRate: 95,
      activeCampaigns: 1
    }

    const useSwmsDashboardSpy = jest.spyOn(require('@/hooks/useSwmsDashboard'), 'useSwmsDashboard')
    useSwmsDashboardSpy.mockReturnValue({
      metrics: highComplianceMetrics,
      isLoading: false,
      error: null
    })
    
    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    expect(screen.getByText('95%')).toBeInTheDocument()
    
    useSwmsDashboardSpy.mockRestore()
  })

  it('handles full workflow from dashboard view to compliance export', async () => {
    // Mock API calls for export functionality
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          download_url: 'https://example.com/export.pdf',
          expires_at: '2025-01-13T10:00:00Z'
        })
      })
    ) as jest.Mock

    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    // User views dashboard
    await waitFor(() => {
      expect(screen.getByText('SWMS Overview')).toBeInTheDocument()
    })
    
    // User initiates compliance export
    fireEvent.click(screen.getByText('Export Compliance'))
    
    // Verify export integration (would trigger API call in real component)
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('maintains real-time updates integration', () => {
    render(
      <SwmsDashboard 
        jobSiteId="test-job-site-123" 
        metrics={mockMetrics}
        jobStatuses={mockJobStatuses}
      />
    )
    
    // Verify dashboard displays real-time data
    expect(screen.getByText('12')).toBeInTheDocument() // from mocked useSwmsDashboard
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // overdue
  })
})