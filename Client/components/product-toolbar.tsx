"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Grid2x2, Grid3x3, Filter } from 'lucide-react'

type Props = {
  total?: number
  search?: string
  onSearchChange?: (q: string) => void
  sort?: string
  onSortChange?: (s: string) => void
  cols?: 3 | 4
  onColsChange?: (c: 3 | 4) => void
  onOpenFilters?: () => void
}

export default function ProductToolbar({
  total = 0,
  search = "",
  onSearchChange = () => {},
  sort = "relevance",
  onSortChange = () => {},
  cols = 3,
  onColsChange = () => {},
  onOpenFilters = () => {},
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground"></p>
        <Separator orientation="vertical" className="hidden h-4 md:block" />
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={onOpenFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[280px]">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="title-asc">A-Z</SelectItem>
              <SelectItem value="title-desc">Z-A</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden md:flex items-center gap-1" aria-label="Densidad de grilla">
            <Button
              type="button"
              variant={cols === 3 ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => onColsChange(3)}
              aria-pressed={cols === 3}
              title="Grilla 3 columnas"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={cols === 4 ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => onColsChange(4)}
              aria-pressed={cols === 4}
              title="Grilla 4 columnas"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
