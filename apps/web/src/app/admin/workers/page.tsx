import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'

export const metadata = {
  title: 'Workers — Admin',
  description: 'Manage worker compliance and certifications'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Valid':
      return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Valid</span>
    case 'Expired':
      return <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">Expired</span>
    default:
      return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">Awaiting Review</span>
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return '—'
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

export default async function AdminWorkersPage() {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch workers with their latest certification status and contractor relationship
  const { data: workers, error } = await supabase
    .from('workers')
    .select(`
      id,
      first_name,
      last_name,
      email,
      contractor_id,
      contractors(
        id,
        name,
        abn
      ),
      certifications(
        status,
        expiry_date,
        created_at
      )
    `)
    .order('first_name') as { data: any[] | null; error: any }

  if (error) {
    throw new Error('Failed to load workers')
  }

  // Process workers data to get latest certification status
  const processedWorkers = workers?.map(worker => {
    // Get latest White Card certification
    const whiteCardCerts = worker.certifications?.filter((cert: any) => cert.status) || []
    const latestCert = whiteCardCerts.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

    return {
      worker_id: worker.id,
      first_name: worker.first_name,
      last_name: worker.last_name,
      email: worker.email,
      contractor_name: worker.contractors?.name || 'Individual Contractor',
      contractor_abn: worker.contractors?.abn,
      status: latestCert?.status || 'Awaiting Review',
      expiry_date: latestCert?.expiry_date
    }
  }) || []

  return (
    <AppSidebar title="Workers">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Manage worker compliance and certifications</p>
      </div>

      {!processedWorkers || processedWorkers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No workers found</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    White Card Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedWorkers.map((worker) => (
                  <tr key={worker.worker_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/admin/workers/${worker.worker_id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        {`${worker.first_name} ${worker.last_name || ''}`.trim() || worker.email}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.contractor_name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(worker.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(worker.expiry_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppSidebar>
  )
}