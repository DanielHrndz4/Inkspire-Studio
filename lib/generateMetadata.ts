// lib/generateMetadata.ts
import { Metadata } from 'next'

interface GenerateMetadataOptions {
  title: string
  description?: string
  url?: string
  image?: string
  author?: string
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  type?: 'website' | 'article'
  locale?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noIndex?: boolean
  structuredData?: object
  customMeta?: { name?: string; property?: string; content: string }[]
}

export function generateMetadata({
  title,
  description,
  url,
  image,
  author = 'Inkspire Studio',
  keywords = ['personalización', 'prendas', 'diseño', 'ropa', 'estampado', 'bordado', 'El Salvador', 'SV'],
  publishedTime,
  modifiedTime,
  type = 'website',
  locale = 'es_SV',
  siteName = 'Inkspire Studio',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
  customMeta = []
}: GenerateMetadataOptions): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkspire-studio.vercel.app'
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl
  const metaTitle = `${title} | ${siteName}`
  const metaDescription = description || 'Inkspire Studio - Personalización premium en prendas con los más altos estándares de calidad y diseño en El Salvador.'
  const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/images/og-image.jpg`
  const metaKeywords = keywords.join(', ')
  
  // Datos estructurados por defecto (Schema.org) para negocio en El Salvador
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: metaDescription,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SV',
      addressRegion: 'San Salvador',
      addressLocality: 'San Salvador'
    },
    ...structuredData
  }

  // Construir metadata para Next.js
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: author }],
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    metadataBase: new URL(siteUrl),
    
    // Open Graph
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      siteName: siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: locale,
      type: type,
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
    },
    
    // Twitter
    twitter: {
      card: twitterCard,
      site: '@inkspirestudiosv',
      creator: '@inkspirestudiosv',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    
    // Otros metadatos
    alternates: {
      canonical: pageUrl,
    },
    
    // Metadatos adicionales que no están en la API estándar
    other: {
      // Metadatos básicos
      'author': author,
      'geo.region': 'SV-SS',
      'geo.placename': 'San Salvador',
      'geo.position': '13.6929;-89.2182',
      'ICBM': '13.6929, -89.2182',
      
      // Facebook específico
      'fb:app_id': 'InkspireStudio',
      'fb:pages': 'InkspireStudio',
      
      // TikTok
      'tiktok:creator': 'Inkspire studiosv',
      'tiktok:site': 'Inkspire studio sv',
      
      // Instagram
      'instagram:creator': 'inkspirestudiosv',
      'instagram:site': 'inkspirestudiosv',
      
      // Información adicional para El Salvador
      'country': 'El Salvador',
      'language': 'es',
      'distribution': 'local',
      
      // Datos estructurados (JSON-LD)
      'script:ld+json': JSON.stringify(defaultStructuredData),
      
      // Metadatos personalizados
      ...Object.fromEntries(
        customMeta.map((meta, index) => {
          const key = meta.name ? `name:${meta.name}` : `property:${meta.property}`
          return [key, meta.content]
        })
      ),
    },
  }

  return metadata
}

// Función para generar el JSON-LD por separado (opcional)
export function generateStructuredData(structuredData?: object) {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkspire-studio.vercel.app'
  const siteName = 'Inkspire Studio'
  
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Inkspire Studio - Personalización premium en prendas con los más altos estándares de calidad y diseño en El Salvador.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SV',
      addressRegion: 'San Salvador',
      addressLocality: 'San Salvador'
    },
    ...structuredData
  }
  
  return defaultStructuredData
}