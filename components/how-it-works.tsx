import { ImageIcon as ImgIcon, Type, Ruler, Check } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    { icon: Ruler, title: "Elige tu base", desc: "Camisa u hooodie, talla y color." },
    { icon: Type, title: "Añade texto/monograma", desc: "Tipografías limpias y elegantes." },
    { icon: ImgIcon, title: "Sube tu arte", desc: "Aceptamos JPG, PNG y SVG." },
    { icon: Check, title: "Revisión y envío", desc: "Validación de calidad y despacho." },
  ]
  return (
    <section aria-label="Cómo funciona" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-8">
        <header className="text-center grid gap-2">
          <h2 className="text-xl md:text-2xl tracking-tight">Personaliza en 3–4 pasos</h2>
          <p className="text-sm text-muted-foreground">Diseña, valida y recibe en casa.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border rounded-md p-5 bg-white">
              <div className="h-9 w-9 rounded-full border flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
