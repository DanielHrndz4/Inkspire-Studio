export default function BrandGrid() {
  const brands = [
    { name: "CreatorHouse" },
    { name: "Bold Studio" },
    { name: "Linea Fine" },
    { name: "Mono Lab" },
    { name: "Arc & Co" },
    { name: "Paper Ink" },
  ]
  return (
    <section aria-label="Marcas y creadores que confían en nosotros" className="bg-white">
      <div className="container mx-auto px-4 py-10 grid gap-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Con la confianza de creadores</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((b) => (
            <div key={b.name} className="h-12 border rounded-md bg-white flex items-center justify-center text-xs tracking-widest">
              {b.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
