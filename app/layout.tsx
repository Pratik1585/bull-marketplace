import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'महाराष्ट्र बैलगाडा शर्यत बाजार - विक्रीसाठी बैल',
  description: 'महाराष्ट्रातील सर्वोत्तम बैलगाडा शर्यत बैल शोधा आणि विक्री करा',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

