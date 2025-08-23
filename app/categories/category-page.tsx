"use client"

import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CategoryCard from "@/components/category-card"
import { CartProvider } from "@/components/cart"
import { listCategoriesWithProductCount } from "@/hooks/supabase/categories.supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoriesPageClientProps {
  initialCategories: any[]
}

export default function CategoriesPageClient({ initialCategories }: CategoriesPageClientProps) {
  const [categories, setCategories] = useState<any[]>(initialCategories)
  const [loading, setLoading] = useState(false)

  // Si necesitas recargar categorías después de la carga inicial
  useEffect(() => {
    // Puedes agregar lógica para recargar categorías si es necesario
    // Por ejemplo, si quieres datos siempre frescos
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
    
    // refreshCategories() // Descomenta si quieres siempre datos frescos
  }, [])

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-8">
          <header className="grid gap-2">
            <h1 className="text-2xl md:text-3xl tracking-tight">Categorías</h1>
            <p className="text-sm text-muted-foreground">Explora por temas y tipos de producto.</p>
          </header>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Esqueletos de carga */}
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
                  count={cat.count} // Asegúrate que este campo coincida con tu respuesta
                />
              ))}
            </section>
          )}
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}