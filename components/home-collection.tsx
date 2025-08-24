import Link from "next/link"
import EditorialGrid from "@/components/editorial-grid"

export default function HomeCollection({ showCollection = true }: any) {
  const tiles = [
    { type: "link", src: "/images/ex-supra-mk4.jpeg", alt: "Supra MK4", href: "/categories/supra-mk4", label: "Supra MK4", kicker: "Capítulo" },
    { type: "image", src: "/images/lookbook-bob.jpg", alt: "Editorial 1" },
    { type: "link", src: "/images/categories/hoodies.png", alt: "Hoodies", href: "/categories/hoodie", label: "Hoodies", kicker: "Capítulo" },
    { type: "image", src: "/images/loombook-anime-hoodie.jpg", alt: "Editorial 2" },
    { type: "link", src: "/images/categories/anime.png", alt: "Anime", href: "/categories/anime", label: "Anime", kicker: "Temática" },
    { type: "image", src: "/images/lookbook-cars.jpeg", alt: "Editorial 3" },
    { type: "link", src: "/images/cat-typography.jpg", alt: "Tipografía", href: "/categories/typography", label: "Tipografía", kicker: "Temática" },
  ] as const

  return (
    <section aria-label="Colección destacada" className="bg-white">
      {showCollection &&
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
      }
      <EditorialGrid tiles={tiles as any} title="Exhibición · Inkspire" subtitle="Prendas como arte, seleccionadas para ti" />
    </section>
  )
}
