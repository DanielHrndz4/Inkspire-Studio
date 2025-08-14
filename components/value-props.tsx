import { ShieldCheck, Recycle, Sparkles, MessageSquare } from 'lucide-react'

export default function ValueProps() {
  const values = [
    { icon: ShieldCheck, title: "Garantía de satisfacción", desc: "Reimpresión si hay defectos." },
    { icon: Recycle, title: "Tintas eco", desc: "Procesos responsables con el ambiente." },
    { icon: Sparkles, title: "Control de calidad", desc: "Revisión manual antes del envío." },
    { icon: MessageSquare, title: "Atención rápida", desc: "WhatsApp y email en menos de 24h." },
  ]
  return (
    <section aria-label="Por qué elegirnos" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="text-center">
          <h2 className="text-xl md:text-2xl tracking-tight">Más razones para elegir Inkspire</h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
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
