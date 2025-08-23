"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import Image from "next/image"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductCard from "@/components/product-card"
import { CartProvider } from "@/components/cart"
import ProductToolbar from "@/components/product-toolbar"
import FiltersPanel from "@/components/filters-panel"
import ProductSkeleton from "@/components/product-skeleton"
import { products as allProducts, getAllColors } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useIntersection } from "@/hooks/use-intersection"
import { cn } from "@/lib/utils"
import SEO from "@/components/seo"

type SortKey = "relevance" | "price-asc" | "price-desc" | "title-asc" | "title-desc"

export default function ProductsPage() {
  // Datos base
  const colorsAll = useMemo(() => getAllColors(), [])
  const minPrice = useMemo(() => Math.min(...allProducts.map((p) => p.price)), [])
  const maxPrice = useMemo(() => Math.max(...allProducts.map((p) => p.price)), [])

  // Estado de filtros
  const [query, setQuery] = useState("")
  const [colors, setColors] = useState<string[]>([])
  const [fabrics, setFabrics] = useState<string[]>([])
  const [price, setPrice] = useState<[number, number]>([minPrice, maxPrice])
  const [sort, setSort] = useState<SortKey>("relevance")
  const [cols, setCols] = useState<3 | 4>(3)

  // Paginación progresiva
  const [pageSize, setPageSize] = useState(12)
  const [page, setPage] = useState(1)
  const sentinelRef:any = useRef<HTMLDivElement | null>(null)
  const hitBottom = useIntersection(sentinelRef, { rootMargin: "480px 0px 0px 0px" })

  // UX: transiciones de filtro
  const [isPending, startTransition] = useTransition()

  // Filtrado + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = allProducts.filter((p) => {
      const matchQ = q.length === 0 || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      const matchC = colors.length === 0 || colors.includes(p.product.color)
      const matchP = p.price >= price[0] && p.price <= price[1]
      return matchQ && matchC && matchP
    })

    switch (sort) {
      case "price-asc":
        list = list.slice().sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list = list.slice().sort((a, b) => b.price - a.price)
        break
      case "title-asc":
        list = list.slice().sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        list = list.slice().sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        // relevance: mantenemos el orden natural de la lista
        break
    }
    return list
  }, [query, colors, fabrics, price, sort])

  const visible = useMemo(() => filtered.slice(0, page * pageSize), [filtered, page, pageSize])

  // Autocarga por scroll
  useEffect(() => {
    if (hitBottom && visible.length < filtered.length) {
      setPage((p) => p + 1)
    }
  }, [hitBottom, visible.length, filtered.length])

  // Reset de paginación cuando cambian filtros
  useEffect(() => {
    setPage(1)
  }, [query, colors, fabrics, price, sort, pageSize])

  // Helpers de filtro
  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    startTransition(() => setter(next))
  }

  const clearAll = () => {
    startTransition(() => {
      setQuery("")
      setColors([])
      setFabrics([])
      setPrice([minPrice, maxPrice])
      setSort("relevance")
    })
  }

  const colsClass = cols === 4 ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-6" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"

  return (
    <CartProvider>
      <SEO title="Productos" description="Explora todos nuestros productos personalizados." />
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <SiteHeader />

        {/* Toolbar */}
        <div className="">
          <div className="container mx-auto px-4 py-4">
            <ProductToolbar
              total={filtered.length}
              search={query}
              onSearchChange={(v) => startTransition(() => setQuery(v))}
              sort={sort}
              onSortChange={(v) => startTransition(() => setSort(v as SortKey))}
              cols={cols}
              onColsChange={(c) => setCols(c)}
              onOpenFilters={() => {
                // Abierto desde botón móvil - manejado por SheetTrigger más abajo
                const btn = document.getElementById("open-filters-sheet")
                btn?.click()
              }}
            />
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 grid gap-8 md:grid-cols-[280px_1fr]">
          {/* Aside escritorio */}
          <aside className="hidden md:block md:sticky md:top-20 md:h-fit">
            <FiltersPanel
              allColors={colorsAll}
              selectedColors={colors}
              selectedFabrics={fabrics}
              onToggleColor={(c) => toggle(colors, c, setColors)}
              onToggleFabric={(f) => toggle(fabrics, f, setFabrics)}
              priceMin={minPrice}
              priceMax={maxPrice}
              priceValue={price}
              onPriceChange={(r) => startTransition(() => setPrice(r))}
              onClearAll={clearAll}
            />

            {/* Chips seleccionados */}
            {(colors.length > 0 || fabrics.length > 0 || price[0] > minPrice || price[1] < maxPrice) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <Badge key={`c-${c}`} variant="secondary" className="cursor-pointer" onClick={() => toggle(colors, c, setColors)}>
                    {c}
                  </Badge>
                ))}
                {fabrics.map((f) => (
                  <Badge key={`f-${f}`} variant="secondary" className="cursor-pointer" onClick={() => toggle(fabrics, f, setFabrics)}>
                    {f}
                  </Badge>
                ))}
                {(price[0] > minPrice || price[1] < maxPrice) && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setPrice([minPrice, maxPrice])}>
                    {`Precio: ${price[0]} - ${price[1]}`}
                  </Badge>
                )}
              </div>
            )}
          </aside>

          {/* Contenido productos */}
          <section className="grid gap-6">
            {/* Drawer móvil de filtros */}
            <Sheet>
              <SheetTrigger asChild>
                <button id="open-filters-sheet" className="hidden" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <FiltersPanel
                    allColors={colorsAll}
                    selectedColors={colors}
                    selectedFabrics={fabrics}
                    onToggleColor={(c) => toggle(colors, c, setColors)}
                    onToggleFabric={(f) => toggle(fabrics, f, setFabrics)}
                    priceMin={minPrice}
                    priceMax={maxPrice}
                    priceValue={price}
                    onPriceChange={(r) => startTransition(() => setPrice(r))}
                    onClearAll={clearAll}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Grid o skeletons */}
            <div className={cn(colsClass, "min-h-[200px]")}>
              {isPending ? (
                <ProductSkeleton count={cols === 4 ? 8 : 6} />
              ) : (
                visible.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>

            {/* Empty state */}
            {!isPending && visible.length === 0 && (
              <div className="grid place-items-center rounded-md border p-10 text-center">
                <div className="max-w-sm space-y-2">
                  <h3 className="text-lg font-medium">No encontramos productos</h3>
                  <p className="text-sm text-muted-foreground">
                    Prueba a limpiar filtros o ajustar la búsqueda.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" onClick={clearAll}>Limpiar filtros</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Paginación progresiva */}
            {!isPending && visible.length < filtered.length && (
              <div className="grid place-items-center gap-3">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Cargar más</Button>
                <div ref={sentinelRef} className="h-6" />
              </div>
            )}

            {/* Cambiar tamaño de página (opcional) */}
            <div className="flex items-center gap-2 justify-end text-sm text-muted-foreground">
              <span>Mostrar</span>
              {[12, 24, 36].map((n) => (
                <Button
                  key={n}
                  size="sm"
                  variant={pageSize === n ? "default" : "ghost"}
                  onClick={() => setPageSize(n)}
                >
                  {n}
                </Button>
              ))}
              <span>por página</span>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </CartProvider>
  )
}
