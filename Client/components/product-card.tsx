"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from 'lucide-react'
import { type Product } from "@/lib/types"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart"

type Props = {
  product?: Product
  showQuickBuy?: boolean
}

export default function ProductCard({ product, showQuickBuy = true }: Props) {
  const { addItem, setOpen, beginCheckout } = useCart()
  const p =
    product ?? {
      id: "placeholder",
      slug: "camisa-atl",
      title: "Camisa Essential",
      price: 89.0,
      images: ["/minimal-editorial-shirt.png"],
      category: "Hombre",
      colors: ["Blanco"],
      fabrics: ["Algodón"],
      description: "Corte atemporal con materiales premium.",
    }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: `${p.slug}-${Date.now()}`,
      title: p.title,
      price: p.price,
      image: p.images[0] || "/diverse-products-still-life.png",
      slug: p.slug,
      qty: 1,
      color: p.colors?.[0],
    })
  }

  function handleBuyNow(e: React.MouseEvent) {
    handleAdd(e)
    setOpen(true)
    beginCheckout()
  }

  return (
    <Link href={`/product/${p.slug}`} className="group grid gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
        <Image
          src={p.images[0] || "/placeholder.svg"}
          alt={`Imagen de ${p.title}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* Botón de carrito flotante */}
        <Button
          variant="secondary"
          size="icon"
          aria-label="Agregar al carrito"
          className="absolute right-2 top-2 h-9 w-9 opacity-95 hover:opacity-100"
          onClick={handleAdd}
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>

        {showQuickBuy && (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              className="pointer-events-auto w-full rounded-none"
              onClick={handleBuyNow}
            >
              Comprar ahora
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between">
        <div className="text-sm">{p.title}</div>
        <div className="text-sm">{formatCurrency(p.price)}</div>
      </div>
      <div className="text-xs text-muted-foreground">{p.fabrics?.[0]} · {p.colors?.[0]}</div>
    </Link>
  )
}
