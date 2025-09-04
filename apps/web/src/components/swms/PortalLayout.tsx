interface PortalLayoutProps {
  title: string
  children: React.ReactNode
  jobSite: {
    id: string
    name: string
    address: string
    lat: number | null
    lng: number | null
  }
  swmsJob: {
    id: string
    name: string
    description: string | null
    start_date: string
    end_date: string | null
    status: string
    job_site_id: string
    contractor_id: string | null
  }
  contractor: {
    id: string
    company_name: string
    contact_email: string
    abn: string | null
  }
}

export function PortalLayout({ 
  title, 
  children, 
  jobSite, 
  swmsJob, 
  contractor 
}: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Bayside Builders WA
              </h1>
              <p className="text-sm text-gray-600">SWMS Submission Portal</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {contractor.company_name}
              </p>
              <p className="text-xs text-gray-600">
                {contractor.contact_email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Job Site: {jobSite.name}</span>
            <span>•</span>
            <span>SWMS: {swmsJob.name}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              swmsJob.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {swmsJob.status.charAt(0).toUpperCase() + swmsJob.status.slice(1)}
            </span>
          </div>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              For technical support or questions about this submission portal,
              please contact{' '}
              <a 
                href="mailto:frank@baysidebuilders.com.au" 
                className="text-blue-600 hover:underline"
              >
                frank@baysidebuilders.com.au
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}