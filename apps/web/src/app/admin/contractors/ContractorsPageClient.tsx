'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Building2, Users, CheckCircle, XCircle } from 'lucide-react'
import { ContractorWithWorkerCount } from '@/types/contractors'
import ContractorsList from './ContractorsList'
import ContractorsFilter, { ContractorFilters } from './ContractorsFilter'

interface ContractorsPageClientProps {
  contractors: ContractorWithWorkerCount[]
}

export default function ContractorsPageClient({ contractors }: ContractorsPageClientProps) {
  const [filters, setFilters] = useState<ContractorFilters>({
    search: '',
    activeStatus: 'all',
    employeeCount: 'all'
  })

  // Filter contractors based on current filters
  const filteredContractors = useMemo(() => {
    return contractors.filter(contractor => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const nameMatch = contractor.name.toLowerCase().includes(searchLower)
        const abnMatch = contractor.abn?.toLowerCase().includes(searchLower) || false
        if (!nameMatch && !abnMatch) return false
      }

      // Active status filter
      if (filters.activeStatus !== 'all') {
        if (filters.activeStatus === 'active' && !contractor.active) return false
        if (filters.activeStatus === 'inactive' && contractor.active) return false
      }

      // Employee count filter
      if (filters.employeeCount !== 'all') {
        const count = contractor.worker_count
        if (filters.employeeCount === '0' && count !== 0) return false
        if (filters.employeeCount === '1-5' && (count < 1 || count > 5)) return false
        if (filters.employeeCount === '5+' && count <= 5) return false
      }

      return true
    })
  }, [contractors, filters])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Manage contractor companies and their employee relationships
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/contractors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Contractor
          </Link>
        </Button>
      </div>

      {/* Filters */}
      {contractors.length > 0 && (
        <ContractorsFilter
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filteredContractors.length}
          totalCount={contractors.length}
        />
      )}

      {/* Contractors List */}
      <ContractorsList contractors={filteredContractors} filters={filters} />

      {/* Stats */}
      {contractors.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Contractors</p>
                  <p className="text-2xl font-bold">{contractors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">
                    {contractors.filter(c => c.active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-4">
                  <XCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">
                    {contractors.filter(c => !c.active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">
                    {contractors.reduce((sum, c) => sum + c.worker_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}