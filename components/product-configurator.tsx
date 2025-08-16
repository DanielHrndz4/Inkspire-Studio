"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency } from "@/lib/format"
import { useCart } from "./cart"
import { Products } from "@/interface/product.interface"

type Props = {
  product?: Products
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const FITS = ["Slim", "Regular"]
const COMMON_COLORS = ["Blanco", "Negro", "Celeste", "Azul Marino"]

export default function ProductConfigurator({ product }: Props) {
  const p = product ?? {
    id: "placeholder",
    title: "Camisa Essential",
    price: 89,
    type: "t-shirt",
    category: "Camisas",
    material: "Algodón",
    discountPercentage: 0,
    product: {
      color: "Blanco",
      size: ["S", "M", "L"],
      images: ["/placeholder.svg"]
    },
    description: "Corte atemporal con materiales premium.",
  }

  const [size, setSize] = useState(p.product.size[1] ?? "M") // Default to middle size if available
  const [fit, setFit] = useState("Slim")
  const [color, setColor] = useState(p.product.color ?? "Blanco")
  const [monogram, setMonogram] = useState("")

  const { addItem } = useCart()

  const preview = useMemo(() => {
    // Use first image since we now have single color per product
    return p.product.images[0] ?? "/placeholder.svg"
  }, [p.product.images])

  const handleAdd = () => {
    const id = `${p.id}-${size}-${fit}-${color}-${monogram || "nm"}-${Math.random().toString(36).slice(2, 8)}`
    addItem({
      id,
      title: p.title,
      price: p.price,
      image: preview,
      qty: 1,
      size,
      fit,
      color,
      monogram: monogram.trim() || undefined,
      productId: p.id, // Added product ID for reference
    })
  }

  return (
    <div className="grid gap-6">
      <div className="text-3xl font-light tracking-tight">{p.title}</div>
      <div className="text-lg">{formatCurrency(p.price)}</div>
      <p className="text-sm text-muted-foreground">{p.description}</p>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Color</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              className="rounded-full h-9 px-4"
              disabled
            >
              {p.product.color}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Color actual: {p.product.color}</p>
        </div>

        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Corte</Label>
          <RadioGroup value={fit} onValueChange={setFit} className="flex gap-3">
            {FITS.map((f) => (
              <div key={f} className="flex items-center space-x-2 border rounded-md px-3 py-2">
                <RadioGroupItem id={`fit-${f}`} value={f} />
                <Label htmlFor={`fit-${f}`} className="cursor-pointer">
                  {f}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Talla</Label>
          <div className="flex flex-wrap gap-2">
            {(p.product.size.length > 0 ? p.product.size : SIZES).map((s) => (
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

        <div className="grid gap-2">
          <Label className="text-xs uppercase tracking-widest">Monograma (opcional)</Label>
          <Input
            maxLength={3}
            placeholder="Ej. JMG"
            value={monogram}
            onChange={(e) => setMonogram(e.target.value.toUpperCase())}
          />
          <p className="text-xs text-muted-foreground">Hasta 3 caracteres. Se borda en el puño izquierdo.</p>
        </div>

        <div className="grid gap-2">
          <Button className="h-11 rounded-none" onClick={handleAdd}>
            Agregar al carrito
          </Button>
          <p className="text-xs text-muted-foreground">Envío gratis a partir de {formatCurrency(120)}.</p>
        </div>
      </div>
    </div>
  )
}