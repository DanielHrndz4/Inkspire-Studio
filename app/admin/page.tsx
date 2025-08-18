"use client"

import { useEffect, useMemo, useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ProductRecord,
  listProducts,
  createProduct as createDbProduct,
  updateProduct as updateDbProduct,
  deleteProduct as deleteDbProduct,
} from "@/hooks/supabase/products.supabase"
import { AdminOrder, listOrders, subscribe } from "@/lib/admin-store"
import { CartProvider } from "@/components/cart"

export default function AdminPage() {
  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <SiteHeader />
        <main className="container mx-auto px-4 py-10 grid gap-8">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-2">
              <h1 className="text-2xl md:text-3xl tracking-tight">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona inventario y monitorea órdenes en tiempo real.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                localStorage.removeItem("admin_authed")
                localStorage.removeItem("admin_email")
                window.location.href = "/admin/signin"
              }}
            >
              <Button type="submit" variant="outline" className="rounded-none">
                Cerrar sesión
              </Button>
            </form>
          </header>

          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="rounded-none">
              <TabsTrigger value="inventory" className="rounded-none">Inventario</TabsTrigger>
              <TabsTrigger value="new" className="rounded-none">Nuevo producto</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-none">Órdenes</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="mt-6">
              <InventoryTab />
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              <NewProductTab />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrdersTab />
            </TabsContent>
          </Tabs>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}

function InventoryTab() {
  const [items, setItems] = useState<ProductRecord[]>([])
  const [q, setQ] = useState("")

  const load = async () => {
    const data = await listProducts()
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter(
      (p) => !term || p.title.toLowerCase().includes(term) || (p.description ?? "").toLowerCase().includes(term)
    )
  }, [items, q])

  return (
    <section className="grid gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="grid gap-1 flex-1">
          <Label htmlFor="search" className="text-xs uppercase tracking-widest text-muted-foreground">Buscar</Label>
          <Input id="search" placeholder="Nombre..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} productos</div>
      </div>

      <div className="overflow-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="p-3">Producto</th>
              <th className="p-3">Precio</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.title}</td>
                <td className="p-3">€ {p.price.toFixed(2)}</td>
                <td className="p-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const title = prompt("Título", p.title) || p.title
                      const priceStr = prompt("Precio", p.price.toString()) || p.price.toString()
                      const price = Number(priceStr)
                      await updateDbProduct(p.id, { title, price })
                      await load()
                    }}
                    className="rounded-none"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (!confirm("¿Eliminar producto?")) return
                      await deleteDbProduct(p.id)
                      await load()
                    }}
                    className="rounded-none"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-muted-foreground">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function NewProductTab() {
  const [json, setJson] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = JSON.parse(json)
      await createDbProduct(data)
      setJson("")
      alert("Producto creado")
    } catch (err) {
      console.error(err)
      alert("Error al crear producto")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-2xl">
      <Label htmlFor="json">Datos del producto (JSON)</Label>
      <Textarea id="json" value={json} onChange={(e) => setJson(e.target.value)} className="min-h-[300px]" />
      <Button type="submit" className="rounded-none">
        Crear producto
      </Button>
    </form>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState<AdminOrder[]>([])

  useEffect(() => {
    setOrders(listOrders())
    const unsub = subscribe((e) => {
      if (e.type === "order:new") {
        setOrders((prev) => [e.payload, ...prev])
      }
    })
    return () => unsub()
  }, [])

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{orders.length} órdenes</div>
      </div>
      <div className="overflow-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t align-top">
                <td className="p-3 font-mono text-xs">{o.id}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <ul className="grid gap-1">
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.title} × {it.qty}
                        {it.size ? ` · Talla ${it.size}` : ""} {it.color ? ` · ${it.color}` : ""}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 font-medium">€ {o.total.toFixed(2)}</td>
                <td className="p-3">
                  {o.customer?.email || o.customer?.name ? (
                    <>
                      <div>{o.customer?.name}</div>
                      <div className="text-xs text-muted-foreground">{o.customer?.email}</div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded border">{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Aún no hay órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Tip: abre la tienda en otra pestaña, añade productos al carrito y presiona “Finalizar compra”. Verás la orden aquí en tiempo real.
      </p>
    </section>
  )
}
