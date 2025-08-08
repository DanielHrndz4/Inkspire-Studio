import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section aria-label="Preguntas frecuentes" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="text-center grid gap-2">
          <h2 className="text-xl md:text-2xl tracking-tight">Preguntas frecuentes</h2>
          <p className="text-sm text-muted-foreground">Todo lo que necesitas saber antes de comprar.</p>
        </header>
        <Accordion type="single" collapsible className="md:max-w-3xl mx-auto">
          <AccordionItem value="tallas">
            <AccordionTrigger>¿Cómo elijo la talla correcta?</AccordionTrigger>
            <AccordionContent>
              Consulta nuestra guía de tallas en cada producto. Si tienes dudas, contáctanos y te asesoramos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="envios">
            <AccordionTrigger>¿Cuánto tarda el envío?</AccordionTrigger>
            <AccordionContent>
              La producción tarda 3–5 días hábiles. Envíos nacionales: 2–5 días. Express disponible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="diseno">
            <AccordionTrigger>¿Revisan mi diseño antes de imprimir?</AccordionTrigger>
            <AccordionContent>
              Sí. Realizamos una revisión de calidad y te enviamos una prueba digital para tu aprobación.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="devoluciones">
            <AccordionTrigger>¿Aceptan devoluciones?</AccordionTrigger>
            <AccordionContent>
              En prendas personalizadas aplican condiciones especiales. Si hay defectos, reemplazamos sin costo.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
