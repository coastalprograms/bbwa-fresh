'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface ContractorFilters {
  search: string
  activeStatus: 'all' | 'active' | 'inactive'
  employeeCount: 'all' | '0' | '1-5' | '5+'
}

interface ContractorsFilterProps {
  filters: ContractorFilters
  onFiltersChange: (filters: ContractorFilters) => void
  resultsCount: number
  totalCount: number
}

export default function ContractorsFilter({ 
  filters, 
  onFiltersChange, 
  resultsCount, 
  totalCount 
}: ContractorsFilterProps) {
  const [localSearch, setLocalSearch] = useState(filters.search)

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    // Debounced search - update filters after user stops typing
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value })
    }, 300)
    
    // Clear timeout on subsequent changes
    return () => clearTimeout(timeoutId)
  }

  const handleActiveStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      activeStatus: value as ContractorFilters['activeStatus'] 
    })
  }

  const handleEmployeeCountChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      employeeCount: value as ContractorFilters['employeeCount'] 
    })
  }

  const clearFilters = () => {
    setLocalSearch('')
    onFiltersChange({
      search: '',
      activeStatus: 'all',
      employeeCount: 'all'
    })
  }

  const hasActiveFilters = filters.search || filters.activeStatus !== 'all' || filters.employeeCount !== 'all'
  const isFiltered = resultsCount !== totalCount

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium">Filter Contractors</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        {isFiltered && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {resultsCount} of {totalCount} contractors
            </Badge>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="contractor-search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contractor-search"
              type="text"
              placeholder="Search by name or ABN..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Active Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="active-status" className="text-sm font-medium">
            Status
          </Label>
          <Select value={filters.activeStatus} onValueChange={handleActiveStatusChange}>
            <SelectTrigger id="active-status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contractors</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Employee Count Filter */}
        <div className="space-y-2">
          <Label htmlFor="employee-count" className="text-sm font-medium">
            Employees
          </Label>
          <Select value={filters.employeeCount} onValueChange={handleEmployeeCountChange}>
            <SelectTrigger id="employee-count">
              <SelectValue placeholder="Filter by employee count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="0">No Employees (0)</SelectItem>
              <SelectItem value="1-5">Small Teams (1-5)</SelectItem>
              <SelectItem value="5+">Large Teams (5+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: &quot;{filters.search}&quot;
              <button
                onClick={() => {
                  setLocalSearch('')
                  onFiltersChange({ ...filters, search: '' })
                }}
                className="ml-1 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.activeStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.activeStatus === 'active' ? 'Active' : 'Inactive'}
              <button
                onClick={() => onFiltersChange({ ...filters, activeStatus: 'all' })}
                className="ml-1 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.employeeCount !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Employees: {
                filters.employeeCount === '0' ? 'None' :
                filters.employeeCount === '1-5' ? '1-5' :
                '5+'
              }
              <button
                onClick={() => onFiltersChange({ ...filters, employeeCount: 'all' })}
                className="ml-1 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}