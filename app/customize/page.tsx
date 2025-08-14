"use client"

import { useEffect, useMemo, useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useCart } from "@/components/cart"
import { formatCurrency } from "@/lib/format"
import { Upload } from 'lucide-react'
import { CartProvider } from "@/components/cart"

type Garment = "Camisa" | "Hoodie"
const BASE_PRICE: Record<Garment, number> = { Camisa: 89, Hoodie: 75 }
const COLORS: Record<Garment, string[]> = {
  Camisa: ["Blanco", "Negro", "Celeste", "Azul Marino"],
  Hoodie: ["Negro", "Gris", "Blanco", "Azul"],
}
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const
const AREAS = [
  { id: "pecho", label: "Pecho (pequeño)", extra: 6 },
  { id: "frente", label: "Frente completo", extra: 12 },
  { id: "espalda", label: "Espalda completa", extra: 12 },
  { id: "manga", label: "Manga", extra: 5 },
] as const

export default function CustomizePage() {
  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-2">
          <Customizer />
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}

function Customizer() {
  const [garment, setGarment] = useState<Garment>("Camisa")
  const [color, setColor] = useState<string>(COLORS["Camisa"][0])
  const [size, setSize] = useState<string>("M")
  const [area, setArea] = useState<typeof AREAS[number]["id"]>("pecho")
  const [text, setText] = useState<string>("")
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

  const { addItem } = useCart()

  // Reset color al cambiar prenda
  useEffect(() => {
    setColor(COLORS[garment][0])
  }, [garment])

  const price = useMemo(() => {
    const base = BASE_PRICE[garment]
    const extra = AREAS.find((a) => a.id === area)?.extra ?? 0
    const textExtra = text.trim() ? 4 : 0
    return base + extra + textExtra
  }, [garment, area, text])

  const previewImage = useMemo(() => {
    // Imagen base según prenda y color (placeholder)
    const query = `${garment.toLowerCase()} ${color.toLowerCase()} mockup minimal`
    return `/placeholder.svg?height=1200&width=1200&query=${encodeURIComponent(query)}`
  }, [garment, color])

  const onFileChange = (file?: File) => {
    if (!file) {
      setImageDataUrl(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") setImageDataUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const addToCart = () => {
    const title = `${garment} personalizado`
    const id = `custom-${garment}-${color}-${size}-${area}-${Math.random().toString(36).slice(2, 8)}`
    const image = imageDataUrl ?? previewImage
    addItem({
      id,
      slug: `custom-${garment.toLowerCase()}`,
      title,
      price,
      image,
      qty: 1,
      size,
      color,
      fit: garment === "Camisa" ? "Slim" : undefined,
      monogram: text || undefined,
    })
  }

  return (
    <>
      {/* Vista previa */}
      <section className="grid gap-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
          <Image src={imageDataUrl ?? previewImage} alt="Vista previa de diseño personalizado" fill className="object-cover" />
        </div>
        <p className="text-xs text-muted-foreground">
          La vista previa es ilustrativa. Ajustaremos proporciones y colores en producción.
        </p>
      </section>

      {/* Configurador */}
      <section className="grid gap-6">
        <div className="grid gap-1">
          <h1 className="text-2xl md:text-3xl tracking-tight">Personaliza tu prenda</h1>
          <div className="text-lg">{formatCurrency(price)}</div>
        </div>

        {/* Prenda */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Prenda</Label>
          <RadioGroup value={garment} onValueChange={(v) => setGarment(v as Garment)} className="flex gap-3">
            {(["Camisa", "Hoodie"] as Garment[]).map((g) => (
              <div key={g} className="flex items-center space-x-2 border rounded-md px-3 py-2">
                <RadioGroupItem id={`g-${g}`} value={g} />
                <Label htmlFor={`g-${g}`} className="cursor-pointer">{g}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Color */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Color</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS[garment].map((c) => (
              <Button key={c} variant={c === color ? "default" : "outline"} className="rounded-full h-9 px-4" onClick={() => setColor(c)}>
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Talla */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Talla</Label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <Button key={s} variant={s === size ? "default" : "outline"} className="rounded-md h-9 px-3" onClick={() => setSize(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Área de impresión */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Área de impresión</Label>
          <RadioGroup value={area} onValueChange={(v) => setArea(v as typeof AREAS[number]["id"])} className="grid gap-2">
            {AREAS.map((a) => (
              <div key={a.id} className="flex items-center space-x-2 border rounded-md px-3 py-2">
                <RadioGroupItem id={`area-${a.id}`} value={a.id} />
                <Label htmlFor={`area-${a.id}`} className="cursor-pointer flex-1 flex items-center justify-between">
                  <span>{a.label}</span>
                  <span className="text-xs text-muted-foreground">+ {formatCurrency(a.extra)}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Texto / monograma opcional */}
        <div className="grid gap-2">
          <Label className="text-xs uppercase tracking-widest">Texto (opcional)</Label>
          <Textarea placeholder="Ej. Inkspire" value={text} onChange={(e) => setText(e.target.value)} />
          <p className="text-xs text-muted-foreground">Añade texto simple. +{formatCurrency(4)}.</p>
        </div>

        {/* Subir imagen */}
        <div className="grid gap-2">
          <Label className="text-xs uppercase tracking-widest">Subir imagen</Label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-md hover:bg-muted">
              <Upload className="h-4 w-4" />
              <span>Seleccionar archivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFileChange(e.target.files?.[0])}
                className="hidden"
                aria-label="Subir imagen"
              />
            </label>
            {imageDataUrl && (
              <Button variant="ghost" onClick={() => setImageDataUrl(null)}>
                Quitar imagen
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Formatos: JPG, PNG, SVG. Tamaño recomendado 2000px.</p>
        </div>

        <div className="grid gap-2">
          <Button className="h-11 rounded-none" onClick={addToCart}>
            Agregar al carrito
          </Button>
          <p className="text-xs text-muted-foreground">Producción estimada: 3-5 días hábiles.</p>
        </div>
      </section>
    </>
  )
}
