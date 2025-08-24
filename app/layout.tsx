import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import PWAInstall from '@/components/PWAInstall'

// Configuración básica de metadata
export const metadata: Metadata = {
  title: {
    default: 'Inkspire Studio | Personalización Premium en El Salvador',
    template: '%s | Inkspire Studio'
  },
  description: 'Inkspire Studio ofrece camisas, hoodies y prendas personalizadas con bordado y estampado premium en El Salvador. Calidad de estudio y diseño exclusivo.',
  generator: 'Inkspire Studio',
  metadataBase: new URL('https://inkspire-studio.vercel.app'),
  robots: {
    index: true,
    follow: true,
  },
  keywords: 'camisas personalizadas, hoodies El Salvador, bordado premium, estampado, diseño gráfico, Inkspire Studio',
  authors: [{ name: 'Inkspire Studio' }],
  creator: 'Inkspire Studio',
  publisher: 'Inkspire Studio',
  openGraph: {
    type: 'website',
    locale: 'es_SV',
    url: 'https://inkspire-studio.vercel.app',
    siteName: 'Inkspire Studio',
    title: 'Inkspire Studio | Personalización Premium en El Salvador',
    description: 'Camisas, hoodies y prendas personalizadas con bordado y estampado premium en El Salvador.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Inkspire Studio - Personalización Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@inkspirestudiosv',
    creator: '@inkspirestudiosv',
    title: 'Inkspire Studio | Personalización Premium en El Salvador',
    description: 'Camisas, hoodies y prendas personalizadas con bordado y estampado premium en El Salvador.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  alternates: {
    canonical: 'https://inkspire-studio.vercel.app',
  },
  category: 'fashion',
}

// Viewport configuration for PWA
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <PWAInstall />
      </body>
    </html>
  )
}