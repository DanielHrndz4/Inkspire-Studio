"use client"

import { useEffect, useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { CartProvider } from "@/components/cart"
import { useAuth } from "@/components/auth"
import { getOrdersByEmail, Order } from "@/hooks/supabase/orders.supabase"
import { formatCurrency } from "@/lib/format"

export default function OrdersPage() {
  const { user, ensureAuth } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    ensureAuth()
  }, [ensureAuth])

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return
      try {
        const data = await getOrdersByEmail(user.email)
        setOrders(data)
      } catch (err) {
        console.error(err)
        setOrders([])
      }
    }
    load()
  }, [user])

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-6">
          <header className="flex items-end justify-between">
            <div className="grid gap-1">
              <h1 className="text-2xl md:text-3xl tracking-tight">Tus órdenes</h1>
              <p className="text-sm text-muted-foreground">Revisa el estado de tus pedidos.</p>
            </div>
          </header>

          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no has realizado pedidos.</p>
          ) : (
            <div className="overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr className="text-left">
                    <th className="p-3">ID</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t align-top">
                      <td className="p-3">{o.id}</td>
                      <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="p-3">
                        <ul className="grid gap-1">
                          {o.items.map((it, idx) => (
                            <li key={idx}>
                              {it.title} × {it.qty}
                              {it.size ? ` · Talla ${it.size}` : ""} {it.color ? ` · ${it.color}` : ""}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-3 font-medium">
                        {formatCurrency(o.items.reduce((s, it) => s + it.price * it.qty, 0))}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded border">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}

