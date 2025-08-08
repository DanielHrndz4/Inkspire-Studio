"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { formatCurrency } from "@/lib/format"
import { addOrder } from "@/lib/admin-store"
import CheckoutDialog from "@/components/checkout-dialog"
import { AuthProvider } from "@/components/auth"

export type CartItem = {
  id: string
  title: string
  price: number
  image: string
  slug: string
  qty: number
  // Opciones
  size?: string
  fit?: string
  color?: string
  monogram?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  count: number
  total: number
  open: boolean
  setOpen: (o: boolean) => void
  beginCheckout: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // cargar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("atelier_cart")
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      // noop
    }
  }, [])
  // persistir
  useEffect(() => {
    try {
      localStorage.setItem("atelier_cart", JSON.stringify(items))
    } catch (e) {
      // noop
    }
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Combinar si mismo slug y mismas opciones
      const key = (i: CartItem) => `${i.slug}|${i.size}|${i.fit}|${i.color}|${i.monogram ?? ""}`
      const existing = prev.find((i) => key(i) === key(item))
      if (existing) {
        return prev.map((i) => (key(i) === key(item) ? { ...i, qty: i.qty + item.qty } : i))
      }
      return [{ ...item }, ...prev]
    })
    setOpen(true)
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((acc, i) => acc + i.qty * i.price, 0), [items])

  const beginCheckout = () => {
    setCheckoutOpen(true)
    setOpen(true)
  }

  const value = { items, addItem, removeItem, updateQty, clear, count, total, open, setOpen, beginCheckout }

  return (
    <AuthProvider>
      <CartContext.Provider value={value}>
        {children}
        <CartSheet />
        <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      </CartContext.Provider>
    </AuthProvider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

function CartSheet() {
  const { open, setOpen, items, updateQty, removeItem, total, clear, beginCheckout } = useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[460px] p-0">
        <div className="flex items-center justify-between px-6 h-16 border-b">
          <h2 className="text-base font-medium tracking-wide">Carrito</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Cerrar carrito">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-auto">
          {items.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Tu carrito está vacío.</div>
          ) : (
            <ul className="divide-y">
              {items.map((i) => (
                <li key={i.id} className="p-6 grid grid-cols-[88px_1fr_auto] gap-4 items-start">
                  <div className="relative h-24 w-20 rounded bg-muted overflow-hidden">
                    <Image src={i.image || "/placeholder.svg"} alt={`Imagen de ${i.title}`} fill className="object-cover" />
                  </div>
                  <div className="text-sm grid gap-1">
                    <div className="font-medium">{i.title}</div>
                    <div className="text-muted-foreground">
                      {i.color ? `${i.color} · ` : ""}
                      {i.fit ? `${i.fit} · ` : ""}
                      {i.size ? `Talla ${i.size}` : ""}
                      {i.monogram ? ` · Monograma: ${i.monogram}` : ""}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(i.id, i.qty - 1)}>
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(i.id, i.qty + 1)}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatCurrency(i.price * i.qty)}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground mt-4"
                      onClick={() => removeItem(i.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Quitar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-6 border-t grid gap-3">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(total)}</span>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Button className="w-full rounded-none h-11" disabled={items.length === 0} onClick={beginCheckout}>
              Continuar
            </Button>
            <Button variant="outline" className="w-full rounded-none h-11" onClick={clear} disabled={items.length === 0}>
              Vaciar carrito
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
