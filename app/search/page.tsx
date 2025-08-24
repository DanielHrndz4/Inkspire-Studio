import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProductCard from "@/components/product-card";
import { CartProvider } from "@/components/cart";
import { searchProducts } from "@/hooks/supabase/search.supabase";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.toString() ?? "";
  const products = q ? await searchProducts(q) : [];

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8 grid gap-6">
          <h1 className="text-2xl md:text-3xl tracking-tight">
            {q ? `Resultados para "${q}"` : "Buscar productos"}
          </h1>
          {q && products.length === 0 && (
            <p className="text-muted-foreground">No se encontraron productos.</p>
          )}
          {products.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
