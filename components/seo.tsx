import Head from 'next/head'

interface SEOProps {
  title: string
  description?: string
  url?: string
  image?: string
}

export default function SEO({ title, description, url, image }: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkspire-studio.com'
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl
  const metaTitle = `${title} | Inkspire Studio`
  const metaDescription = description || 'Inkspire Studio - Personalización premium en prendas.'
  const metaImage = image || `${siteUrl}/logo.png`

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={pageUrl} />
      <link rel="canonical" href={pageUrl} />
    </Head>
  )
}
