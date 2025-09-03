'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Using native state management for collapsible functionality
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Users, 
  Phone, 
  Mail, 
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react'
import { ContractorWithWorkerCount } from '@/types/contractors'
import { ContractorFilters } from './ContractorsFilter'
import DeleteContractorButton from './DeleteContractorButton'

interface Worker {
  id: string
  name: string
  email: string
  phone?: string
  position?: string
  white_card_expires?: string
  active: boolean
}

interface ContractorsListProps {
  contractors: ContractorWithWorkerCount[]
  filters?: ContractorFilters
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  } catch {
    return '—'
  }
}

export default function ContractorsList({ contractors, filters }: ContractorsListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [workersData, setWorkersData] = useState<Record<string, Worker[]>>({})
  const [loadingWorkers, setLoadingWorkers] = useState<Set<string>>(new Set())

  // Filter contractors based on current filters
  const filteredContractors = contractors.filter(contractor => {
    if (!filters) return true

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

  const toggleRow = async (contractorId: string) => {
    const newExpanded = new Set(expandedRows)
    
    if (expandedRows.has(contractorId)) {
      newExpanded.delete(contractorId)
    } else {
      newExpanded.add(contractorId)
      
      // Load workers data if not already loaded
      if (!workersData[contractorId]) {
        setLoadingWorkers(prev => new Set(prev).add(contractorId))
        
        try {
          // This would be replaced with actual API call
          // For now, using placeholder data
          await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
          
          setWorkersData(prev => ({
            ...prev,
            [contractorId]: [
              {
                id: '1',
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '0412 345 678',
                position: 'Site Supervisor',
                white_card_expires: '2024-12-15',
                active: true
              },
              {
                id: '2', 
                name: 'Jane Wilson',
                email: 'jane.wilson@email.com',
                position: 'Construction Worker',
                white_card_expires: '2024-11-30',
                active: true
              }
            ]
          }))
        } catch (error) {
          console.error('Error loading workers:', error)
        } finally {
          setLoadingWorkers(prev => {
            const newLoading = new Set(prev)
            newLoading.delete(contractorId)
            return newLoading
          })
        }
      }
    }
    
    setExpandedRows(newExpanded)
  }

  if (filteredContractors.length === 0 && contractors.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contractors yet</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Add your first contractor company to manage employee relationships
          </p>
          <Button asChild>
            <Link href="/admin/contractors/new">
              <Building2 className="mr-2 h-4 w-4" />
              Add First Contractor
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show "no results" message when filters are applied but no matches
  if (filteredContractors.length === 0 && contractors.length > 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contractors match your filters</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Try adjusting your search or filter criteria
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredContractors.map((contractor) => {
        const isExpanded = expandedRows.has(contractor.id)
        const workers = workersData[contractor.id] || []
        const isLoadingWorkers = loadingWorkers.has(contractor.id)

        return (
          <div key={contractor.id}>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader 
                className="cursor-pointer pb-3 hover:bg-gray-50 transition-colors"
                onClick={() => toggleRow(contractor.id)}
              >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <CardTitle className="text-lg">{contractor.name}</CardTitle>
                        <div className="flex items-center gap-3 mt-1">
                          {contractor.active ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                          
                          <Badge variant="outline">
                            <Users className="mr-1 h-3 w-3" />
                            {contractor.worker_count} employee{contractor.worker_count !== 1 ? 's' : ''}
                          </Badge>
                          
                          {contractor.abn && (
                            <span className="text-sm text-gray-500">
                              ABN: {contractor.abn}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                        <Link href={`/admin/contractors/${contractor.id}/edit`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      
                      <div onClick={(e) => e.stopPropagation()}>
                        <DeleteContractorButton
                          contractorId={contractor.id}
                          contractorName={contractor.name}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  {/* Contractor Details */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-medium text-gray-900 mb-3">Company Details</h4>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      {/* Contact Email */}
                      {contractor.contact_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{contractor.contact_email}</span>
                        </div>
                      )}
                      
                      {/* Contact Phone */}
                      {contractor.contact_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{contractor.contact_phone}</span>
                        </div>
                      )}
                      
                      {/* Address */}
                      {contractor.address && (
                        <div className="flex items-start gap-2 md:col-span-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-600">{contractor.address}</span>
                        </div>
                      )}
                      
                      {/* Created Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Added {formatDate(contractor.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Employees Section */}
                  {contractor.worker_count > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Employees ({contractor.worker_count})
                      </h4>
                      
                      {isLoadingWorkers ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-sm text-gray-500">Loading employees...</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {workers.map((worker) => (
                            <div key={worker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{worker.name}</span>
                                  {worker.active ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {worker.email}
                                    </span>
                                    {worker.phone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {worker.phone}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {worker.position && (
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {worker.position}
                                    </div>
                                  )}
                                  
                                  {worker.white_card_expires && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      White Card expires: {formatDate(worker.white_card_expires)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/workers/${worker.id}`}>
                                  <Edit className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {contractor.worker_count === 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="text-center py-6">
                        <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No employees assigned to this contractor</p>
                        <Button variant="link" size="sm" asChild className="mt-2">
                          <Link href="/admin/workers">
                            Manage Workers
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}