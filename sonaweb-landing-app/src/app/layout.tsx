import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { CustomCursorProvider } from '@/components/custom-cursor'
import { SmoothScroll } from '@/components/smooth-scroll'

export const metadata: Metadata = {
  title: {
    template: '%s - SONAWEB',
    default: 'SONAWEB',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SONAWEB',
  }
}

const clashDisplay = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-clash',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" className={`${clashDisplay.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        <CustomCursorProvider>
          <SmoothScroll>
            <Navbar />
            {children}
          </SmoothScroll>
        </CustomCursorProvider>
      </body>
    </html>
  )
}