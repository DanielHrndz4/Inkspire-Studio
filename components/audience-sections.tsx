"use client"

import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import ProductSkeleton from "@/components/product-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductTag, Products } from "@/interface/product.interface"
import { hasAudienceTag, listProducts } from "@/hooks/supabase/products.supabase"
import { useEffect, useState } from "react"

type AudienceKey = ProductTag

const AUDIENCES: { key: AudienceKey; title: string; href: string; image: string }[] = [
  { key: "men", title: "Hombres", href: "/categories/t-shirt?audiencia=hombres", image: "/images/men-section.jpeg" },
  { key: "women", title: "Mujeres", href: "/categories/t-shirt?audiencia=mujeres", image: "/images/women-section.jpeg" },
  { key: "kids", title: "Niños", href: "/categories/t-shirt?audiencia=niños", image: "/images/kids-section.jpeg" },
]

export default function AudienceSections() {
  const [allProducts, setAllProducts] = useState<Products[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar productos desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await listProducts()
        setAllProducts(products)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrar productos para cada audiencia
  const productsByAudience = AUDIENCES.map(audience => {
    const filteredProducts = allProducts.filter(product => 
      hasAudienceTag(product, audience.key)
    );
    
    // Tomar solo los primeros 3 productos para mostrar
    return {
      ...audience,
      products: filteredProducts.slice(0, 3)
    };
  });

  if (loading) {
    return (
      <section aria-label="Por audiencia" className="bg-white">
        <div className="container mx-auto px-4 py-12 grid gap-8">
          <header className="flex items-end justify-between">
            <div className="grid gap-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-4 w-32" />
          </header>
          <div className="grid gap-8">
            {AUDIENCES.map((a) => (
              <div key={a.key} className="grid lg:grid-cols-2 gap-6 items-start">
                <Skeleton className="relative aspect-[16/9] w-full rounded-md" />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <ProductSkeleton count={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Por audiencia" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-8">
        <header className="flex items-end justify-between">
          <div className="grid gap-1">
            <h2 className="text-xl md:text-2xl tracking-tight">Para él, para ella y para peques</h2>
            <p className="text-sm text-muted-foreground">Descubre selecciones curadas para cada audiencia</p>
          </div>
          <Link href="/categories" className="text-sm hover:underline underline-offset-4">
            Ver todas las categorías
          </Link>
        </header>

        <div className="grid gap-8">
          {productsByAudience.map(({ key, title, href, image, products: audienceProducts }) => (
            <div key={key} className="grid lg:grid-cols-2 gap-6 items-start">
              <Link href={href} className="relative aspect-[16/9] w-full overflow-hidden rounded-md">
                <Image 
                  src={image || "/placeholder.svg"} 
                  alt={`Colección ${title}`} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="text-xs uppercase tracking-widest opacity-80">{title}</div>
                  <div className="text-2xl font-light">Explorar {title.toLowerCase()}</div>
                </div>
              </Link>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {audienceProducts.length > 0 ? (
                  audienceProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  // Mensaje de respaldo si no hay productos
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No hay productos disponibles para {title.toLowerCase()} en este momento.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}