"use client"

import { useMemo, useState, useEffect } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductCard from "@/components/product-card"
import Breadcrumbs from "@/components/breadcrumbs"
import { listProductsByCategory, products } from "@/lib/data"
import { notFound, useSearchParams, usePathname } from "next/navigation"
import { CartProvider } from "@/components/cart"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaginatedGrid from "@/components/paginated-grid"
import { getVisibilityMap } from "@/lib/admin-store"

type Props = { params: { slug: string } }

export default function CategoryDetailPage({ params }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const categories = products.map((p) => p.category)
  const uniqueCategories = categories.reduce<string[]>((acc, cat) => {
    if (!acc.includes(cat)) acc.push(cat)
    return acc
  }, [])
  const cat = uniqueCategories.find((c) => c.name === params.name)
  if (!cat) return notFound()

  const initialAudience = (searchParams.get("audiencia") ?? "").toLowerCase()
  const initialQuery = searchParams.get("q") ?? ""
  const initialSort = (searchParams.get("sort") ?? "relevance").toLowerCase()

  const baseItemsRaw = useMemo(() => listProductsByCategory(cat.title), [cat.title])
  const visibility = useMemo(() => getVisibilityMap(), [])
  const baseItems = useMemo(
    () => baseItemsRaw.filter((p) => visibility[p.id] !== false),
    [baseItemsRaw, visibility]
  )

  // Estado de filtros
  const [q, setQ] = useState(initialQuery)
  const [colors, setColors] = useState<string[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const [audiencia, setAudiencia] = useState<string>(initialAudience)
  const [sort, setSort] = useState<string>(initialSort)

  useEffect(() => {
    setAudiencia(initialAudience)
    setQ(initialQuery)
    setSort(initialSort)
  }, [initialAudience, initialQuery, initialSort])

  // Opciones disponibles
  const colorsAll = useMemo(() => {
    const set = new Set<string>()
    baseItems.forEach((p) => {
      p.product.forEach(variant => {
        set.add(variant.color)
      })
    })
    return Array.from(set)
  }, [baseItems])

  const materialsAll = useMemo(() => {
    const set = new Set<string>()
    baseItems.forEach((p) => set.add(p.material))
    return Array.from(set)
  }, [baseItems])

  // Aplicar filtros
  const filteredItems = useMemo(() => {
    let items = baseItems

    if (audiencia) {
      items = items.filter((p) => 
        p.type === "hoodie" && audiencia === "hombres" ||
        p.type === "t-shirt" && audiencia === "mujeres" ||
        (p.category?.name?.toLowerCase() ?? "").includes(audiencia)
      )
    }

    const term = q.trim().toLowerCase()
    if (term) {
      items = items.filter(
        (p) => p.title.toLowerCase().includes(term) || 
               p.description.toLowerCase().includes(term)
      )
    }

    if (colors.length > 0) {
      items = items.filter((p) => 
        p.product.some(variant => colors.includes(variant.color))
      )
    }

    if (materials.length > 0) {
      items = items.filter((p) => materials.includes(p.material))
    }

    switch (sort) {
      case "price-asc":
        items = [...items].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        items = [...items].sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    return items
  }, [baseItems, audiencia, q, colors, materials, sort])

  // Sincronizar a URL (q, audiencia, sort)
  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (audiencia) params.set("audiencia", audiencia)
    if (sort && sort !== "relevance") params.set("sort", sort)
    const newUrl = `${pathname}${params.toString() ? `?${params}` : ""}`
    window.history.replaceState(null, "", newUrl)
  }, [q, audiencia, sort, pathname])

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    if (list.includes(value)) setter(list.filter((v) => v !== value))
    else setter([...list, value])
  }

  const resetFilters = () => {
    setColors([])
    setMaterials([])
    setAudiencia(initialAudience || "")
    setQ("")
    setSort("relevance")
  }

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 pt-8 pb-10 grid gap-5">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Categorías", href: "/categories" },
              { label: cat.title },
            ]}
          />

          <header className="grid gap-2">
            <h1 className="text-2xl md:text-3xl tracking-tight">
              {cat.title}
              {audiencia ? ` · ${capitalize(audiencia)}` : ""}
            </h1>
            {cat.description ? <p className="text-sm text-muted-foreground">{cat.description}</p> : null}
          </header>

          <section className="grid gap-8 md:grid-cols-[280px_1fr]">
            <aside className="md:sticky md:top-20 md:h-fit grid gap-6">
              {/* Buscador */}
              <div className="grid gap-2">
                <Label htmlFor="q" className="text-xs uppercase tracking-widest text-muted-foreground">
                  {`Buscar en ${cat.title.toLowerCase()}`}
                </Label>
                <Input
                  id="q"
                  placeholder="Ej. white, oxford, anime..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="rounded-none"
                />
              </div>

              {/* Audiencia */}
              <div className="grid gap-2">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Audiencia</div>
                <div className="flex flex-wrap gap-2">
                  {["hombres", "mujeres", "niños"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAudiencia((prev) => (prev === a ? "" : a))}
                      className={`text-xs px-3 py-1 rounded-full border ${audiencia === a ? "bg-foreground text-background" : "bg-background text-foreground"
                        }`}
                      aria-pressed={audiencia === a}
                    >
                      {capitalize(a)}
                    </button>
                  ))}
                </div>
              </div>

              <Accordion type="multiple" defaultValue={["color", "material"]}>
                <AccordionItem value="color">
                  <AccordionTrigger className="text-base">
                    Color
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {colorsAll.length === 0 && (
                        <div className="text-xs text-muted-foreground">Sin opciones de color</div>
                      )}
                      {colorsAll.map((c) => (
                        <Label key={c} className="flex items-center gap-2 font-normal">
                          <Checkbox
                            checked={colors.includes(c)}
                            onCheckedChange={() => toggle(colors, c, setColors)}
                          />
                          {c}
                        </Label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="material">
                  <AccordionTrigger className="text-base">
                    Material
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {materialsAll.length === 0 && (
                        <div className="text-xs text-muted-foreground">Sin opciones de material</div>
                      )}
                      {materialsAll.map((m) => (
                        <Label key={m} className="flex items-center gap-2 font-normal">
                          <Checkbox
                            checked={materials.includes(m)}
                            onCheckedChange={() => toggle(materials, m, setMaterials)}
                          />
                          {m}
                        </Label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {(colors.length > 0 || materials.length > 0 || audiencia || q) && (
                <button
                  onClick={resetFilters}
                  className="text-xs px-3 py-2 rounded-md border mt-2 w-fit hover:bg-muted"
                >
                  Limpiar filtros
                </button>
              )}
            </aside>

            <section className="grid gap-6">
              {/* Chips activos */}
              {(colors.length > 0 || materials.length > 0 || audiencia || q) && (
                <div className="flex flex-wrap gap-2">
                  {q && <span className="text-xs px-2 py-1 rounded-full border">Búsqueda: {q}</span>}
                  {audiencia && (
                    <span className="text-xs px-2 py-1 rounded-full border inline-flex items-center h-6">
                      Audiencia: {capitalize(audiencia)}
                    </span>
                  )}
                  {colors.map((c) => (
                    <span key={`c-${c}`} className="text-xs px-2 py-1 rounded-full border">
                      Color: {c}
                    </span>
                  ))}
                  {materials.map((m) => (
                    <span key={`m-${m}`} className="text-xs px-2 py-1 rounded-full border">
                      Material: {m}
                    </span>
                  ))}
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-600">No encontramos productos</h3>
                  <p className="text-gray-500 max-w-md">Parece que no hay items disponibles con los filtros actuales.</p>
                </div>
              ) : (
                <PaginatedGrid
                  items={filteredItems}
                  initialPageSize={12}
                  perPageOptions={[12, 24, 36]}
                  renderItem={(p) => <ProductCard key={p.id} product={p} />}
                />
              )}
            </section>
          </section>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}