"use client"

import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/format"

type Props = {
  min?: number
  max?: number
  value?: [number, number]
  onChange?: (range: [number, number]) => void
}

export default function PriceRange({
  min = 0,
  max = 1000,
  value = [min, max],
  onChange = () => {},
}: Props) {
  const [internal, setInternal] = useState<[number, number]>(value)

  useEffect(() => {
    setInternal(value)
  }, [value])

  const pretty = useMemo(() => `${formatCurrency(internal[0])} – ${formatCurrency(internal[1])}`, [internal])

  const clamp = (v: number) => Math.min(max, Math.max(min, v))

  return (
    <div className="grid gap-3">
      <Label className="text-xs uppercase tracking-widest">Precio</Label>
      <Slider
        value={internal}
        min={Math.floor(min)}
        max={Math.ceil(max)}
        step={1}
        onValueChange={(vals) => setInternal([vals[0] ?? min, vals[1] ?? max] as [number, number])}
        onValueCommit={(vals) => onChange([vals[0] ?? min, vals[1] ?? max] as [number, number])}
      />
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          className="h-9"
          value={internal[0]}
          onChange={(e) => {
            const val = clamp(Number(e.target.value) || min)
            const next: [number, number] = [Math.min(val, internal[1]), internal[1]]
            setInternal(next)
            onChange(next)
          }}
        />
        <span className="text-sm text-muted-foreground">a</span>
        <Input
          type="number"
          inputMode="numeric"
          className="h-9"
          value={internal[1]}
          onChange={(e) => {
            const val = clamp(Number(e.target.value) || max)
            const next: [number, number] = [internal[0], Math.max(val, internal[0])]
            setInternal(next)
            onChange(next)
          }}
        />
        <span className="text-xs text-muted-foreground ml-auto">{pretty}</span>
      </div>
    </div>
  )
}
