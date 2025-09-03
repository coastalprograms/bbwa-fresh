import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { UpdateComplianceForm } from './update-form'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { Worker, Certification } from '@/types/workers'

export const metadata = {
  title: 'Worker — Admin',
  description: 'View and manage worker certification details'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Valid':
      return <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Valid</span>
    case 'Expired':
      return <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">Expired</span>
    default:
      return <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">Awaiting Review</span>
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

function formatDateTime(dateString: string) {
  try {
    return new Date(dateString).toLocaleString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

interface WorkerDetailPageProps {
  params: {
    id: string
  }
}

export default async function WorkerDetailPage({ params }: WorkerDetailPageProps) {
  const supabase = createClient()

  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch worker details with all fields and contractor relationship
  const { data: worker, error: workerError } = await supabase
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
        abn,
        contact_email,
        contact_phone
      ),
      trade,
      mobile,
      position,
      allergies,
      white_card,
      other_license,
      other_license_details,
      emergency_name,
      emergency_phone,
      emergency_relationship,
      no_alcohol_drugs,
      electrical_equipment_responsibility,
      hazardous_substances_understanding,
      use_ppe_when_necessary,
      high_risk_work_meeting_understanding,
      appropriate_signage_display,
      no_unauthorized_visitors_understanding,
      housekeeping_responsibility,
      employer_provided_training,
      employer_provided_swms,
      discussed_swms_with_employer,
      pre_start_meeting_understanding,
      read_safety_booklet,
      understand_site_management_plan,
      induction_completed,
      induction_completed_at,
      created_at
    `)
    .eq('id', params.id)
    .single() as { data: any | null; error: any }

  if (workerError || !worker) {
    notFound()
  }

  // Fetch latest certification
  const { data: latestCert, error: latestCertError } = await supabase
    .from('certifications')
    .select('*')
    .eq('worker_id', params.id)
    .order('created_at', { ascending: false })
    .maybeSingle() as { data: Certification | null; error: any }

  // Fetch all certifications for history with file URLs
  const { data: certifications, error: certsError } = await supabase
    .from('certifications')
    .select(`
      *,
      file_url,
      white_card_path
    `)
    .eq('worker_id', params.id)
    .order('created_at', { ascending: false }) as { data: Certification[] | null; error: any }

  // Fetch worker activity (site attendances)
  const { data: activities, error: activitiesError } = await supabase
    .from('site_attendances')
    .select(`
      id,
      checked_in_at,
      job_site_id,
      job_sites(
        name,
        address
      )
    `)
    .eq('worker_id', params.id)
    .order('checked_in_at', { ascending: false })
    .limit(10) as { data: any[] | null; error: any }

  // Calculate verification status
  const isFullyVerified = worker.induction_completed && 
                          latestCert?.status === 'Valid' &&
                          worker.no_alcohol_drugs &&
                          worker.use_ppe_when_necessary &&
                          worker.read_safety_booklet

  const lastActivity = activities && activities.length > 0 
    ? activities[0].checked_in_at 
    : worker.created_at

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/admin/workers"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Workers
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{worker.first_name} {worker.last_name || ''}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{worker.first_name} {worker.last_name || ''}</h1>
              <p className="mt-1 text-gray-600">{worker.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              {isFullyVerified ? (
                <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fully Verified
                </div>
              ) : (
                <div className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Needs Verification
                </div>
              )}
              {activities && activities.length > 0 && (
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  {activities.length} Site Visits
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worker Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{worker.first_name} {worker.last_name || ''}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{worker.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contractor</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {worker.contractors?.name || 'Individual Contractor'}
                  {worker.contractors?.abn && (
                    <span className="text-gray-500 text-xs ml-2">ABN: {worker.contractors.abn}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trade</dt>
                <dd className="mt-1 text-sm text-gray-900">{worker.trade || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                <dd className="mt-1 text-sm text-gray-900">{worker.mobile || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900">{worker.position || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Registered</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(worker.created_at)}</dd>
              </div>
            </dl>
            {worker.allergies && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Allergies & Medical Concerns</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  ⚠️ {worker.allergies}
                </dd>
              </div>
            )}
          </div>

          {/* 🚨 EMERGENCY CONTACT - PRIORITY SECTION */}
          {(worker.emergency_name || worker.emergency_phone) && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🚨</span>
                Emergency Contact
              </h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-red-700">Name</dt>
                  <dd className="mt-1 text-sm font-semibold text-red-900">{worker.emergency_name || '—'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-red-700">Phone</dt>
                  <dd className="mt-1 text-sm font-semibold text-red-900">
                    {worker.emergency_phone ? (
                      <a href={`tel:${worker.emergency_phone}`} className="hover:underline">
                        {worker.emergency_phone}
                      </a>
                    ) : '—'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-red-700">Relationship</dt>
                  <dd className="mt-1 text-sm font-semibold text-red-900">{worker.emergency_relationship || '—'}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Additional Certifications */}
          {(worker.other_license || worker.other_license_details) && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Certifications</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Has Other Licenses</dt>
                  <dd className="mt-1 text-sm text-gray-900">{worker.other_license ? 'Yes' : 'No'}</dd>
                </div>
                {worker.other_license_details && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">License Details</dt>
                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-3">{worker.other_license_details}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Safety Compliance Summary */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Safety Compliance Status</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alcohol/Drug Policy</span>
                <span className={`text-sm font-medium ${worker.no_alcohol_drugs ? 'text-green-600' : 'text-red-600'}`}>
                  {worker.no_alcohol_drugs ? '✅ Acknowledged' : '❌ Not Acknowledged'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PPE Usage</span>
                <span className={`text-sm font-medium ${worker.use_ppe_when_necessary ? 'text-green-600' : 'text-red-600'}`}>
                  {worker.use_ppe_when_necessary ? '✅ Acknowledged' : '❌ Not Acknowledged'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Safety Training</span>
                <span className={`text-sm font-medium ${worker.employer_provided_training ? 'text-green-600' : 'text-red-600'}`}>
                  {worker.employer_provided_training ? '✅ Completed' : '❌ Not Completed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Safety Booklet</span>
                <span className={`text-sm font-medium ${worker.read_safety_booklet ? 'text-green-600' : 'text-red-600'}`}>
                  {worker.read_safety_booklet ? '✅ Read' : '❌ Not Read'}
                </span>
              </div>
              <div className="flex items-center justify-between sm:col-span-2">
                <span className="text-sm text-gray-600">Induction Completed</span>
                <span className={`text-sm font-medium ${worker.induction_completed ? 'text-green-600' : 'text-red-600'}`}>
                  {worker.induction_completed ? '✅ Completed' : '❌ Not Completed'}
                  {worker.induction_completed_at && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({formatDate(worker.induction_completed_at)})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Current Certification Status */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Certification Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">White Card Status:</span>
                  {getStatusBadge(latestCert?.status || 'Awaiting Review')}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Expiry Date: <span className="font-medium text-gray-900">{formatDate(latestCert?.expiry_date)}</span>
                </div>
                {latestCert?.created_at && (
                  <div className="mt-1 text-xs text-gray-400">
                    Last updated: {formatDateTime(latestCert.created_at)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Images */}
          {certifications && certifications.length > 0 && certifications.some(cert => cert.file_url || cert.white_card_path) && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Certificate Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {certifications
                  .filter(cert => cert.file_url || cert.white_card_path)
                  .map((cert) => {
                    const imageUrl = cert.file_url || cert.white_card_path
                    if (!imageUrl) return null
                    
                    return (
                      <div key={cert.id} className="group relative">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
                              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                                {imageUrl.toLowerCase().includes('.pdf') ? (
                                  <div className="text-center p-4">
                                    <svg className="w-12 h-12 mx-auto text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 3h8v2H6V5zm0 4h8v2H6V9zm0 4h5v2H6v-2z"/>
                                    </svg>
                                    <span className="text-sm text-gray-600">PDF Certificate</span>
                                  </div>
                                ) : (
                                  <Image
                                    src={imageUrl}
                                    alt={`Certificate for ${worker.first_name} ${worker.last_name}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {cert.type || 'Certificate'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDate(cert.created_at)}
                                    </p>
                                  </div>
                                  {getStatusBadge(cert.status || 'Awaiting Review')}
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                            <DialogHeader className="p-6 pb-0">
                              <DialogTitle>
                                {cert.type || 'Certificate'} - {worker.first_name} {worker.last_name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="p-6 pt-0">
                              <div className="flex flex-col space-y-4">
                                <div className="bg-gray-50 rounded-lg overflow-hidden max-h-[60vh] flex items-center justify-center">
                                  {imageUrl.toLowerCase().includes('.pdf') ? (
                                    <div className="text-center p-8">
                                      <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 3h8v2H6V5zm0 4h8v2H6V9zm0 4h5v2H6v-2z"/>
                                      </svg>
                                      <p className="text-lg font-medium text-gray-900 mb-2">PDF Certificate</p>
                                      <p className="text-sm text-gray-600">This is a PDF document. Click download to view the full certificate.</p>
                                    </div>
                                  ) : (
                                    <Image
                                      src={imageUrl}
                                      alt={`Certificate for ${worker.first_name} ${worker.last_name}`}
                                      width={800}
                                      height={600}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="flex items-center space-x-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Status</p>
                                      {getStatusBadge(cert.status || 'Awaiting Review')}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Expiry Date</p>
                                      <p className="text-sm text-gray-600">{formatDate(cert.expiry_date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Uploaded</p>
                                      <p className="text-sm text-gray-600">{formatDateTime(cert.created_at)}</p>
                                    </div>
                                  </div>
                                  <Button asChild variant="outline">
                                    <a href={imageUrl} download target="_blank" rel="noopener noreferrer">
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )
                  })
                }
              </div>
              {certifications.filter(cert => cert.file_url || cert.white_card_path).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">No certificate images available</p>
                </div>
              )}
            </div>
          )}

          {/* Certification History */}
          {certifications && certifications.length > 0 && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Certification History</h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.id}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(cert.status || 'Awaiting Review')}
                        {index === 0 && (
                          <span className="text-xs text-blue-600 font-medium">(Current)</span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Expiry: {formatDate(cert.expiry_date)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDateTime(cert.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity History */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {activities && activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Checked in to {(activity.job_sites as any)?.name || 'Site'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(activity.job_sites as any)?.address || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDateTime(activity.checked_in_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No activity recorded</p>
                <p className="text-xs text-gray-400 mt-1">Last activity: {formatDate(lastActivity)}</p>
              </div>
            )}
          </div>

          {/* Worker Statistics */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {activities?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Site Visits</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {certifications?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Certifications</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {formatDate(worker.created_at)}
                </p>
                <p className="text-sm text-gray-600">Member Since</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {isFullyVerified ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-600">Fully Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div>
          <UpdateComplianceForm
            initial={{
              workerId: worker.id,
              status: latestCert?.status,
              expiryDate: latestCert?.expiry_date
            }}
          />
        </div>
      </div>
    </main>
  )
}