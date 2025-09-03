'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Calendar, Users, FileText, Edit, Eye } from 'lucide-react'
import type { SwmsJob, SwmsSubmission } from '@/types/swms'

interface SwmsJobsSectionProps {
  jobSiteId: string
  swmsJobs: SwmsJob[]
  className?: string
}

function getStatusBadge(status: SwmsJob['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
    case 'completed':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Completed</Badge>
    case 'planned':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Planned</Badge>
    case 'cancelled':
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
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

export function SwmsJobsSection({ jobSiteId, swmsJobs, className }: SwmsJobsSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              SWMS Jobs
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage Safe Work Method Statements for this job site
            </p>
          </div>
          <Button asChild>
            <Link href={`/admin/job-sites/${jobSiteId}/swms/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Create SWMS Job
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {swmsJobs && swmsJobs.length > 0 ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {swmsJobs.filter(j => j.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {swmsJobs.filter(j => j.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {swmsJobs.filter(j => j.status === 'planned').length}
                </p>
                <p className="text-sm text-gray-600">Planned</p>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swmsJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.name}</p>
                          {job.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {job.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(job.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(job.start_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.end_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(job.end_date)}
                          </div>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/job-sites/${jobSiteId}/swms/${job.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/job-sites/${jobSiteId}/swms/${job.id}/edit`}>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No SWMS Jobs</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Create your first SWMS job to start managing Safe Work Method Statement submissions for this job site.
            </p>
            <Button asChild>
              <Link href={`/admin/job-sites/${jobSiteId}/swms/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Create First SWMS Job
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}