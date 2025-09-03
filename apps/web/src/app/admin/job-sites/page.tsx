import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, MapPin, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import DeleteJobSiteButton from './DeleteJobSiteButton'

export const metadata = {
  title: 'Job Sites — Admin',
  description: 'Manage construction job sites and their locations'
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

export default async function JobSitesPage() {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch all job sites (handle missing table gracefully)
  let jobSites: any[] = []
  let tableExists = true
  
  try {
    const { data, error } = await supabase
      .from('job_sites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching job sites:', error)
      // Check if error is due to missing table
      if (error.code === 'PGRST116' || error.message?.includes('relation "job_sites" does not exist')) {
        tableExists = false
      }
    } else {
      jobSites = data || []
    }
  } catch (err) {
    console.error('Error accessing job sites table:', err)
    tableExists = false
  }

  return (
    <AppSidebar title="Job Sites">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Manage construction sites where workers check in
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/job-sites/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Job Site
            </Link>
          </Button>
        </div>

        {/* Job Sites Grid */}
        {!tableExists ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Sites Database Pending</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                The job sites table hasn&apos;t been created yet. Run database migrations to enable job site management.
              </p>
              <div className="text-xs text-orange-600 bg-orange-50 p-3 rounded-md">
                <strong>For developers:</strong> Run <code className="bg-orange-100 px-1 py-0.5 rounded">supabase db push</code> to apply migrations
              </div>
            </CardContent>
          </Card>
        ) : !jobSites || jobSites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No job sites yet</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Add your first job site to enable worker check-ins
              </p>
              <Button asChild>
                <Link href="/admin/job-sites/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Job Site
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobSites.map((site) => (
              <Card key={site.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        {site.active ? (
                          <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Active
                          </div>
                        ) : (
                          <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                            <XCircle className="mr-1 h-3 w-3" />
                            Inactive
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Address */}
                  {site.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-600 line-clamp-2">{site.address}</p>
                    </div>
                  )}
                  
                  {/* Coordinates */}
                  <div className="text-xs text-gray-500 space-y-1">
                    {site.lat && site.lng && (
                      <>
                        <div>Lat: {site.lat.toFixed(6)}</div>
                        <div>Lng: {site.lng.toFixed(6)}</div>
                      </>
                    )}
                    <div>Check-in radius: {site.radius_m || 500}m</div>
                  </div>

                  {/* Created date */}
                  <div className="text-xs text-gray-400">
                    Added {formatDate(site.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/admin/job-sites/${site.id}/edit`}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteJobSiteButton 
                      jobSiteId={site.id} 
                      jobSiteName={site.name}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {jobSites && jobSites.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sites</p>
                    <p className="text-2xl font-bold">{jobSites.length}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Active Sites</p>
                    <p className="text-2xl font-bold">
                      {jobSites.filter(s => s.active).length}
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
                    <p className="text-sm font-medium text-muted-foreground">Inactive Sites</p>
                    <p className="text-2xl font-bold">
                      {jobSites.filter(s => !s.active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppSidebar>
  )
}