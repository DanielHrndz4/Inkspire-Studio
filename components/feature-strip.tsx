import { Truck, Wand2, BadgeCheck, Headphones } from 'lucide-react'

export default function FeatureStrip() {
  const items = [
    { icon: Truck, title: "Envío gratis", desc: "A partir de 120€" },
    { icon: Wand2, title: "Personalización total", desc: "Texto, imagen y color" },
    { icon: BadgeCheck, title: "Calidad premium", desc: "Materiales seleccionados" },
    { icon: Headphones, title: "Soporte 7 días", desc: "Te acompañamos en todo" },
  ]
  return (
    <section aria-label="Beneficios clave" className="border-y bg-white">
      <div className="container mx-auto px-4 py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
