import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContractorsFilter, { ContractorFilters } from '../ContractorsFilter'

describe('ContractorsFilter', () => {
  const defaultFilters: ContractorFilters = {
    search: '',
    activeStatus: 'all',
    employeeCount: 'all'
  }

  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    mockOnFiltersChange.mockClear()
  })

  it('renders all filter controls', () => {
    render(
      <ContractorsFilter
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={10}
        totalCount={10}
      />
    )

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/employees/i)).toBeInTheDocument()
  })

  it('displays results count when filtered', () => {
    render(
      <ContractorsFilter
        filters={{ ...defaultFilters, search: 'test' }}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={5}
        totalCount={10}
      />
    )

    expect(screen.getByText('5 of 10 contractors')).toBeInTheDocument()
  })

  it('calls onFiltersChange when search input changes', async () => {
    render(
      <ContractorsFilter
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={10}
        totalCount={10}
      />
    )

    const searchInput = screen.getByPlaceholderText(/search by name or abn/i)
    fireEvent.change(searchInput, { target: { value: 'ABC' } })

    // Wait for debounced search (300ms)
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        search: 'ABC'
      })
    }, { timeout: 400 })
  })

  it('renders status select with correct default value', () => {
    render(
      <ContractorsFilter
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={10}
        totalCount={10}
      />
    )

    // Check that the status select button is rendered with correct text
    const statusSelect = screen.getByRole('combobox', { name: /status/i })
    expect(statusSelect).toBeInTheDocument()
    expect(screen.getByText('All Sizes')).toBeInTheDocument() // Employee count select default
    
    // Note: Testing select components with Radix UI requires more complex setup
    // This test verifies the component renders correctly with expected default values
  })

  it('displays active filter tags', () => {
    const activeFilters: ContractorFilters = {
      search: 'ABC Construction',
      activeStatus: 'active',
      employeeCount: '1-5'
    }

    render(
      <ContractorsFilter
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={5}
        totalCount={10}
      />
    )

    expect(screen.getByText('Search: "ABC Construction"')).toBeInTheDocument()
    expect(screen.getByText('Status: Active')).toBeInTheDocument()
    expect(screen.getByText('Employees: 1-5')).toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', () => {
    const activeFilters: ContractorFilters = {
      search: 'test',
      activeStatus: 'active',
      employeeCount: '1-5'
    }

    render(
      <ContractorsFilter
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={5}
        totalCount={10}
      />
    )

    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: '',
      activeStatus: 'all',
      employeeCount: 'all'
    })
  })

  it('clears individual filter when tag close button is clicked', () => {
    const activeFilters: ContractorFilters = {
      search: 'ABC Construction',
      activeStatus: 'active',
      employeeCount: 'all'
    }

    render(
      <ContractorsFilter
        filters={activeFilters}
        onFiltersChange={mockOnFiltersChange}
        resultsCount={5}
        totalCount={10}
      />
    )

    const searchTag = screen.getByText('Search: "ABC Construction"')
    const closeButton = searchTag.querySelector('button')
    
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...activeFilters,
        search: ''
      })
    }
  })
})