"use client"

import { useEffect, useState } from "react"
import { useParams, redirect } from "next/navigation" // redirect opcional en client
import Image from "next/image"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductConfigurator from "@/components/product-configurator"
import ProductCard from "@/components/product-card"
import { getProductById, listProducts } from "@/hooks/supabase/products.supabase"
import { Products } from "@/interface/product.interface"
import { CartProvider } from "@/components/cart"
import ProductPageSkeleton from "@/components/product-page-skeleton"
import SEO from "@/components/seo"

export default function ProductPage() {
  const params = useParams<{ id: string | string[] }>()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ""

  const [product, setProduct] = useState<Products | null>(null)
  const [related, setRelated] = useState<Products[]>([])
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getProductById(id)
        setProduct(p)
        if (p) setSelectedColor(p.product[0]?.color || "")
        const all = await listProducts()
        setRelated(all.filter(pr => pr.id !== id).slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <CartProvider>
        <SEO title="Producto" description="Cargando producto..." />
        <div className="flex min-h-[100dvh] flex-col">
          <SiteHeader />
          <main className="container mx-auto px-4 py-10 grid gap-10 lg:grid-cols-2">
            <ProductPageSkeleton />
          </main>
          <SiteFooter />
        </div>
      </CartProvider>
    )
  }

  // notFound() es server-only; en client puedes redirigir o mostrar un 404 local
  if (!product) {
    // redirect("/404") // <- si prefieres redirigir
    return (
      <CartProvider>
        <SEO title="Producto no encontrado" description="Producto no encontrado" />
        <div className="flex min-h-[100dvh] flex-col">
          <SiteHeader />
          <main className="container mx-auto px-4 py-10">
            <p className="text-sm text-muted-foreground">Producto no encontrado.</p>
          </main>
          <SiteFooter />
        </div>
      </CartProvider>
    )
  }

  const selectedVariant =
    product.product.find(v => v.color === selectedColor) ?? product.product[0]

  return (
    <CartProvider>
      <SEO title={product.title} description={product.description} />
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-10 lg:grid-cols-2">
          {/* Galería */}
          <div className="grid gap-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={selectedVariant.images[selectedImageIndex] || "/placeholder.svg"}
                alt={`Imagen principal de ${product.title} en ${selectedColor}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {selectedVariant.images.map((img, i) => (
                <button
                  key={`${selectedColor}-${i}`}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    i === selectedImageIndex ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Vista ${i + 1} de ${product.title} en ${selectedColor}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Configurador */}
          <div className="lg:pl-6">
            <ProductConfigurator
              product={product}
              selectedColor={selectedColor}
              onColorChange={(color) => {
                setSelectedColor(color)
                setSelectedImageIndex(0)
              }}
              selectedVariant={selectedVariant}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          {/* Relacionados */}
          <div className="lg:col-span-2">
            <div className="mt-6 border-t pt-8">
              <h3 className="text-lg tracking-tight mb-6">También te puede gustar</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}
