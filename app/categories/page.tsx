"use client"

import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CategoryCard from "@/components/category-card"
import { CartProvider } from "@/components/cart"
import { listCategoriesWithProductCount } from "@/hooks/supabase/categories.supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton" // Asegúrate de tener este componente
import SEO from "@/components/seo"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await listCategoriesWithProductCount()
        setCategories(data)
        console.log(data)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <CartProvider>
      <SEO
        title="Categorías de Productos Personalizados | Inkspire Studio"
        description="Explora las categorías de productos personalizados de Inkspire Studio: camisetas, gorras, accesorios, bordados y más en El Salvador."
        url="/categorias"
        image="https://icktrjprljbmkfhnsegu.supabase.co/storage/v…ject/public/isbucket/1755535102452-ym7jvnxy79.jpg"
        keywords={[
          "categorías",
          "productos personalizados",
          "camisetas",
          "gorras",
          "accesorios",
          "bordado",
          "estampado",
          "Inkspire Studio",
          "El Salvador"
        ]}
        type="website"
        locale="es_SV"
        siteName="Inkspire Studio"
        twitterCard="summary_large_image"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Categorías de Productos",
          url: "https://inkspire-studio.vercel.app/categorias",
          description: "Descubre las diferentes categorías de productos personalizados de Inkspire Studio.",
          publisher: {
            "@type": "Organization",
            name: "Inkspire Studio",
            logo: {
              "@type": "ImageObject",
              url: "https://inkspire-studio.vercel.app/logo.png"
            }
          },
        }}
      />

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