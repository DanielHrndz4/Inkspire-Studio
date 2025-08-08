"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import PriceRange from "@/components/price-range"
import { Button } from "@/components/ui/button"

type Props = {
  allColors?: string[]
  allFabrics?: string[]
  selectedColors?: string[]
  selectedFabrics?: string[]
  onToggleColor?: (c: string) => void
  onToggleFabric?: (f: string) => void
  priceMin?: number
  priceMax?: number
  priceValue?: [number, number]
  onPriceChange?: (range: [number, number]) => void
  onClearAll?: () => void
}

export default function FiltersPanel({
  allColors = [],
  allFabrics = [],
  selectedColors = [],
  selectedFabrics = [],
  onToggleColor = () => {},
  onToggleFabric = () => {},
  priceMin = 0,
  priceMax = 1000,
  priceValue = [priceMin, priceMax],
  onPriceChange = () => {},
  onClearAll = () => {},
}: Props) {
  const hasAny = selectedColors.length > 0 || selectedFabrics.length > 0 || (priceValue[0] > priceMin || priceValue[1] < priceMax)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">Filtros</h2>
        {hasAny && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Limpiar
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["color", "fabric", "price"]}>
        <AccordionItem value="color">
          <AccordionTrigger className="text-base">Color</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {allColors.map((c) => (
                <Label key={c} className="flex items-center gap-2 font-normal">
                  <Checkbox checked={selectedColors.includes(c)} onCheckedChange={() => onToggleColor(c)} />
                  {c}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fabric">
          <AccordionTrigger className="text-base">Tejido</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {allFabrics.map((f) => (
                <Label key={f} className="flex items-center gap-2 font-normal">
                  <Checkbox checked={selectedFabrics.includes(f)} onCheckedChange={() => onToggleFabric(f)} />
                  {f}
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base">Precio</AccordionTrigger>
          <AccordionContent>
            <PriceRange
              min={priceMin}
              max={priceMax}
              value={priceValue}
              onChange={onPriceChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
