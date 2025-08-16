"use client"

import { createContext, useContext, useMemo } from "react"
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { formatCurrency } from "@/lib/format"
import CheckoutDialog from "@/components/checkout-dialog"
import { AuthProvider } from "@/components/auth"
import { useCartStore } from "@/store/cartStore"

const CartContext = createContext<any | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const {
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    open,
    setOpen,
    beginCheckout,
    checkoutOpen,
    setCheckoutOpen
  } = useCartStore();

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((acc, i) => acc + i.qty * i.price, 0), [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    count,
    total,
    open,
    setOpen,
    beginCheckout
  };

  return (
    <AuthProvider>
      <CartContext.Provider value={value}>
        {children}
        <CartSheet />
        <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      </CartContext.Provider>
    </AuthProvider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartSheet() {
  const { 
    open, 
    setOpen, 
    items, 
    updateQty, 
    removeItem, 
    total, 
    clear, 
    beginCheckout 
  } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[460px] p-0">
        <div className="flex items-center justify-between px-6 h-16 border-b">
          <h2 className="text-base font-medium tracking-wide">Carrito</h2>
          <button 
            onClick={() => setOpen(false)} 
            className="p-1 rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-auto">
          {items.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              Tu carrito está vacío.
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((i:any) => (
                <li 
                  key={i.id} 
                  className="p-6 grid grid-cols-[88px_1fr_auto] gap-4 items-start"
                >
                  <div className="relative h-24 w-20 rounded bg-muted overflow-hidden">
                    <Image 
                      src={i.image || "/placeholder.svg"} 
                      alt={`Imagen de ${i.title}`} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="text-sm grid gap-1">
                    <div className="font-medium">{i.title}</div>
                    <div className="text-muted-foreground">
                      {i.color ? `${i.color} · ` : ""}
                      {i.size ? `Talla ${i.size}` : ""}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateQty(i.id, i.qty - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateQty(i.id, i.qty + 1)}
                      >
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
            <Button 
              className="w-full rounded-none h-11" 
              disabled={items.length === 0} 
              onClick={beginCheckout}
            >
              Continuar
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-none h-11" 
              onClick={clear} 
              disabled={items.length === 0}
            >
              Vaciar carrito
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}