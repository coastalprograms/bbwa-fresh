import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Site Check-In - Bayside Builders WA',
  description: 'Site check-in portal for authorized workers at Bayside Builders WA',
}

export default function CheckInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  )
}