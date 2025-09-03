import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Worker Portal - Bayside Builders WA',
  description: 'Worker induction and site check-in portal for Bayside Builders WA',
}

export default function InductionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  )
}