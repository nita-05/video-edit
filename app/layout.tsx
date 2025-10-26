import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '../components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VEDIT - Professional Video Editing Platform',
  description: 'Transform your raw footage into professional-quality videos 10x faster editing, automatic scene detection, color correction, and audio enhancement.',
  keywords: 'video editing software, automated video editing, professional video creation, content creation tools',
  authors: [{ name: 'VEDIT Team' }],
  creator: 'VEDIT',
  publisher: 'VEDIT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vedit.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VEDIT - Professional Video Editing Platform',
    description: 'Transform your raw footage into professional-quality videos 10x faster editing, automatic scene detection, color correction, and audio enhancement.',
    url: 'https://vedit.ai',
    siteName: 'VEDIT',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VEDIT - Professional Video Editing Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEDIT - Professional Video Editing Platform',
    description: 'Transform your raw footage into professional-quality videos 10x faster editing, automatic scene detection, color correction, and audio enhancement.',
    images: ['/og-image.jpg'],
    creator: '@vedit',
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0066FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
