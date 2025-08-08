import { Card, CardContent } from "@/components/ui/card"
import { Star } from 'lucide-react'

type Testimonial = {
  name: string
  role: string
  quote: string
}

const DATA: Testimonial[] = [
  { name: "Lucía F.", role: "Brand Manager", quote: "Acabados impecables. La personalización quedó tal cual la diseñamos." },
  { name: "Diego R.", role: "Ilustrador", quote: "La tela y la impresión superaron mis expectativas. Repetiré." },
  { name: "María C.", role: "Creadora", quote: "Atención cercana y envío rápido. Se nota el cuidado en cada pieza." },
]

export default function Testimonials() {
  return (
    <section aria-label="Testimonios" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="text-center grid gap-2">
          <h2 className="text-xl md:text-2xl tracking-tight">Lo que dicen nuestros clientes</h2>
          <p className="text-sm text-muted-foreground">Calidad que se siente. Servicio que destaca.</p>
        </header>
        <div className="grid md:grid-cols-3 gap-6">
          {DATA.map((t) => (
            <Card key={t.name} className="bg-white">
              <CardContent className="p-6 grid gap-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed">{'“'}{t.quote}{'”'}</blockquote>
                <div className="text-sm">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
