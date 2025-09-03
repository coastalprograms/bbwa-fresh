import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import KpiCard from './_components/KpiCard'
import RecentCheckIns from './_components/RecentCheckIns'
import UpcomingExpirations from './_components/UpcomingExpirations'
import type { RecentCheckIn, UpcomingExpiration } from '@/types/dashboard'
import { Users, ShieldCheck } from 'lucide-react'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Admin Dashboard — Bayside Builders WA',
  description: 'Overview of worker compliance, recent check-ins, and upcoming certification expirations'
}

export default async function AdminPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Calculate date ranges
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const today = now.toISOString().split('T')[0]
  const in30Days = thirtyDaysFromNow.toISOString().split('T')[0]

  try {
    // Fetch active workers count (workers with valid certifications)
    const { data: activeWorkersData, error: activeWorkersError } = await supabase
      .from('certifications')
      .select('worker_id, workers!inner(id)')
      .eq('type', 'White Card')
      .eq('status', 'Valid')
      .gte('expiry_date', today)

    const activeWorkers = activeWorkersData?.length || 0

    // Fetch recent check-ins (last 24 hours)
    const { data: rawCheckIns, error: checkInsError } = await supabase
      .from('site_attendances')
      .select(`
        id,
        checked_in_at,
        workers!inner(email, first_name, last_name),
        job_sites!inner(name)
      `)
      .gte('checked_in_at', twentyFourHoursAgo.toISOString())
      .order('checked_in_at', { ascending: false })
      .limit(10)

    // Transform the data to match our interface
    const recentCheckIns: RecentCheckIn[] = rawCheckIns?.map((item: any) => ({
      id: item.id,
      checked_in_at: item.checked_in_at,
      worker: Array.isArray(item.workers) ? item.workers[0] : item.workers,
      job_site: Array.isArray(item.job_sites) ? item.job_sites[0] : item.job_sites
    })) || []

    // Fetch upcoming expirations (next 30 days)
    const { data: upcomingExpirations, error: expirationsError } = await supabase
      .from('certifications')
      .select(`
        id,
        expiry_date,
        type,
        workers!inner(id, email, first_name, last_name)
      `)
      .eq('type', 'White Card')
      .eq('status', 'Valid')
      .gte('expiry_date', today)
      .lte('expiry_date', in30Days)
      .order('expiry_date', { ascending: true })

    // Transform upcoming expirations data to match expected interface
    const transformedExpirations: UpcomingExpiration[] = upcomingExpirations?.map(cert => ({
      id: cert.id,
      expiry_date: cert.expiry_date || '',
      worker: Array.isArray(cert.workers) ? cert.workers[0] : cert.workers,
      certification_type: cert.type
    })) || []

    // Log any errors but don't break the page
    if (activeWorkersError) console.error('Error fetching active workers:', activeWorkersError)
    if (checkInsError) console.error('Error fetching recent check-ins:', checkInsError) 
    if (expirationsError) console.error('Error fetching upcoming expirations:', expirationsError)

    return (
      <AppSidebar>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Workers</p>
                        <p className="text-2xl font-bold">{activeWorkers}</p>
                        <p className="text-xs text-muted-foreground">Currently on-site</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recent Check-ins</p>
                        <p className="text-2xl font-bold">{recentCheckIns.length}</p>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-4">
                        <ShieldCheck className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                        <p className="text-2xl font-bold">{transformedExpirations.length}</p>
                        <p className="text-xs text-muted-foreground">Next 30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Recent Check-ins</h3>
                      <p className="text-sm text-muted-foreground">Workers who checked in recently</p>
                    </div>
                    <RecentCheckIns items={recentCheckIns} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Upcoming Expirations</h3>
                      <p className="text-sm text-muted-foreground">Certifications expiring soon</p>
                    </div>
                    <UpcomingExpirations items={transformedExpirations} />
                  </CardContent>
                </Card>
              </div>
      </AppSidebar>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    
    return (
      <AppSidebar>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-3">Error loading dashboard</h3>
            <p className="text-sm text-muted-foreground">{String(error)}</p>
          </CardContent>
        </Card>
      </AppSidebar>
    )
  }
}