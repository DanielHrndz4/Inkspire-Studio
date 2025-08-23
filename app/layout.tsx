import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

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
  openGraph: {
    type: 'website',
    locale: 'es_SV',
    siteName: 'Inkspire Studio',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@inkspirestudiosv',
    creator: '@inkspirestudiosv',
  },
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
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
