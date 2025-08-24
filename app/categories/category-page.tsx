"use client"

import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CategoryCard from "@/components/category-card"
import { CartProvider } from "@/components/cart"
import { listCategoriesWithProductCount } from "@/hooks/supabase/categories.supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "@/components/product-card"
import type { Products } from "@/interface/product.interface"

interface CategoriesPageClientProps {
  initialCategories: any[]
  initialProducts?: Products[]
  searchQuery?: string
}

export default function CategoriesPageClient({ initialCategories, initialProducts = [], searchQuery = "" }: CategoriesPageClientProps) {
  const [categories, setCategories] = useState<any[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [products] = useState<Products[]>(initialProducts)

  // Refrescar categorías solo si no hay búsqueda
  useEffect(() => {
    if (searchQuery) return
    const refreshCategories = async () => {
      try {
        setLoading(true)
        const freshData = await listCategoriesWithProductCount()
        setCategories(freshData)
      } catch (error) {
        console.error("Error refreshing categories:", error)
      } finally {
        setLoading(false)
      }
    }
    refreshCategories()
  }, [searchQuery])

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-8">
          {searchQuery ? (
            <>
              <header className="grid gap-2">
                <h1 className="text-2xl md:text-3xl tracking-tight">Resultados para "{searchQuery}"</h1>
              </header>
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No se encontraron productos.</p>
              ) : (
                <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </section>
              )}
            </>
          ) : (
            <>
              <header className="grid gap-2">
                <h1 className="text-2xl md:text-3xl tracking-tight">Categorías</h1>
                <p className="text-sm text-muted-foreground">Explora por temas y tipos de producto.</p>
              </header>
              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="space-y-4">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.name}
                      name={cat.name}
                      image={cat.image}
                      count={cat.count}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}
