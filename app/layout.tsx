import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/lib/providers/QueryProvider'
import ErrorBoundary from '@/components/shared/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Video Streaming Platform',
  description: 'Industry-grade video streaming platform with AI-powered features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <QueryProvider>{children}</QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

