import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getContractors } from './actions'
import ContractorsPageClient from './ContractorsPageClient'

export const metadata = {
  title: 'Contractors — Admin',
  description: 'Manage contractor companies and their employee relationships'
}


export default async function ContractorsPage() {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch contractors with employee counts
  const contractorsResult = await getContractors()
  
  if (!contractorsResult.success) {
    console.error('Error fetching contractors:', contractorsResult.error)
  }

  const contractors = contractorsResult.data || []

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' as const },
    { label: 'Contractors' }
  ]

  return (
    <AppSidebar title="Contractors">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Client-side content with filtering */}
        <ContractorsPageClient contractors={contractors} />
      </div>
    </AppSidebar>
  )
}