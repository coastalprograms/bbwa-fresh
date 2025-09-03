import type { Metadata } from 'next'
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WebVitals } from '@/components/analytics/web-vitals'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

const sourceSerif = Source_Serif_4({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: false, // Secondary font, load after primary
})

const jetBrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: false, // Used sparingly, load after primary
})

export const metadata: Metadata = {
  metadataBase: new URL('https://baysidebuilderswa.com.au'),
  title: {
    template: '%s | Bayside Builders WA',
    default: 'Bayside Builders WA - Quality Construction Services Perth',
  },
  description: 'Premium construction services in Perth, WA. Specialising in new homes, renovations, extensions, and commercial construction. Licensed builders with 20+ years experience.',
  keywords: ['construction Perth', 'builders Perth WA', 'home renovations Perth', 'new home construction', 'extensions Perth', 'commercial construction Perth', 'building services Western Australia'],
  authors: [{ name: 'Bayside Builders WA' }],
  creator: 'Bayside Builders WA',
  publisher: 'Bayside Builders WA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://baysidebuilderswa.com.au',
    siteName: 'Bayside Builders WA',
    title: 'Bayside Builders WA - Premium Construction Services Perth',
    description: 'Premium construction services in Perth, WA. Specialising in new homes, renovations, extensions, and commercial construction.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayside Builders WA - Quality Construction Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@BaysideBuildersWA',
    creator: '@BaysideBuildersWA',
    title: 'Bayside Builders WA - Premium Construction Services Perth',
    description: 'Premium construction services in Perth, WA. New homes, renovations, extensions & commercial construction.',
    images: ['/images/twitter-card.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://baysidebuilderswa.com.au',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} ${jetBrainsMono.variable}`}>
        <WebVitals />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
