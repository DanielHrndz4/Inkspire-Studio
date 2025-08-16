"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from 'lucide-react'
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart"
import { Products } from "@/interface/product.interface"

type Props = {
  product?: Products
  showQuickBuy?: boolean
}

const PLACEHOLDER_PRODUCT: Products = {
  id: "placeholder",
  title: "Camisa Essential",
  description: "",
  price: 89.0,
  type: "t-shirt",
  category: {
    name: "Camisas",
    image: ""
  },
  material: "Algodón",
  discountPercentage: 0,
  product: [
    {
      color: "Blanco",
      size: ["S", "M", "L"],
      images: ["/minimal-editorial-shirt.png"]
    },
  ]
}

export default function ProductCard({ product = PLACEHOLDER_PRODUCT, showQuickBuy = true }: Props) {
  const { addItem, setOpen, beginCheckout } = useCart()
  const primaryImage = product.product[0].images[0] || "/placeholder.svg"

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id, // Added product reference
      title: product.title,
      price: product.price,
      image: primaryImage,
      qty: 1,
      color: product.product[0].color,
      size: product.product[0].size[0] // Default to first available size
    })
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    handleAdd(e)
    setOpen(true)
    beginCheckout()
  }

  return (
    <article className="group grid gap-3">
      <Link href={`/product/${product.id}`} className="relative block">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={primaryImage}
            alt={`Imagen de ${product.title}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority={false}
          />

          {showQuickBuy && (
            <Button
              variant="secondary"
              size="icon"
              aria-label="Agregar al carrito"
              className="absolute right-2 top-2 h-9 w-9 opacity-95 hover:opacity-100 transition-opacity"
              onClick={handleAdd}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Link>

      <div className="px-1"> {/* Added padding for better text alignment */}
        <Link href={`/product/${product.id}`}>
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
            <div className="text-sm whitespace-nowrap pl-2">
              {formatCurrency(product.price)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {product.material} · {product.product[0].color}
          </p>
        </Link>
      </div>
    </article>
  )
}