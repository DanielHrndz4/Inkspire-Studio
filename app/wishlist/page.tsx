"use client"

import { useEffect, useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductCard from "@/components/product-card"
import { CartProvider } from "@/components/cart"
import { useWishlist } from "@/components/wishlist"
import { getProductsByIds } from "@/hooks/supabase/products.supabase"
import { Products } from "@/interface/product.interface"

export default function WishlistPage() {
  const { slugs, clear } = useWishlist()
  const [products, setProducts] = useState<Products[]>([])

  useEffect(() => {
    const load = async () => {
      if (slugs.length === 0) {
        setProducts([])
        return
      }
      try {
        const fetched = await getProductsByIds(slugs)
        setProducts(fetched)
      } catch (err) {
        console.error(err)
        setProducts([])
      }
    }
    load()
  }, [slugs])

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-6">
          <header className="flex items-end justify-between">
            <div className="grid gap-1">
              <h1 className="text-2xl md:text-3xl tracking-tight">Tus favoritos</h1>
              <p className="text-sm text-muted-foreground">Guarda piezas para volver más tarde.</p>
            </div>
            {slugs.length > 0 && (
              <button onClick={clear} className="text-sm underline underline-offset-4">
                Limpiar lista
              </button>
            )}
          </header>

          {slugs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no has agregado productos a tu lista de deseos.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}
