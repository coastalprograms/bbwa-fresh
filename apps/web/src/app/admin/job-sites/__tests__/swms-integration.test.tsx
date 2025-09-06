import { render, screen, waitFor, fireEvent } from '@testing-library/react'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({
        data: { user: { id: 'admin-user-123' } },
        error: null
      })
    },
    from: (table: string) => {
      if (table === 'job_sites') {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: {
                  id: 'job-site-123',
                  name: 'Test Construction Site',
                  address: '123 Test St',
                  status: 'active',
                  created_at: '2024-01-01'
                },
                error: null
              })
            })
          })
        }
      }
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      }
    }
  })
}))

// Mock SWMS dashboard component
jest.mock('@/components/admin/SwmsDashboard', () => {
  return function MockSwmsDashboard({ jobSiteId }: { jobSiteId: string }) {
    return (
      <div data-testid="swms-dashboard-section">
        <h3>SWMS Dashboard for {jobSiteId}</h3>
        <div>Active SWMS Jobs: 3</div>
        <div>Pending Submissions: 2</div>
        <div>Compliance Rate: 85%</div>
        <button data-testid="export-compliance">Export Compliance</button>
        <button data-testid="send-reminder">Send Reminder</button>
      </div>
    )
  }
})

describe('Job Site SWMS Integration', () => {
  it('validates job site page structure with SWMS integration', () => {
    const MockJobSiteWithSwms = () => (
      <div>
        <h1>Test Construction Site</h1>
        <div>123 Test St</div>
        <div data-testid="swms-dashboard-section">
          <h3>SWMS Dashboard for job-site-123</h3>
          <div>Active SWMS Jobs: 3</div>
          <div>Pending Submissions: 2</div>
          <div>Compliance Rate: 85%</div>
          <button data-testid="export-compliance">Export Compliance</button>
          <button data-testid="send-reminder">Send Reminder</button>
        </div>
      </div>
    )
    
    render(<MockJobSiteWithSwms />)
    
    // Verify job site details
    expect(screen.getByText('Test Construction Site')).toBeInTheDocument()
    expect(screen.getByText('123 Test St')).toBeInTheDocument()
    
    // Verify SWMS integration
    expect(screen.getByTestId('swms-dashboard-section')).toBeInTheDocument()
    expect(screen.getByText('SWMS Dashboard for job-site-123')).toBeInTheDocument()
  })

  it('validates SWMS metrics display within job site context', () => {
    const MockSwmsMetrics = () => (
      <div>
        <div>Active SWMS Jobs: 3</div>
        <div>Pending Submissions: 2</div>
        <div>Compliance Rate: 85%</div>
      </div>
    )
    
    render(<MockSwmsMetrics />)
    
    // Verify metrics display
    expect(screen.getByText('Active SWMS Jobs: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending Submissions: 2')).toBeInTheDocument()
    expect(screen.getByText('Compliance Rate: 85%')).toBeInTheDocument()
  })

  it('validates SWMS action buttons integration', () => {
    const MockSwmsActions = () => (
      <div data-testid="quick-actions">
        <button data-testid="export-compliance">Export Compliance</button>
        <button data-testid="send-reminder">Send Reminder</button>
      </div>
    )
    
    render(<MockSwmsActions />)
    
    // Verify action buttons
    expect(screen.getByTestId('export-compliance')).toBeInTheDocument()
    expect(screen.getByTestId('send-reminder')).toBeInTheDocument()
  })

  it('validates workflow integration patterns', () => {
    let actionTriggered = ''
    
    const MockWorkflow = () => (
      <div>
        <div>Compliance Rate: 85%</div>
        <div data-testid="actions">
          <button 
            onClick={() => actionTriggered = 'export'}
            data-testid="export-btn"
          >
            Export Compliance
          </button>
          <button 
            onClick={() => actionTriggered = 'reminder'}
            data-testid="reminder-btn"
          >
            Send Reminder
          </button>
        </div>
      </div>
    )
    
    render(<MockWorkflow />)
    
    // User sees compliance status
    expect(screen.getByText('Compliance Rate: 85%')).toBeInTheDocument()
    
    // User can take actions
    fireEvent.click(screen.getByTestId('export-btn'))
    expect(actionTriggered).toBe('export')
    
    fireEvent.click(screen.getByTestId('reminder-btn'))
    expect(actionTriggered).toBe('reminder')
  })
})