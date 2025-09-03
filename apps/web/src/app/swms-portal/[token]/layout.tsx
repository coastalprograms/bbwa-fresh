import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SWMS Submission Portal - Bayside Builders WA',
  description: 'Submit your Safe Work Method Statement documents securely',
  robots: 'noindex, nofollow', // Prevent indexing of portal pages
}

interface SwmsPortalLayoutProps {
  children: React.ReactNode
  params: {
    token: string
  }
}

export default function SwmsPortalLayout({ 
  children, 
  params 
}: SwmsPortalLayoutProps) {
  // Token validation is handled at the page level for better error handling
  // This layout provides the meta data and structure
  return children
}