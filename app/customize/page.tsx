"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import TShirtViewer from "@/components/tshirt-viewer"
import { useCart } from "@/components/cart"
import { formatCurrency } from "@/lib/format"
import { Upload, Move, RotateCw, ZoomIn, Trash2, Plus } from 'lucide-react'
import { CartProvider } from "@/components/cart"
import { Slider } from "@/components/ui/slider"

type Garment = "Camisa" | "Hoodie"
type Placement = {
  x: number
  y: number
  rotation: number
  scale: number
  area: string
}
type CustomElement = {
  id: string
  type: 'text' | 'image'
  content: string
  placement: Placement
}

const BASE_PRICE: Record<Garment, number> = { Camisa: 89, Hoodie: 75 }
const COLORS: Record<Garment, string[]> = {
  Camisa: ["Blanco", "Negro", "Celeste", "Azul Marino"],
  Hoodie: ["Negro", "Gris", "Blanco", "Azul"],
}
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const
const COLOR_VALUES: Record<string, string> = {
  Blanco: "#ffffff",
  Negro: "#000000",
  Celeste: "#87ceeb",
  "Azul Marino": "#000080",
  Gris: "#808080",
  Azul: "#0000ff",
}
const AREAS = [
  { id: "pecho", label: "Pecho (pequeño)", extra: 6, defaultPosition: { x: 0, y: 30, z: 0.1 } },
  { id: "frente", label: "Frente completo", extra: 12, defaultPosition: { x: 0, y: 0, z: 0.1 } },
  { id: "espalda", label: "Espalda completa", extra: 12, defaultPosition: { x: 0, y: 0, z: -0.1 } },
  { id: "manga_izq", label: "Manga izquierda", extra: 5, defaultPosition: { x: -30, y: 0, z: 0.1 } },
  { id: "manga_der", label: "Manga derecha", extra: 5, defaultPosition: { x: 30, y: 0, z: 0.1 } },
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
  const [customElements, setCustomElements] = useState<CustomElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [currentArea, setCurrentArea] = useState<string>("pecho")
  const [text, setText] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { addItem } = useCart()

  // Reset color al cambiar prenda
  useEffect(() => {
    setColor(COLORS[garment][0])
  }, [garment])

  const price = useMemo(() => {
    const base = BASE_PRICE[garment]
    const areaExtras = customElements.reduce((total, el) => {
      const area = AREAS.find(a => a.id === el.placement.area)
      return total + (area?.extra || 0)
    }, 0)
    const textExtra = customElements.filter(e => e.type === 'text').length * 4
    const imageExtra = customElements.filter(e => e.type === 'image').length * 8
    return base + areaExtras + textExtra + imageExtra
  }, [garment, customElements])

  const previewImage = useMemo(() => {
    // Imagen base según prenda y color (placeholder)
    const query = `${garment.toLowerCase()} ${color.toLowerCase()} mockup minimal`
    return `/placeholder.svg?height=1200&width=1200&query=${encodeURIComponent(query)}`
  }, [garment, color])

  const onFileChange = (file?: File) => {
    if (!file) {
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const areaData = AREAS.find(a => a.id === currentArea)
        const newElement: CustomElement = {
          id: `img-${Date.now()}`,
          type: 'image',
          content: reader.result,
          placement: { 
            x: 0, 
            y: 0, 
            rotation: 0, 
            scale: 1,
            area: currentArea
          }
        }
        setCustomElements(prev => [...prev, newElement])
        setSelectedElement(newElement.id)
      }
    }
    reader.readAsDataURL(file)
  }

  const addTextElement = () => {
    if (!text.trim()) return
    
    const newElement: CustomElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: text,
      placement: { 
        x: 0, 
        y: 0, 
        rotation: 0, 
        scale: 1,
        area: currentArea
      }
    }
    setCustomElements(prev => [...prev, newElement])
    setSelectedElement(newElement.id)
    setText("")
  }

  const updateElementPlacement = (id: string, updates: Partial<Placement>) => {
    setCustomElements(prev => 
      prev.map(el => 
        el.id === id 
          ? { ...el, placement: { ...el.placement, ...updates } } 
          : el
      )
    )
  }

  const removeElement = (id: string) => {
    setCustomElements(prev => prev.filter(el => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  const selectedElementData = customElements.find(el => el.id === selectedElement)

  const addToCart = () => {
    const title = `${garment} personalizado`
    const id = `custom-${garment}-${color}-${size}-${Math.random().toString(36).slice(2, 8)}`
    const image = previewImage
    
    // Guardar los elementos personalizados para la producción
    const customizationData = customElements.map(el => ({
      type: el.type,
      content: el.type === 'image' ? el.content : undefined,
      text: el.type === 'text' ? el.content : undefined,
      placement: el.placement
    }))

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
      customization: customizationData,
    })
  }

  return (
    <>
      {/* Vista previa */}
      <section className="grid gap-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
          <TShirtViewer
            color={COLOR_VALUES[color]}
            customElements={customElements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={updateElementPlacement}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Haz clic en la camiseta para colocar elementos. Usa los controles para ajustar posición, rotación y tamaño.
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

        {/* Área de colocación */}
        <div className="grid gap-3">
          <Label className="text-xs uppercase tracking-widest">Área de colocación</Label>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <Button 
                key={area.id} 
                variant={area.id === currentArea ? "default" : "outline"} 
                className="rounded-md h-9 px-3 text-xs"
                onClick={() => setCurrentArea(area.id)}
              >
                {area.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            +{formatCurrency(AREAS.find(a => a.id === currentArea)?.extra || 0)}
          </p>
        </div>

        {/* Elementos personalizados */}
        {customElements.length > 0 && (
          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-widest">Elementos añadidos</Label>
            <div className="grid gap-2">
              {customElements.map((element) => (
                <div 
                  key={element.id} 
                  className={`flex items-center justify-between p-2 border rounded-md ${selectedElement === element.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <div className="flex items-center gap-2">
                    {element.type === 'text' ? (
                      <span className="text-sm">Texto: "{element.content}"</span>
                    ) : (
                      <div className="w-8 h-8 bg-cover bg-center rounded border" style={{ backgroundImage: `url(${element.content})` }} />
                    )}
                    <span className="text-xs text-muted-foreground">
                      ({AREAS.find(a => a.id === element.placement.area)?.label})
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeElement(element.id) }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controles para el elemento seleccionado */}
        {selectedElementData && (
          <div className="grid gap-3 p-3 border rounded-md">
            <Label className="text-xs uppercase tracking-widest">Ajustar elemento seleccionado</Label>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label>Posición X</Label>
                <span className="text-xs text-muted-foreground">{selectedElementData.placement.x}</span>
              </div>
              <Slider
                value={[selectedElementData.placement.x]}
                onValueChange={([value]) => updateElementPlacement(selectedElementData.id, { x: value })}
                min={-100}
                max={100}
                step={1}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label>Posición Y</Label>
                <span className="text-xs text-muted-foreground">{selectedElementData.placement.y}</span>
              </div>
              <Slider
                value={[selectedElementData.placement.y]}
                onValueChange={([value]) => updateElementPlacement(selectedElementData.id, { y: value })}
                min={-100}
                max={100}
                step={1}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label>Rotación</Label>
                <span className="text-xs text-muted-foreground">{selectedElementData.placement.rotation}°</span>
              </div>
              <Slider
                value={[selectedElementData.placement.rotation]}
                onValueChange={([value]) => updateElementPlacement(selectedElementData.id, { rotation: value })}
                min={-180}
                max={180}
                step={1}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label>Escala</Label>
                <span className="text-xs text-muted-foreground">{selectedElementData.placement.scale}x</span>
              </div>
              <Slider
                value={[selectedElementData.placement.scale]}
                onValueChange={([value]) => updateElementPlacement(selectedElementData.id, { scale: value })}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>

            <div className="grid gap-2">
              <Label>Área</Label>
              <select 
                value={selectedElementData.placement.area}
                onChange={(e) => updateElementPlacement(selectedElementData.id, { area: e.target.value })}
                className="p-2 border rounded-md"
              >
                {AREAS.map(area => (
                  <option key={area.id} value={area.id}>{area.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Texto / monograma opcional */}
        <div className="grid gap-2">
          <Label className="text-xs uppercase tracking-widest">Añadir texto</Label>
          <div className="flex gap-2">
            <Textarea 
              placeholder="Ej. Inkspire" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addTextElement} disabled={!text.trim()} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1" /> Añadir
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">+{formatCurrency(4)} por texto.</p>
        </div>

        {/* Subir imagen */}
        <div className="grid gap-2">
          <Label className="text-xs uppercase tracking-widest">Subir imagen</Label>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Seleccionar archivo</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0])}
              className="hidden"
              aria-label="Subir imagen"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Formatos: JPG, PNG, SVG. Tamaño recomendado 2000px. +{formatCurrency(8)} por imagen.
          </p>
        </div>

        <div className="grid gap-2">
          <Button className="h-11 rounded-none" onClick={addToCart}>
            Agregar al carrito - {formatCurrency(price)}
          </Button>
          <p className="text-xs text-muted-foreground">Producción estimada: 3-5 días hábiles.</p>
        </div>
      </section>
    </>
  )
}