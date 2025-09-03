import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContractorForm from '../ContractorForm'

export const metadata = {
  title: 'Add Contractor — Admin',
  description: 'Add a new contractor company'
}

export default async function NewContractorPage() {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' as const },
    { label: 'Contractors', href: '/admin/contractors' as const },
    { label: 'Add Contractor' }
  ]

  return (
    <AppSidebar title="Add Contractor">
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <ContractorForm />
      </div>
    </AppSidebar>
  )
}