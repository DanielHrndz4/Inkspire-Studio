import { MetadataRoute } from 'next'
import { listProducts } from '@/hooks/supabase/products.supabase'
import { categories } from '@/lib/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkspire-studio.com'

  const staticRoutes = ['', '/products', '/categories', '/collection', '/customize', '/services', '/wishlist', '/admin', '/orders'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  const productRoutes: MetadataRoute.Sitemap = []
  try {
    const products = await listProducts()
    productRoutes.push(
      ...products.map((p) => ({
        url: `${baseUrl}/product/${p.id}`,
        lastModified: new Date(),
      }))
    )
  } catch (e) {
    console.error('Error fetching products for sitemap', e)
  }

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
