"use client"

import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { CartProvider } from "@/components/cart"
import FeatureStrip from "@/components/feature-strip"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import NewsletterForm from "@/components/newsletter-form"
import InstagramGrid from "@/components/instagram-grid"
import { categories } from "@/lib/categories"
import CategorySpotlight from "@/components/category-spotlight"
import HomeCollection from "@/components/home-collection"
import AudienceSections from "@/components/audience-sections"
import BackToTop from "@/components/back-to-top"
import React, { useEffect } from 'react';
import { getLatestProducts } from "@/hooks/supabase/products.supabase"
import ProductSkeleton from "@/components/product-skeleton"
import SEO from "@/components/seo"

export default function Page() {
  const featuredCats = categories
  const [latestProducts, setLatestProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const products = await getLatestProducts()
      setLatestProducts(products)
      setLoading(false)
    }
    fetchProducts()
  }, [])
  return (
    <CartProvider>
      <SEO
        title="Inkspire Studio | Camisas y Hoodies Personalizados en El Salvador"
        description="Inkspire Studio ofrece camisas, hoodies y prendas personalizadas con bordado y estampado premium en El Salvador. Calidad de estudio y diseño exclusivo."
        url="/"
        image="/images/og-home.jpg"
        keywords={[
          "camisas personalizadas",
          "hoodies personalizados",
          "ropa personalizada",
          "bordado",
          "estampado",
          "Inkspire Studio",
          "El Salvador",
          "San Salvador"
        ]}
        type="website"
        locale="es_SV"
        siteName="Inkspire Studio"
        twitterCard="summary_large_image"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Inkspire Studio",
          url: "https://inkspire-studio.vercel.app",
          description: "Camisas, hoodies y prendas personalizadas con los más altos estándares de calidad en El Salvador.",
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

      <div className="flex min-h-[100dvh] flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <section className="relative">
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
              <Image
                src="/images/cars-collection.png"
                alt="Inkspire Studio - personalización premium"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 py-12 md:py-16">
                  <div className="max-w-xl grid gap-4 text-white">
                    <h1 className="text-3xl md:text-5xl font-light tracking-tight">
                      Inkspire Studio — Personaliza tu estilo
                    </h1>
                    <p className="text-sm md:text-base text-white/85">
                      Camisas y hoodies personalizados con calidad de estudio. Diseña, aprueba y recibe en casa.
                    </p>
                    <div className="flex gap-3">
                      <Link href="/customize">
                        <Button className="rounded-none h-11 px-8">Personalizar ahora</Button>
                      </Link>
                      <Link href="/collection">
                        <Button variant="outline" className="rounded-none h-11 px-8 bg-transparent text-white border-white hover:bg-white/10">
                          Ver Colección
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <FeatureStrip />
          <CategorySpotlight categories={featuredCats} title="Capítulos — Categorías" subtitle="Explora por tipo y temática" />
          <AudienceSections />
          <HomeCollection />

          <section className="container mx-auto px-4 py-12 md:py-16 grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl tracking-tight">Nuevos esenciales</h2>
                <p className="text-sm text-muted-foreground">Una selección de temporada</p>
              </div>
              <Link href="categories/t-shirt" className="text-sm hover:underline underline-offset-4">
                Ver todos
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <ProductSkeleton count={4} />
              ) : (
                latestProducts.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </div>
          </section>

          <HowItWorks />

          <section className="relative">
            <div className="relative aspect-[35/9] w-full overflow-hidden bg-muted">
              <Image src="/images/pk-banner.jpg" alt="Servicios de diseño Inkspire Studio" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white grid gap-4">
                    <h3 className="text-2xl md:text-3xl font-light">¿Necesitas un diseño a medida?</h3>
                    <p className="text-sm md:text-base text-white/85">
                      Nuestro equipo te ayuda con branding, ilustración y piezas listas para imprimir.
                    </p>
                    <Link href="/services">
                      <Button className="rounded-none h-11 px-8">Solicitar cotización</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* <LocationSection /> */}
          <Testimonials />
          <InstagramGrid />
          <NewsletterForm />
        </main>
        <SiteFooter />
        <BackToTop />
      </div>
    </CartProvider>
  )
}
