"use client"

import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CategorySpotlight from "@/components/category-spotlight"
import EditorialGrid from "@/components/editorial-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import { CartProvider } from "@/components/cart"
import { categories } from "@/lib/categories"
import { products } from "@/lib/data"

const TABS = [
  { key: "all", label: "Todo" },
  { key: "camisas", label: "Camisas" },
  { key: "hoodies", label: "Hoodies" },
  { key: "anime", label: "Anime" },
  { key: "carros", label: "Carros" },
  { key: "tipografia", label: "Tipografía" },
] as const

export default function CollectionPage() {
  const topCats = categories.slice(0, 3)

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
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <section className="relative">
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
              <Image
                src="/images/hero-2.png"
                alt="Colección Inkspire — Exposición de prendas"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 py-10 md:py-16">
                  <div className="max-w-2xl text-white grid gap-4">
                    <div className="text-xs uppercase tracking-widest opacity-90">Colección</div>
                    <h1 className="text-3xl md:text-5xl font-light tracking-tight">Prendas como arte</h1>
                    <p className="text-sm md:text-base text-white/85">
                      Una selección curada de camisas y hoodies. Capítulos y temáticas que celebran el diseño.
                    </p>
                    <div className="flex gap-4">
                      <Link href="/customize" className="underline underline-offset-4">
                        Personalizar
                      </Link>
                      <Link href="/categories" className="underline underline-offset-4">
                        Ver categorías
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CategorySpotlight categories={topCats} title="Capítulos" subtitle="Camisas, Hoodies y Temáticas seleccionadas" />
          <EditorialGrid tiles={tiles as any} />

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
                  const list = t.key === "all" ? products : products.filter((p) => (p.tags ?? []).includes(t.key))
                  return (
                    <TabsContent key={t.key} value={t.key} className="mt-6">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {list.map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                        {list.length === 0 && (
                          <p className="text-sm text-muted-foreground">No hay piezas en esta categoría por ahora.</p>
                        )}
                      </div>
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
