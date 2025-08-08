import Image from "next/image"
import { MapPin, Clock, Phone } from 'lucide-react'

export default function LocationSection() {
  return (
    <section aria-label="Ubicación" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-8 lg:grid-cols-2">
        <div className="grid gap-3">
          <h2 className="text-xl md:text-2xl tracking-tight">Nuestra ubicación</h2>
          <p className="text-sm text-muted-foreground">
            Visítanos en nuestro estudio para ver muestras y definir detalles de tu proyecto.
          </p>
          <div className="grid gap-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-medium">Inkspire Studio</div>
                <div>Calle Diseño 123, Col. Centro, CDMX, 06000</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-medium">Horario</div>
                <div>Lun–Vie 10:00–19:00 · Sáb 11:00–15:00</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-medium">Contacto</div>
                <div>+52 55 1234 5678</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={"/placeholder.svg?height=1200&width=1600&query=mapa%20ubicacion%20inkspire%20studio"}
            alt="Mapa de ubicación de Inkspire Studio"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
