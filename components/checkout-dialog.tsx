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
    bank: "Banco XYZ",
    account: "0123456789",
    clabe: "002001234567890123",
    owner: "Inkspire Studio",
  }

  const calculateCartTotal = (cartItems:any) => {
    return cartItems.reduce((total:any, item:any) => {
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
        cart: items.map(i => ({
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
        <DialogContent style={{ maxWidth: '50vw', padding: 0 }}>
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
                      {items.map((i) => (
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

                    <div className="pt-2 text-xs text-muted-foreground">
                      Transferencia bancaria:
                      <div className="mt-1 grid gap-0.5">
                        <div>Banco: {bank.bank}</div>
                        <div>Cuenta: {bank.account}</div>
                        <div>CLABE: {bank.clabe}</div>
                        <div>Titular: {bank.owner}</div>
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
