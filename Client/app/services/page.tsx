"use client"

import { useActionState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { requestDesign } from "./actions"
import { CartProvider } from "@/components/cart"

export default function ServicesPage() {
  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-8 md:max-w-3xl">
          <header className="grid gap-2">
            <h1 className="text-2xl md:text-3xl tracking-tight">Servicios de Diseño Gráfico</h1>
            <p className="text-sm text-muted-foreground">
              Branding, ilustración, vectorización y diseños para tu merch. Cuéntanos tu idea y te contactamos.
            </p>
          </header>
          <DesignForm />
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}

function DesignForm() {
  const [state, action, pending] = useActionState(requestDesign, null)

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="service">Tipo de servicio</Label>
        <select id="service" name="service" className="h-10 rounded-md border bg-background px-3">
          <option value="branding">Branding / Logo</option>
          <option value="ilustracion">Ilustración</option>
          <option value="vectorizacion">Vectorización</option>
          <option value="merch">Diseño para merch (camisas/hoodies)</option>
          <option value="otros">Otros</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="budget">Presupuesto estimado (USD)</Label>
        <Input id="budget" name="budget" type="number" min="0" step="10" placeholder="Ej. 150" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Descripción del proyecto</Label>
        <Textarea id="message" name="message" placeholder="Cuéntanos lo que necesitas..." rows={6} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="refs">Referencias (opcional)</Label>
        <Input id="refs" name="refs" type="file" multiple />
        <p className="text-xs text-muted-foreground">Puedes adjuntar imágenes de referencia. (Demostración)</p>
      </div>

      <Button type="submit" className="h-11 rounded-none" disabled={pending}>
        {pending ? "Enviando..." : "Solicitar cotización"}
      </Button>

      {state && (
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium mb-1">¡Gracias! Hemos recibido tu solicitud.</div>
          <div className="text-sm text-muted-foreground">{state.summary}</div>
        </div>
      )}
    </form>
  )
}
