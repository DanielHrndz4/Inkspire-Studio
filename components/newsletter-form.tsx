"use client"

import { useActionState } from "react"
import { subscribeNewsletter } from "@/app/actions/newsletter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, null)

  return (
    <section aria-label="Newsletter" className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="border rounded-md p-6 md:p-8 grid gap-4 md:grid-cols-[1fr_auto] items-center bg-white">
          <div className="grid gap-1">
            <h3 className="text-lg md:text-xl tracking-tight">Únete a Inkspire Studio</h3>
            <p className="text-sm text-muted-foreground">Nuevos lanzamientos, ofertas y tips de diseño.</p>
          </div>
          <form action={action} className="flex gap-2 w-full md:w-auto">
            <Input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="rounded-none md:w-[280px]"
              aria-label="Correo electrónico"
            />
            <Button type="submit" className="rounded-none" disabled={pending}>
              {pending ? "Enviando..." : "Suscribirme"}
            </Button>
          </form>
          {state && (
            <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-destructive"}`}>{state.message}</p>
          )}
        </div>
      </div>
    </section>
  )
}
