import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import PageTransition from '@/components/page-transition'
import ServiceWorkerRegister from '@/components/service-worker-register'

export const metadata: Metadata = {
  title: 'Inkspire Studio',
  description: 'Created with Inkspire Studio',
  generator: 'Inkspire Studio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/logo.png" />
        <link rel="stylesheet" href="icon" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ServiceWorkerRegister />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
