import Image from "next/image"

export default function InstagramGrid() {
  const imgs = [
    "/lookbook-inkspire-1.png",
    "/lookbook-inkspire-2.png",
    "/lookbook-inkspire-3.png",
    "/lookbook-inkspire-4.png",
    "/lookbook-inkspire-5.png",
    "/lookbook-inkspire-6.png",
  ]
  return (
    <section aria-label="Instagram" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="text-center grid gap-1">
          <h2 className="text-xl md:text-2xl tracking-tight">Síguenos en Instagram</h2>
          <p className="text-sm text-muted-foreground">@inkspire.studio</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imgs.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md">
              <Image src={src || "/placeholder.svg"} alt={`Post ${i + 1} en Instagram`} fill className="object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
