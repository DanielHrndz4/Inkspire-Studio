import Link from "next/link"
import EditorialGrid from "@/components/editorial-grid"

export default function HomeCollection() {
  const tiles = [
    { type: "link", src: "/images/categories/camisas.png", alt: "Camisas", href: "/categories/camisas", label: "Camisas", kicker: "Capítulo" },
    { type: "image", src: "/lookbook-inkspire-1.png", alt: "Editorial 1" },
    { type: "link", src: "/images/categories/hoodies.png", alt: "Hoodies", href: "/categories/hoodies", label: "Hoodies", kicker: "Capítulo" },
    { type: "image", src: "/lookbook-inkspire-2.png", alt: "Editorial 2" },
    { type: "link", src: "/images/categories/anime.png", alt: "Anime", href: "/categories/anime", label: "Anime", kicker: "Temática" },
    { type: "image", src: "/lookbook-inkspire-3.png", alt: "Editorial 3" },
    { type: "link", src: "/images/categories/cars.png", alt: "Carros", href: "/categories/carros", label: "Carros", kicker: "Temática" },
    { type: "image", src: "/lookbook-inkspire-4.png", alt: "Editorial 4" },
  ] as const

  return (
    <section aria-label="Colección destacada" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="flex items-end justify-between">
          <div className="grid gap-1">
            <h2 className="text-xl md:text-2xl tracking-tight">Colección · Curaduría en portada</h2>
            <p className="text-sm text-muted-foreground">Piezas seleccionadas como en una galería</p>
          </div>
          <Link href="/collection" className="text-sm hover:underline underline-offset-4">
            Ver Colección completa
          </Link>
        </header>
      </div>
      <EditorialGrid tiles={tiles as any} title="Exhibición · Inkspire" subtitle="Prendas como arte, seleccionadas para ti" />
    </section>
  )
}
