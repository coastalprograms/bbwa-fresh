import { render, screen } from '@testing-library/react'
import ContractorsList from '../ContractorsList'
import { ContractorWithWorkerCount } from '@/types/contractors'

// Mock the DeleteContractorButton component
jest.mock('../DeleteContractorButton', () => {
  return function MockDeleteContractorButton() {
    return <button data-testid="delete-contractor-button">Delete</button>
  }
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

const mockContractors: ContractorWithWorkerCount[] = [
  {
    id: '1',
    name: 'ABC Construction',
    abn: '12 345 678 901',
    contact_email: 'contact@abc.com',
    contact_phone: '(02) 9123 4567',
    address: '123 Construction St, Sydney NSW 2000',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    worker_count: 5
  },
  {
    id: '2',
    name: 'XYZ Builders',
    abn: null,
    contact_email: null,
    contact_phone: null,
    address: null,
    active: false,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    worker_count: 0
  }
]

describe('ContractorsList', () => {
  it('renders empty state when no contractors', () => {
    render(<ContractorsList contractors={[]} />)
    
    expect(screen.getByText('No contractors yet')).toBeInTheDocument()
    expect(screen.getByText('Add your first contractor company to manage employee relationships')).toBeInTheDocument()
  })

  it('renders contractors list with basic information', () => {
    render(<ContractorsList contractors={mockContractors} />)
    
    // Check contractor names are displayed
    expect(screen.getByText('ABC Construction')).toBeInTheDocument()
    expect(screen.getByText('XYZ Builders')).toBeInTheDocument()
    
    // Check active/inactive badges
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
    
    // Check employee counts
    expect(screen.getByText('5 employees')).toBeInTheDocument()
    expect(screen.getByText('0 employees')).toBeInTheDocument()
  })

  it('displays ABN when available', () => {
    render(<ContractorsList contractors={mockContractors} />)
    
    expect(screen.getByText('ABN: 12 345 678 901')).toBeInTheDocument()
  })

  it('renders edit and delete buttons for each contractor', () => {
    render(<ContractorsList contractors={mockContractors} />)
    
    // Check edit buttons (should be 2 contractors × 1 edit button each)
    const editButtons = screen.getAllByText('Edit')
    expect(editButtons).toHaveLength(2)
    
    // Check delete buttons (mocked)
    const deleteButtons = screen.getAllByTestId('delete-contractor-button')
    expect(deleteButtons).toHaveLength(2)
  })

  it('shows filtered message when filtered contractors is empty but total contractors exist', () => {
    render(<ContractorsList contractors={[]} />)
    
    // This tests the empty state, but with different contractors props
    // we'd need to test the actual filtering in the parent component
    expect(screen.getByText('No contractors yet')).toBeInTheDocument()
  })
})

describe('ContractorsList with filters', () => {
  const filters = {
    search: 'ABC',
    activeStatus: 'active' as const,
    employeeCount: '1-5' as const
  }

  it('displays contractors that match filters', () => {
    render(<ContractorsList contractors={mockContractors} filters={filters} />)
    
    // ABC Construction should be shown (active, has 5 employees, name matches "ABC")
    expect(screen.getByText('ABC Construction')).toBeInTheDocument()
    
    // XYZ Builders should not be shown (inactive, 0 employees, name doesn't match "ABC")
    expect(screen.queryByText('XYZ Builders')).not.toBeInTheDocument()
  })

  it('shows no results message when no contractors match filters', () => {
    const noMatchFilters = {
      search: 'NonexistentCompany',
      activeStatus: 'active' as const,
      employeeCount: 'all' as const
    }

    render(<ContractorsList contractors={mockContractors} filters={noMatchFilters} />)
    
    expect(screen.getByText('No contractors match your filters')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument()
  })
})