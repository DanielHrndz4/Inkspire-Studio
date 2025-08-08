import Image from "next/image"
import Link from "next/link"
import { type Category } from "@/lib/categories"

type Props = {
  categories: Category[]
  title?: string
  subtitle?: string
}

export default function CategorySpotlight({
  categories,
  title = "Capítulos",
  subtitle = "Explora por categoría como si fuera una galería",
}: Props) {
  return (
    <section aria-label="Categorías destacadas" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="grid gap-1">
          <h2 className="text-xl md:text-2xl tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </header>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-md"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={cat.image || "/placeholder.svg?height=1200&width=900&query=categoria%20editorial"}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="text-xs uppercase tracking-widest opacity-80">Capítulo</div>
                <div className="text-2xl font-light">{cat.title}</div>
                {cat.description ? <div className="text-sm opacity-80 mt-1">{cat.description}</div> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
