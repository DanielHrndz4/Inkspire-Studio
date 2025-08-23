import type { Metadata } from 'next'
import { listProducts } from "@/hooks/supabase/products.supabase"
import CollectionPageClient from './collection-client'

export async function generateMetadata(): Promise<Metadata> {
  // Obtener productos para metadata dinámica
  const products = await listProducts()

  // Crear descripción dinámica basada en los productos disponibles
  const productCount = products.length
  const productExamples = products.slice(0, 3).map(p => p.title).join(', ')
  
  // Obtener la primera imagen disponible (usando image_url)
  const firstProductImage = products.length > 0 && products[0].product[0].images
    ? products[0].product[0].images[0]
    : '/og-default.jpg'

  return {
    title: 'Colección | Inkspire Studio',
    description: `Explora nuestra colección completa de ${productCount} productos personalizados: ${productExamples} y más. Envío gratis en El Salvador.`,
    openGraph: {
      title: 'Colección | Inkspire Studio',
      description: `Descubre nuestra colección completa con ${productCount} productos únicos de camisas, hoodies y más.`,
      images: [firstProductImage],
      url: 'https://inkspire-studio.vercel.app/collection',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@inkspirestudiosv',
      creator: '@inkspirestudiosv',
      images: [firstProductImage],
    },
    keywords: ['colección', 'productos personalizados', 'camisas', 'hoodies', 'El Salvador', ...products.slice(0, 5).map(p => p.title)],
  }
}

export default async function CollectionPage() {
  // Obtener datos en el servidor
  const products = await listProducts()
  
  return <CollectionPageClient initialProducts={products} />
}