"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog as TermsDialog, DialogContent as TermsContent, DialogHeader as TermsHeader, DialogTitle as TermsTitle } from "@/components/ui/dialog"
import { useCart } from "@/components/cart"
import { useAuth } from "@/components/auth"
import { formatCurrency } from "@/lib/format"
import { useAuthStore } from "@/store/authStore"
import { createOrder } from "@/hooks/supabase/orders.supabase"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onOpenChange: (o: boolean) => void
}

export default function CheckoutDialog({ open, onOpenChange }: Props) {
  const { items, total, clear } = useCart()
  const { ensureAuth } = useAuth()
  const user = useAuthStore((state) => state.user)

  const [showTerms, setShowTerms] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState(user?.email ?? "")
  const [phone, setPhone] = useState(user?.tel ?? "")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [totalCart, setTotalCart] = useState<any>(0)

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      if (user.name) setName(user.name)
    }
  }, [user])

  const canSubmit = useMemo(() => {
    return items.length > 0 && accepted && name.trim() && email.trim() && phone.trim() && address.trim() && city.trim()
  }, [items.length, accepted, name, email, phone, address, city])

  useEffect(() => {
    if (open) {
      setTicketId(null)
      setAccepted(false)
      setLoading(false)
    }
  }, [open])

  const bank = {
    bank: "Banco Bancoagrícola",
    account: "3660600026",
    type: "Cuenta de ahorro",
    owner: "JACQUELINE GODOY",
  }

  const calculateCartTotal = (cartItems: any) => {
    return cartItems.reduce((total: any, item: any) => {
      return total + (item.qty * item.price);
    }, 0);
  };

  async function handleSubmit() {
    if (!user) {
      await ensureAuth()
    }
    if (!canSubmit) return
    setLoading(true)
    try {
      // Usamos la función createOrder para crear el pedido y los items
      const { order } = await createOrder({
        fullName: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        cart: items.map((i: any) => ({
          title: i.title,
          color: i.color,
          size: i.size,
          qty: i.qty,
          price: i.price
        }))
      })

      const sumTotalCart = calculateCartTotal(order.cart)

      setTotalCart(sumTotalCart)
      setTicketId(order.id) // guardamos el ID para mostrar el comprobante
      clear() // vaciamos el carrito
    } catch (error) {
      console.error("Error al crear el pedido:", error)
      // Aquí podrías mostrar un mensaje al usuario
    } finally {
      setLoading(false)
    }
  }
  function printReceipt() {
    window.print()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-w-[95dvw] w-full", // Añadido w-full y mx-4 para mejor responsividad
            "max-h-[85dvh]", // Limitar altura máxima
            "overflow-y-auto", // Habilitar scroll vertical
            "p-0", // Eliminar padding interno
            "rounded-lg", // Bordes redondeados
            "bg-background", // Fondo
            "sm:max-w-full md:max-w-xl lg:max-w-4xl", // Breakpoints para diferentes tamaños
          )}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{ticketId ? "Comprobante de pedido" : "Datos para completar tu compra"}</DialogTitle>
          </DialogHeader>

          {!ticketId ? (
            <div className="grid md:grid-cols-[1fr_340px] gap-6 p-6">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" readOnly value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@dominio.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+52 55 0000 0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, colonia" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ciudad" />
                  </div>
                </div>

                <div className="mt-2 flex items-start gap-2">
                  <Checkbox id="terms" checked={accepted} onCheckedChange={(v) => setAccepted(Boolean(v))} />
                  <Label htmlFor="terms" className="text-sm">
                    He leído y acepto los{" "}
                    <button type="button" className="underline underline-offset-2" onClick={() => setShowTerms(true)}>
                      Términos y condiciones
                    </button>
                  </Label>
                </div>
              </div>

              <div className="rounded-md border w-full">
                <ScrollArea className="h-[360px]">
                  <div className="p-4 space-y-3">
                    <div className="font-medium">Resumen</div>
                    <Separator />
                    <ul className="space-y-3 text-sm">
                      {items.map((i: any) => (
                        <li key={i.id} className="flex justify-between gap-3">
                          <span className="flex-1">
                            {i.title} {i.color ? `· ${i.color}` : ""} {i.size ? `· Talla ${i.size}` : ""} x {i.qty}
                          </span>
                          <span className="tabular-nums">{formatCurrency(i.price * i.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="tabular-nums">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Envío</span>
                      <span>Se coordina con el vendedor</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="tabular-nums">{formatCurrency(total)}</span>
                    </div>

                    <div className="py-1 text-xs text-muted-foreground">
                      Transferencia bancaria:
                      <div className="mt-1 grid gap-0.5">
                        <div>Banco: {bank.bank}</div>
                        <div>Cuenta: {bank.account}</div>
                        <div>Tipo: {bank.type}</div>
                        <div>Titular: {bank.owner}</div>
                      </div>

                      {/* Nota y enlace a WhatsApp */}
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="font-medium text-amber-800">📋 Nota importante:</p>
                        <p className="text-amber-700 mt-1">
                          Después de realizar la transferencia, por favor envía una captura de pantalla del comprobante a través de WhatsApp para procesar tu pedido.
                        </p>
                        <a
                          href={`https://wa.me/50371724317?text=Hola, acabo de realizar una transferencia bancaria para mi pedido. Aquí está mi comprobante:`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center items-center mt-2 gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                          </svg>
                          Enviar comprobante por WhatsApp
                        </a>
                      </div>
                    </div>

                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Pedido</div>
                <div className="text-xl font-semibold tracking-tight">Ticket #{ticketId}</div>
                <div className="mt-2 text-sm">
                  Gracias por tu compra. Te contactaremos para confirmar el envío. Comparte tu comprobante de transferencia al correo: pedidos@inkspire.test
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="font-medium">Resumen</div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(totalCart)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 pb-6">
            {!ticketId ? (
              <div className="flex w-full justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button className="rounded-none" disabled={!canSubmit || loading} onClick={handleSubmit}>
                  {loading ? "Procesando..." : "Continuar"}
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-end gap-3">
                <Button variant="outline" onClick={printReceipt}>Imprimir</Button>
                <Button className="rounded-none" onClick={() => onOpenChange(false)}>Cerrar</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Términos y condiciones */}
      <TermsDialog open={showTerms} onOpenChange={setShowTerms}>
        <TermsContent className="sm:max-w-xl">
          <TermsHeader>
            <TermsTitle>Términos y condiciones</TermsTitle>
          </TermsHeader>
          <div className="space-y-3 text-sm">
            <p>• Entrega estimada de 2 a 3 días hábiles, dependiendo de la zona de envío.</p>
            <p>• Un vendedor se contactará contigo para confirmar detalles y coordinar la entrega.</p>
            <p>• Pago por transferencia bancaria. Envía el comprobante al correo proporcionado para acelerar el proceso.</p>
            <p>• Si tienes dudas, contáctanos vía WhatsApp o email.</p>
          </div>
          <div className="pt-4">
            <Button className="w-full rounded-none" onClick={() => setShowTerms(false)}>Entendido</Button>
          </div>
        </TermsContent>
      </TermsDialog>
    </>
  )
}
