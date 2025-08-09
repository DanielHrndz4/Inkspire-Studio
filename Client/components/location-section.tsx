import Image from "next/image"
import { MapPin, Clock, Phone, Mail, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function LocationSection() {
  return (
    <section aria-label="Ubicación" className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-20 grid gap-8 lg:grid-cols-2">
        {/* Sección izquierda mejorada */}
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Visita nuestro estudio creativo
            </h2>
            <p className="text-base text-gray-600 max-w-md">
              Ven a inspirarte en nuestro espacio donde podrás ver muestras de materiales, 
              conocer nuestro proceso creativo y definir cada detalle de tu proyecto personalizado.
            </p>
          </div>

          <div className="space-y-4">
            {/* Información de contacto - Tarjetas interactivas */}
            <div className="p-4 rounded-lg border border-gray-100 hover:border-primary transition-colors duration-200">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dirección</h3>
                  <p className="text-gray-600 mt-1">
                    Calle Diseño 123, Col. Centro<br />
                    CDMX, 06000
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 mt-2 text-primary hover:text-primary/80"
                    asChild
                  >
                    <a 
                      href="https://maps.google.com/?q=Inkspire+Studio+Calle+Diseño+123" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en mapa →
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-100 hover:border-primary transition-colors duration-200">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horario de atención</h3>
                  <div className="text-gray-600 mt-1 space-y-1">
                    <p className="flex justify-between max-w-xs">
                      <span>Lunes a Viernes:</span>
                      <span className="font-medium">10:00 - 19:00</span>
                    </p>
                    <p className="flex justify-between max-w-xs">
                      <span>Sábados:</span>
                      <span className="font-medium">11:00 - 15:00</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      * Cerramos domingos y días festivos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-100 hover:border-primary transition-colors duration-200">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contacto directo</h3>
                  <div className="text-gray-600 mt-1 space-y-2">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href="tel:+525512345678" className="hover:text-primary">
                        +52 55 1234 5678
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:hola@inkspire.com" className="hover:text-primary">
                        hola@inkspire.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mapa (sección derecha) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <Image
            src="/images/location.png"
            alt="Mapa de ubicación de Inkspire Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-end">
            <Button 
              variant="outline" 
              className="bg-white/90 backdrop-blur-sm gap-2"
              asChild
            >
              <a 
                href="https://maps.google.com/?q=Inkspire+Studio+Calle+Diseño+123" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" />
                Cómo llegar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}