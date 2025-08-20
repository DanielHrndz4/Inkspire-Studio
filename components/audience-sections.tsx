import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/data"
import { ProductTag, Products } from "@/interface/product.interface"

type AudienceKey = ProductTag

const AUDIENCES: { key: AudienceKey; title: string; href: string; image: string }[] = [
  { key: "men", title: "Hombres", href: "/categories/tshirts?audiencia=hombres", image: "/minimal-mens-shirts.png" },
  { key: "women", title: "Mujeres", href: "/categories/tshirts?audiencia=mujeres", image: "/minimal-inkspire-shirts.png" },
  { key: "kids", title: "Niños", href: "/categories/tshirts?audiencia=niños", image: "/minimal-kids-shirts.png" },
]

export default function AudienceSections() {
  // Función para verificar si un producto pertenece a una audiencia
  const hasAudienceTag = (product: Products, audience: AudienceKey): boolean => {
    return product.product.some((variant) =>
      variant.tags?.includes(audience)
    )
  }

  return (
    <section aria-label="Por audiencia" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-8">
        <header className="flex items-end justify-between">
          <div className="grid gap-1">
            <h2 className="text-xl md:text-2xl tracking-tight">Para él, para ella y para peques</h2>
            <p className="text-sm text-muted-foreground">Descubre selecciones curadas para cada audiencia</p>
          </div>
          <Link href="/categories" className="text-sm hover:underline underline-offset-4">
            Ver todas las categorías
          </Link>
        </header>

        <div className="grid gap-8">
          {AUDIENCES.map(({ key, title, href, image }) => {
            // Filtrar productos que tengan la tag correspondiente en alguna variante
            const subset = products.filter((p) => hasAudienceTag(p, key)).slice(0, 3)
            
            return (
              <div key={key} className="grid lg:grid-cols-2 gap-6 items-start">
                <Link href={href} className="relative aspect-[16/9] w-full overflow-hidden rounded-md">
                  <Image 
                    src={image || "/placeholder.svg"} 
                    alt={`Colección ${title}`} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <div className="text-xs uppercase tracking-widest opacity-80">{title}</div>
                    <div className="text-2xl font-light">Explorar {title.toLowerCase()}</div>
                  </div>
                </Link>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {subset.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}