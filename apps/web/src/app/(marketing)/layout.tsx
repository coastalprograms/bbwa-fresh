import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bayside Builders WA - Premium Construction Services Dunsborough',
  description: 'South West\'s most trusted builders with 20+ years experience. Specialising in new home construction, renovations, extensions & commercial projects. Licensed & insured.',
  keywords: ['Dunsborough builders', 'home construction South West', 'renovations Dunsborough WA', 'extensions Dunsborough', 'licensed builders Western Australia', 'quality construction South West', 'new homes Dunsborough', 'commercial construction South West'],
  openGraph: {
    title: 'Bayside Builders WA - Premium Construction Services Dunsborough',
    description: 'South West\'s most trusted builders with 20+ years experience. New homes, renovations, extensions & commercial projects.',
    type: 'website',
    locale: 'en_AU',
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayside Builders WA - Quality Construction Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bayside Builders WA - Premium Construction Services Dunsborough',
    description: 'Perth\'s most trusted builders. New homes, renovations, extensions & commercial projects.',
    images: ['/images/twitter-home.jpg'],
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
