"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CategorySpotlight from "@/components/category-spotlight"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import { CartProvider } from "@/components/cart"
import { categories } from "@/lib/categories"
import HomeCollection from "@/components/home-collection"
import { listProducts } from "@/hooks/supabase/products.supabase"
import type { Products } from "@/interface/product.interface"
import ProductSkeleton from "@/components/product-skeleton"

const TABS = [
  { key: "all", label: "Todo" },
  { key: "t-shirt", label: "Camisas" },
  { key: "hoodie", label: "Hoodies" },
  { key: "anime", label: "Anime" },
  { key: "cars", label: "Carros" },
  { key: "typography", label: "Tipografía" },
] as const

interface CollectionPageClientProps {
  initialProducts: Products[]
}

export default function CollectionPageClient({ initialProducts }: CollectionPageClientProps) {
  const topCats = categories.slice(0, 8)
  const [products, setProducts] = useState<Products[]>(initialProducts)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Si los productos iniciales están vacíos, cargar desde el cliente
    if (initialProducts.length === 0) {
      const load = async () => {
        try {
          setLoading(true)
          const data = await listProducts()
          setProducts(data)
        } catch {
          setProducts([])
        } finally {
          setLoading(false)
        }
      }
      load()
    }
  }, [initialProducts])

  const tiles = [
    { type: "link", src: "/images/categories/camisas.png", alt: "Camisas", href: "/categories/camisas", label: "Camisas", kicker: "Capítulo" },
    { type: "image", src: "/lookbook-inkspire-1.png", alt: "Editorial 1" },
    { type: "link", src: "/images/categories/hoodies.png", alt: "Hoodies", href: "/categories/hoodies", label: "Hoodies", kicker: "Capítulo" },
    { type: "image", src: "/lookbook-inkspire-2.png", alt: "Editorial 2" },
    { type: "link", src: "/images/categories/anime.png", alt: "Anime", href: "/categories/anime", label: "Anime", kicker: "Temática" },
    { type: "image", src: "/lookbook-inkspire-3.png", alt: "Editorial 3" },
    { type: "link", src: "/images/categories/cars.png", alt: "Carros", href: "/categories/carros", label: "Carros", kicker: "Temática" },
    { type: "image", src: "/lookbook-inkspire-4.png", alt: "Editorial 4" },
  ] as const

  return (
    <CartProvider>
      <div className="flex max-h-[50dvh] flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <section className="relative">
            <div className="relative aspect-[25/7] w-full overflow-hidden bg-muted">
              <Image
                src="/images/curry-banner.jpg"
                alt="Colección Inkspire — Exposición de prendas"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 py-10 md:py-16">
                  <div className="max-w-2xl text-white grid gap-4">
                    <div className="text-xs uppercase tracking-widest opacity-90">Colección</div>
                    <h1 className="text-3xl md:text-5xl font-light tracking-tight">Prendas como arte</h1>
                    <p className="text-sm md:text-base text-white/85">
                      Una selección curada de camisas y hoodies. Capítulos y temáticas que celebran el diseño.
                    </p>
                    <div className="flex gap-4">
                      <Link href="/categories" className="underline underline-offset-4">
                        Ver categorías
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CategorySpotlight categories={topCats} title="Capítulos Destacados" subtitle="Camisas, Hoodies y Temáticas seleccionadas" />
          <HomeCollection showCollection={false} />

          <section aria-label="Piezas destacadas" className="bg-white">
            <div className="container mx-auto px-4 py-12 grid gap-6">
              <header className="grid gap-1">
                <h2 className="text-xl md:text-2xl tracking-tight">Piezas destacadas</h2>
                <p className="text-sm text-muted-foreground">Filtra por tipo o temática</p>
              </header>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-6 rounded-none">
                  {TABS.map((t) => (
                    <TabsTrigger key={t.key} value={t.key} className="rounded-none text-xs md:text-sm">
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {TABS.map((t) => {
                  const list =
                    t.key === "all"
                      ? products
                      : products.filter(
                        (p) =>
                          p.category?.name?.toLowerCase() === t.key ||
                          p.type?.toLowerCase() === t.key ||
                          p.product.some((v) =>
                            (v.tags || [])
                              .map((tag) => tag.toLowerCase())
                              .includes(t.key),
                          ),
                      )
                  return (
                    <TabsContent key={t.key} value={t.key} className="mt-6">
                      {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          <ProductSkeleton count={4} />
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {list.map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                          {list.length === 0 && (
                            <p className="text-sm text-muted-foreground">No hay piezas en esta categoría por ahora.</p>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  )
                })}
              </Tabs>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}