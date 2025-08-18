"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductConfigurator from "@/components/product-configurator"
import ProductCard from "@/components/product-card"
import { getProductById, listProducts } from "@/hooks/supabase/products.supabase"
import { Products } from "@/interface/product.interface"
import { CartProvider } from "@/components/cart"

type PageProps = {
  params: { id?: string }
}

export default function ProductPage({ params }: PageProps) {
  const id = params?.id ?? ""
  const [product, setProduct] = useState<Products | null>(null)
  const [related, setRelated] = useState<Products[]>([])
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // Estado para imagen seleccionada
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

  if (!loading && !product) return notFound()
  if (!product) return null

  const selectedVariant = product.product.find(v => v.color === selectedColor) ?? product.product[0]

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-10 lg:grid-cols-2">
          {/* Galería */}
          <div className="grid gap-4">
            {/* Imagen principal */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={selectedVariant.images[selectedImageIndex] || "/placeholder.svg"}
                alt={`Imagen principal de ${product.title} en ${selectedColor}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-4">
              {selectedVariant.images.map((img, i) => (
                <button
                  key={`${selectedColor}-${i}`}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    i === selectedImageIndex 
                      ? "border-primary" 
                      : "border-transparent"
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
                setSelectedImageIndex(0) // Resetear imagen al cambiar color
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