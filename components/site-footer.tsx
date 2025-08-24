import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div className="grid gap-4">
          <div className="flex flex-row gap-2 items-center">
            <img src="/logo.png" alt="Inkspire Studio" className="w-10"/>
            <div className="font-semibold tracking-widest uppercase">Inkspire Studio</div>
          </div>
          <p className="text-sm text-muted-foreground">
            Camisas y hoodies personalizados. Diseño gráfico a medida. Calidad y presentación impecable.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-medium">Colección</div>
          <Link href="/categories/t-shirt" className="text-muted-foreground hover:opacity-70">Camisas</Link>
          <Link href="/categories/hoodie" className="text-muted-foreground hover:opacity-70">Hoodies</Link>
          <Link href="/customize" className="text-muted-foreground hover:opacity-70">Personalizar</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-medium">Atención</div>
          <Link href="#" className="text-muted-foreground hover:opacity-70">
            Envíos & Devoluciones
          </Link>
          <Link href="#" className="text-muted-foreground hover:opacity-70">
            Tallas
          </Link>
          <Link href="#" className="text-muted-foreground hover:opacity-70">
            Soporte
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-medium">Servicios</div>
          <Link href="/services" className="text-muted-foreground hover:opacity-70">Branding / Logo</Link>
          <Link href="/services" className="text-muted-foreground hover:opacity-70">Ilustración</Link>
          <Link href="/services" className="text-muted-foreground hover:opacity-70">Vectorización</Link>
          <Link href="/services" className="text-muted-foreground hover:opacity-70">Diseño merch</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-medium">Síguenos</div>
          <Link href="#" className="text-muted-foreground hover:opacity-70">
            Instagram
          </Link>
          <Link href="#" className="text-muted-foreground hover:opacity-70">
            Pinterest
          </Link>
          <Link href="#" className="text-muted-foreground hover:opacity-70">
            TikTok
          </Link>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <p>{new Date().getFullYear()} Inkspire Studio. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:opacity-70">
              Privacidad
            </Link>
            <Link href="#" className="hover:opacity-70">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
