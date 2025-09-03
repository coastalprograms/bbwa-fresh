import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard — Bayside Builders WA',
  description: 'Administrative dashboard for managing workers, projects, and compliance'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}