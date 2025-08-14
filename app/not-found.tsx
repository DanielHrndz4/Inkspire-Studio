import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-[70vh] container mx-auto px-4 flex items-center justify-center">
      <div className="text-center grid gap-4">
        <h1 className="text-2xl md:text-3xl tracking-tight">Página no encontrada</h1>
        <p className="text-sm text-muted-foreground">Lo sentimos, no pudimos encontrar lo que buscas.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline">Ver categorías</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
