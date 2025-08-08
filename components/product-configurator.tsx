"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type Product } from "@/lib/types"
import { formatCurrency } from "@/lib/format"
import { useCart } from "./cart"

type Props = {
  product?: Product
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const FITS = ["Slim", "Regular"]
const COMMON_COLORS = ["Blanco", "Negro", "Celeste", "Azul Marino"]

export default function ProductConfigurator({ product }: Props) {
  const p = product ?? {
    id: "placeholder",
    slug: "camisa-essential",
    title: "Camisa Essential",
    price: 89,
    images: ["/placeholder.svg?height=900&width=900"],
    category: "Hombre",
    colors: ["Blanco", "Negro"],
    fabrics: ["Algodón"],
    description: "Corte atemporal con materiales premium.",
  }

  const [size, setSize] = useState("M")
  const [fit, setFit] = useState("Slim")
  const [color, setColor] = useState(p.colors[0] ?? "Blanco")
  const [monogram, setMonogram] = useState("")

  const { addItem } = useCart()

  const preview = useMemo(() => {
    // Buscar imagen por color si existe alguna coincidencia por nombre
    const imageByColor = p.images.find((img) => img.toLowerCase().includes(color.toLowerCase()))
    return imageByColor ?? p.images[0]
  }, [p.images, color])

  const handleAdd = () => {
    const id = `${p.slug}-${size}-${fit}-${color}-${monogram || "nm"}-${Math.random().toString(36).slice(2, 8)}`
    addItem({
      id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      image: preview,
      qty: 1,
      size,
      fit,
      color,
      monogram: monogram.trim() || undefined,
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
            {(p.colors.length > 0 ? p.colors : COMMON_COLORS).map((c) => (
              <Button
                key={c}
                variant={c === color ? "default" : "outline"}
                className="rounded-full h-9 px-4"
                onClick={() => setColor(c)}
              >
                {c}
              </Button>
            ))}
          </div>
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
            {SIZES.map((s) => (
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
