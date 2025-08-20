"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/format"
import { useCart } from "./cart"
import { Products, ProductTag } from "@/interface/product.interface"

type Props = {
  product: Products
  selectedColor: string
  onColorChange: (color: string) => void
  selectedVariant: Products['product'][0]
  onImageSelect?: (imageIndex: number) => void // Nueva prop para manejar selección de imagen
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const TAG_LABELS: Record<ProductTag, string> = {
  men: "Hombres",
  women: "Mujeres",
  kids: "Niños",
}

export default function ProductConfigurator({
  product: p,
  selectedColor,
  onColorChange,
  selectedVariant,
  onImageSelect
}: Props) {
  const [size, setSize] = useState(selectedVariant.size[0] ?? "M")
  const [fit, setFit] = useState("Slim")
  const [monogram, setMonogram] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // Estado para imagen seleccionada

  const { addItem } = useCart()

  const tags = useMemo(() => {
    const all = p.product.flatMap((v) => v.tags || [])
    return Array.from(new Set(all)) as ProductTag[]
  }, [p])

  // Imagen de preview depende del color e imagen seleccionada
  const preview = useMemo(() => {
    return selectedVariant.images[selectedImageIndex] ?? "/placeholder.svg"
  }, [selectedVariant, selectedImageIndex])

  const handleAdd = () => {
    const id = `${p.id}-${size}-${fit}-${selectedColor}-${monogram || "nm"}-${Math.random()
      .toString(36)
      .slice(2, 8)}`
    addItem({
      id,
      title: p.title,
      price: p.price,
      image: preview,
      qty: 1,
      size,
      fit,
      color: selectedColor,
      monogram: monogram.trim() || undefined,
      productId: p.id,
    })
  }

  // Reset size and image selection when variant changes
  useEffect(() => {
    setSize(selectedVariant.size[0] ?? "M")
    setSelectedImageIndex(0) // Resetear a la primera imagen al cambiar color
  }, [selectedVariant])

  // Manejar selección de imagen
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
    if (onImageSelect) {
      onImageSelect(index) // Notificar al componente padre si es necesario
    }
  }

  return (
    <div className="grid gap-6">
      <div className="text-3xl font-light tracking-tight">{p.title}</div>
      <div className="text-lg">{formatCurrency(p.price)}</div>
      <p className="text-sm text-muted-foreground">{p.description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {TAG_LABELS[tag]}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid gap-6">
        {/* Colores */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Color</Label>
          <div className="flex flex-wrap gap-2">
            {p.product.map((variant) => (
              <Button
                key={variant.color}
                variant={variant.color === selectedColor ? "default" : "outline"}
                className="rounded-full h-9 px-4"
                onClick={() => {
                  onColorChange(variant.color)
                  setSelectedImageIndex(0) // Resetear imagen al cambiar color
                }}
              >
                {variant.color}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Color actual: {selectedColor}
          </p>
        </div>

        {/* Tallas */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Talla</Label>
          <div className="flex flex-wrap gap-2">
            {(selectedVariant.size.length > 0
              ? selectedVariant.size
              : SIZES
            ).map((s) => (
              <Button
                key={s}
                variant={s === size ? "default" : "outline"}
                className="rounded-md h-9 px-3"
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Miniaturas de imágenes */}
        {selectedVariant.images.length > 1 && (
          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-widest">Vistas</Label>
            <div className="flex flex-wrap gap-2">
              {selectedVariant.images.map((img, index) => (
                <button
                  key={index}
                  className={`relative aspect-square w-16 rounded-md overflow-hidden border-2 ${
                    index === selectedImageIndex 
                      ? "border-primary" 
                      : "border-transparent"
                  }`}
                  onClick={() => handleImageSelect(index)}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Vista ${index + 1} de ${p.title}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón agregar */}
        <div className="grid gap-2">
          <Button className="h-11 rounded-none" onClick={handleAdd}>
            Agregar al carrito
          </Button>
          <p className="text-xs text-muted-foreground">
            Envío gratis a partir de {formatCurrency(120)}.
          </p>
        </div>
      </div>
    </div>
  )
}