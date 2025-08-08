import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CategoryCard from "@/components/category-card"
import { categories } from "@/lib/categories"
import { countProductsByCategorySlug } from "@/lib/data"
import { CartProvider } from "@/components/cart"

export default function CategoriesPage() {
  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-8">
          <header className="grid gap-2">
            <h1 className="text-2xl md:text-3xl tracking-tight">Categorías</h1>
            <p className="text-sm text-muted-foreground">Explora por temas y tipos de producto.</p>
          </header>
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                slug={cat.slug}
                title={cat.title}
                image={cat.image}
                count={countProductsByCategorySlug(cat.slug)}
              />
            ))}
          </section>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}
