import { render, screen, waitFor } from '@testing-library/react'
import AdminWorkersPage from '../page'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

// Mock the AppSidebar component
jest.mock('@/components/admin/AppSidebar', () => {
  return function MockAppSidebar({ children, title }: { children: React.ReactNode; title: string }) {
    return (
      <div data-testid="app-sidebar">
        <h1>{title}</h1>
        {children}
      </div>
    )
  }
})

const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
}

const mockWorkerData = [
  {
    id: 'worker-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    contractor_id: 'contractor-1',
    contractors: {
      name: 'ABC Construction',
      abn: '12345678901'
    },
    certifications: [
      {
        status: 'Valid',
        expiry_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: 'worker-2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    contractor_id: 'contractor-2',
    contractors: {
      name: 'XYZ Builders',
      abn: '98765432109'
    },
    certifications: [
      {
        status: 'Expired',
        expiry_date: '2023-12-31',
        created_at: '2024-01-01T00:00:00Z'
      }
    ]
  }
]

describe('AdminWorkersPage', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
    
    // Mock successful auth
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    })
    
    // Mock successful workers query
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockWorkerData,
          error: null
        })
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render workers with contractor names instead of company field', async () => {
    render(await AdminWorkersPage())

    // Check that contractors are displayed correctly
    await waitFor(() => {
      expect(screen.getByText('ABC Construction')).toBeInTheDocument()
      expect(screen.getByText('XYZ Builders')).toBeInTheDocument()
    })

    // Check that the table header shows "Contractor" instead of "Company"
    expect(screen.getByText('Contractor')).toBeInTheDocument()
    expect(screen.queryByText('Company')).not.toBeInTheDocument()
  })

  it('should query contractor relationship correctly', async () => {
    render(await AdminWorkersPage())

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('workers')
    })

    // Verify the select includes contractor relationship
    const selectCall = mockSupabase.from().select
    expect(selectCall).toHaveBeenCalledWith(expect.stringContaining('contractor_id'))
    expect(selectCall).toHaveBeenCalledWith(expect.stringContaining('contractors('))
  })

  it('should display worker certification status badges correctly', async () => {
    render(await AdminWorkersPage())

    await waitFor(() => {
      expect(screen.getByText('Valid')).toBeInTheDocument()
      expect(screen.getByText('Expired')).toBeInTheDocument()
    })
  })

  it('should handle workers without contractors gracefully', async () => {
    const workersWithoutContractors = [
      {
        ...mockWorkerData[0],
        contractors: null
      }
    ]

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: workersWithoutContractors,
          error: null
        })
      })
    })

    render(await AdminWorkersPage())

    await waitFor(() => {
      expect(screen.getByText('Individual Contractor')).toBeInTheDocument()
    })
  })

  it('should display worker links correctly', async () => {
    render(await AdminWorkersPage())

    await waitFor(() => {
      const workerLink = screen.getByRole('link', { name: 'John Doe' })
      expect(workerLink).toHaveAttribute('href', '/admin/workers/worker-1')
    })
  })
})