"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { products } from "@/lib/data"

export default function ShirtsFilter() {
  const shirts = useMemo(() => products.filter((p) => p.category.toLowerCase() === "camisas" || (p.tags ?? []).includes("camisas")), [])
  const colorsAll = useMemo(() => {
    const set = new Set<string>()
    shirts.forEach((p) => p.colors.forEach((c) => set.add(c)))
    return Array.from(set)
  }, [shirts])
  const fabricsAll = useMemo(() => {
    const set = new Set<string>()
    shirts.forEach((p) => p.fabrics.forEach((f) => set.add(f)))
    return Array.from(set)
  }, [shirts])

  const [colors, setColors] = useState<string[]>([])
  const [fabrics, setFabrics] = useState<string[]>([])

  const filtered = shirts.filter((p) => {
    const cOK = colors.length === 0 || p.colors.some((c) => colors.includes(c))
    const fOK = fabrics.length === 0 || p.fabrics.some((f) => fabrics.includes(f))
    return cOK && fOK
  })

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    if (list.includes(value)) setter(list.filter((v) => v !== value))
    else setter([...list, value])
  }

  return (
    <section aria-label="Camisas con filtros" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-8">
        <header className="flex items-end justify-between">
          <div className="grid gap-2">
            <h2 className="text-xl md:text-2xl tracking-tight" style={{ color: "#262b33" }}>Camisas — Filtra y descubre</h2>
            <div className="h-0.5 w-12" style={{ backgroundColor: "#ea6f49" }} />
          </div>
          <Link href="/categories/camisas" className="text-sm hover:underline underline-offset-4" style={{ color: "#4377b0" }}>
            Ver todas las camisas
          </Link>
        </header>

        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <aside className="md:sticky md:top-20 md:h-fit">
            <Accordion type="multiple" defaultValue={["color", "fabric"]}>
              <AccordionItem value="color">
                <AccordionTrigger className="text-base" style={{ color: "#262b33" }}>Color</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {colorsAll.map((c) => (
                      <Label key={c} className="flex items-center gap-2 font-normal" style={{ color: "#6a5d86" }}>
                        <Checkbox checked={colors.includes(c)} onCheckedChange={() => toggle(colors, c, setColors)} />
                        {c}
                      </Label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fabric">
                <AccordionTrigger className="text-base" style={{ color: "#262b33" }}>Tejido</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {fabricsAll.map((f) => (
                      <Label key={f} className="flex items-center gap-2 font-normal" style={{ color: "#6a5d86" }}>
                        <Checkbox checked={fabrics.includes(f)} onCheckedChange={() => toggle(fabrics, f, setFabrics)} />
                        {f}
                      </Label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Chips de selección */}
            {(colors.length > 0 || fabrics.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span key={`c-${c}`} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#cdcbcc", color: "#262b33" }}>
                    {c}
                  </span>
                ))}
                {fabrics.map((f) => (
                  <span key={`f-${f}`} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#cdcbcc", color: "#262b33" }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </aside>

          <section className="grid gap-6">
            <div className="text-sm" style={{ color: "#6a5d86" }}>{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
              {filtered.length === 0 && <p className="text-sm" style={{ color: "#6a5d86" }}>No hay camisas con esos filtros.</p>}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
