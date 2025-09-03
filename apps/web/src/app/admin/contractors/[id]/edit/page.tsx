import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContractorForm from '../../ContractorForm'

export const metadata = {
  title: 'Edit Contractor — Admin',
  description: 'Edit contractor company details'
}

interface EditContractorPageProps {
  params: {
    id: string
  }
}

export default async function EditContractorPage({ params }: EditContractorPageProps) {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch contractor data
  const { data: contractor, error } = await supabase
    .from('contractors')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !contractor) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' as const },
    { label: 'Contractors', href: '/admin/contractors' as const },
    { label: contractor.name }
  ]

  return (
    <AppSidebar title={`Edit ${contractor.name}`}>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <ContractorForm contractor={contractor} />
      </div>
    </AppSidebar>
  )
}