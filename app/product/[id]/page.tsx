import Image from "next/image"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductConfigurator from "@/components/product-configurator"
import ProductCard from "@/components/product-card"
import { getProductById, products } from "@/lib/data" // Changed from getProductBySlug to getProductById
import { CartProvider } from "@/components/cart"

type PageProps = {
  params: { id?: string } // Changed from slug to id
}

export default function ProductPage({ params }: PageProps) {
  const id = params?.id ?? ""
  const product = getProductById(id) // Changed from getProductBySlug to getProductById
  if (!product) return notFound()

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-10 lg:grid-cols-2">
          {/* Galería */}
          <div className="grid gap-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
              <Image 
                src={product.product.images[0] || "/placeholder.svg"} 
                alt={`Imagen principal de ${product.title}`} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                  <Image 
                    src={img || "/placeholder.svg"} 
                    alt={`Detalle ${i + 1} de ${product.title}`} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Configurador */}
          <div className="lg:pl-6">
            <ProductConfigurator product={product} />
          </div>

          {/* Relacionados */}
          <div className="lg:col-span-2">
            <div className="mt-6 border-t pt-8">
              <h3 className="text-lg tracking-tight mb-6">También te puede gustar</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter((p) => p.id !== product.id) // Changed from slug to id
                  .slice(0, 4)
                  .map((p) => (
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