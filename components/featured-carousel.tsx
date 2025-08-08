"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

type Props = {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function FeaturedCarousel({ children, title = "Destacados", subtitle = "Explora en carrusel" }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (delta: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-8 grid gap-4">
        <header className="flex items-end justify-between">
          <div className="grid gap-1">
            <h2 className="text-xl md:text-2xl tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => scrollBy(-400)} aria-label="Anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => scrollBy(400)} aria-label="Siguiente">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="overflow-x-auto no-scrollbar">
          <div ref={trackRef} className="flex gap-4 snap-x snap-mandatory">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
