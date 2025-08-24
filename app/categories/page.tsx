import type { Metadata } from 'next'
import { listCategoriesWithProductCount } from "@/hooks/supabase/categories.supabase"
import CategoriesPageClient from './category-page'
import { searchProducts } from "@/hooks/supabase/search.supabase"

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  // Obtener categorías para metadata dinámica
  const categories = await listCategoriesWithProductCount()
  
  // Crear descripción dinámica basada en las categorías disponibles
  const categoryNames = categories.map(cat => cat.name).join(', ')
  
  return {
    title: 'Categorías | Inkspire Studio',
    description: `Explora nuestras categorías de productos personalizados: ${categoryNames}. Encuentra camisas, hoodies y más con diseños exclusivos.`,
    openGraph: {
      title: 'Categorías | Inkspire Studio',
      description: `Descubre nuestras categorías de productos personalizados: ${categoryNames}.`,
      images: categories.length > 0 && categories[0].image ? [categories[0].image] : ['/og-default.jpg'],
      url: 'https://inkspire-studio.vercel.app/categories',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@inkspirestudiosv',
      creator: '@inkspirestudiosv',
      images: categories.length > 0 && categories[0].image ? [categories[0].image] : ['/og-default.jpg'],
    },
    keywords: ['categorías', 'productos personalizados', ...categories.map(cat => cat.name)],
  }
}

interface PageProps {
  searchParams: { q?: string }
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const q = searchParams.q?.toString() ?? ""
  if (q) {
    const products = await searchProducts(q)
    return (
      <CategoriesPageClient
        initialCategories={[]}
        initialProducts={products}
        searchQuery={q}
      />
    )
  }
  const categories = await listCategoriesWithProductCount()
  return <CategoriesPageClient initialCategories={categories} initialProducts={[]} searchQuery="" />
}
