import Head from 'next/head'

interface SEOProps {
  title: string
  description?: string
  url?: string
  image?: string
  author?: string
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  type?: 'website' | 'article' | 'product' | 'service'
  locale?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noIndex?: boolean
  structuredData?: object
}

export default function SEO({
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
  structuredData
}: SEOProps) {
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

  return (
    <Head>
      {/* Metadatos básicos */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="geo.region" content="SV-SS" />
      <meta name="geo.placename" content="San Salvador" />
      <meta name="geo.position" content="13.6929;-89.2182" />
      <meta name="ICBM" content="13.6929, -89.2182" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Facebook específico */}
      <meta property="fb:app_id" content="InkspireStudio" />
      <meta property="fb:pages" content="InkspireStudio" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@inkspirestudiosv" />
      <meta name="twitter:creator" content="@inkspirestudiosv" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* TikTok */}
      <meta property="tiktok:creator" content="Inkspire studiosv" />
      <meta property="tiktok:site" content="Inkspire studio sv" />
      
      {/* Instagram */}
      <meta property="instagram:creator" content="inkspirestudiosv" />
      <meta property="instagram:site" content="inkspirestudiosv" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(defaultStructuredData) }}
      />
      
      {/* Favicon y touch icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Información adicional para El Salvador */}
      <meta name="country" content="El Salvador" />
      <meta name="language" content="es" />
      <meta name="distribution" content="local" />
    </Head>
  )
}