import type { Metadata } from 'next'
import { getProductsByCategoryName } from "@/hooks/supabase/categories.supabase"
import { getProductsByType } from "@/hooks/supabase/products.supabase"
import CategoryDetailPage from './category-detail-client'
import { capitalize } from 'lodash-es';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Obtener parámetros
  const { category } = await params;
  const cleanTextCat = category ? decodeURIComponent(category) : "";
  
  // Obtener productos
  const allowedTypes = [
    "t-shirt",
    "hoodie",
    "polo",
    "croptop",
    "oversized",
    "long-sleeve",
  ] as const;
  
  let products = [];
  
  if (allowedTypes.includes(category as typeof allowedTypes[number])) {
    products = await getProductsByType(category as typeof allowedTypes[number]);
  } else {
    const result = await getProductsByCategoryName(category);
    products = result.products;
  }
  
  // Crear descripción dinámica
  const productCount = products.length;
  const productExamples = products.slice(0, 3).map((p:any) => p.title).join(', ');
  
  return {
    title: `${capitalize(cleanTextCat)} | Inkspire Studio`,
    description: `Explora nuestra colección de ${cleanTextCat.toLowerCase()}. ${productCount} productos disponibles: ${productExamples} y más. Envío gratis en El Salvador.`,
    openGraph: {
      title: `${capitalize(cleanTextCat)} | Inkspire Studio`,
      description: `Descubre nuestra colección de ${cleanTextCat.toLowerCase()} con ${productCount} productos únicos.`,
      images: products.length > 0 && products[0].image_url ? 
        [products[0].image_url] : ['/og-default.jpg'],
      url: `https://inkspire-studio.vercel.app/categories/${category}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@inkspirestudiosv',
      creator: '@inkspirestudiosv',
      images: products.length > 0 && products[0].image_url ? 
        [products[0].image_url] : ['/og-default.jpg'],
    },
    keywords: [cleanTextCat, 'productos personalizados', 'El Salvador', ...products.slice(0, 5).map((p:any) => p.title)],
  }
}

export default async function Page({ params }: PageProps) {
  // Obtener parámetros
  const { category } = await params;
  
  // Obtener datos en el servidor
  const allowedTypes = [
    "t-shirt",
    "hoodie",
    "polo",
    "croptop",
    "oversized",
    "long-sleeve",
  ] as const;
  
  let products = [];
  
  if (allowedTypes.includes(category as typeof allowedTypes[number])) {
    products = await getProductsByType(category as typeof allowedTypes[number]);
  } else {
    const result = await getProductsByCategoryName(category);
    products = result.products;
  }
  
  return <CategoryDetailPage initialProducts={products} category={category} />
}