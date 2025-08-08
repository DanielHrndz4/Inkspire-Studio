"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Grid2x2, Grid3x3 } from 'lucide-react'
import { useIntersection } from "@/hooks/use-intersection"

type Props<T> = {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  initialPageSize?: number
  perPageOptions?: number[]
  pageParamKey?: string
  perPageParamKey?: string
  enableInfiniteToggle?: boolean
}

export default function PaginatedGrid<T>({
  items,
  renderItem,
  initialPageSize = 12,
  perPageOptions = [12, 24, 36],
  pageParamKey = "page",
  perPageParamKey = "perPage",
  enableInfiniteToggle = true,
}: Props<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const spPage = Number(searchParams.get(pageParamKey) || 1)
  const spPerPage = Number(searchParams.get(perPageParamKey) || initialPageSize)

  const [page, setPage] = useState<number>(isNaN(spPage) || spPage < 1 ? 1 : spPage)
  const [perPage, setPerPage] = useState<number>(isNaN(spPerPage) ? initialPageSize : spPerPage)
  const [cols, setCols] = useState<3 | 4>(3)
  const [infinite, setInfinite] = useState<boolean>(true)

  useEffect(() => {
    // Si los parámetros de URL cambian externamente, sincronizar
    const p = Number(searchParams.get(pageParamKey) || 1)
    const pp = Number(searchParams.get(perPageParamKey) || initialPageSize)
    if (!isNaN(p) && p !== page) setPage(Math.max(1, p))
    if (!isNaN(pp) && pp !== perPage) setPerPage(pp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    // Sync hacia la URL
    const params = new URLSearchParams(searchParams.toString())
    if (page > 1) params.set(pageParamKey, String(page))
    else params.delete(pageParamKey)
    if (perPage !== initialPageSize) params.set(perPageParamKey, String(perPage))
    else params.delete(perPageParamKey)
    const url = `${pathname}${params.toString() ? `?${params}` : ""}`
    window.history.replaceState(null, "", url)
  }, [page, perPage, pathname, searchParams, pageParamKey, perPageParamKey, initialPageSize])

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  // Paginación
  const pageItems = useMemo(() => {
    if (infinite) {
      const count = Math.min(total, page * perPage)
      return items.slice(0, count)
    }
    const start = (page - 1) * perPage
    return items.slice(start, start + perPage)
  }, [items, page, perPage, total, infinite])

  // Infinite scroll con "sentinel"
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hitBottom = useIntersection(sentinelRef, { rootMargin: "400px 0px 0px 0px" })

  useEffect(() => {
    if (!infinite) return
    if (hitBottom && page < totalPages) {
      setPage((p) => Math.min(totalPages, p + 1))
    }
  }, [hitBottom, page, totalPages, infinite])

  const GridClass = cols === 4 ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-6" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {total} {total === 1 ? "resultado" : "resultados"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:flex items-center gap-1" aria-label="Densidad de grilla">
            <Button
              type="button"
              variant={cols === 3 ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setCols(3)}
              aria-pressed={cols === 3}
              title="Grilla 3 columnas"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={cols === 4 ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setCols(4)}
              aria-pressed={cols === 4}
              title="Grilla 4 columnas"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={String(perPage)}
            onValueChange={(v) => {
              const n = Number(v)
              setPerPage(n)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Por página" />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {enableInfiniteToggle && (
            <label className="text-sm inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={infinite}
                onChange={(e) => {
                  setInfinite(e.target.checked)
                  setPage(1)
                }}
              />
              Carga infinita
            </label>
          )}
        </div>
      </div>

      <div className={GridClass}>
        {pageItems.map((it, i) => renderItem(it, i))}
      </div>

      {/* Controles de paginación cuando NO es infinito */}
      {!infinite && totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
              const n = idx + 1
              return (
                <Button
                  key={n}
                  variant={n === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              )
            })}
            {totalPages > 7 && <span className="text-sm text-muted-foreground px-2">… {totalPages}</span>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Botón cargar más cuando es infinito y hay más páginas */}
      {infinite && page < totalPages && (
        <div className="grid place-items-center pt-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Cargar más
          </Button>
        </div>
      )}

      {/* Sentinel para auto-cargar al hacer scroll */}
      {infinite && page < totalPages && <div ref={sentinelRef} className="h-6" />}
    </div>
  )
}
