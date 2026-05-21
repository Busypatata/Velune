import type { Metadata, Viewport } from 'next'
import { Nunito, Playfair_Display } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Velune — Grow Your World Through Nutrition', template: '%s | Velune' },
  description: 'A cozy social nutrition RPG. Track nutrients, grow your garden, battle friends, and become a Nutrient Sovereign.',
  keywords: ['nutrition', 'health', 'gamification', 'rpg', 'social', 'food tracking', 'wellness'],
  authors: [{ name: 'Velune' }],
  openGraph: {
    title: 'Velune',
    description: 'Grow your world through nutrition',
    type: 'website',
    locale: 'en_US',
  },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F4ED',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${nunito.variable} ${playfair.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
