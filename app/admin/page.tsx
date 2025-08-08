"use client"

import { useEffect, useMemo, useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import {
  AdminProduct,
  AdminOrder,
  listAllProducts,
  listOrders,
  createProduct,
  deleteProduct,
  setVisibility,
  setStock,
  subscribe,
} from "@/lib/admin-store"
import { categories } from "@/lib/categories"
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
                Gestiona inventario, visibilidad y monitorea órdenes en tiempo real. (Demo sin autenticación de servidor)
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
  const [items, setItems] = useState<AdminProduct[]>([])
  const [q, setQ] = useState("")

  useEffect(() => {
    setItems(listAllProducts())
    const unsub = subscribe((e) => {
      if (e.type.startsWith("product:")) setItems(listAllProducts())
    })
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter(
      (p) =>
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term)
    )
  }, [items, q])

  return (
    <section className="grid gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="grid gap-1 flex-1">
          <Label htmlFor="search" className="text-xs uppercase tracking-widest text-muted-foreground">Buscar</Label>
          <Input id="search" placeholder="Nombre, slug, descripción..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} productos</div>
      </div>

      <div className="overflow-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="p-3">Producto</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Visible</th>
              <th className="p-3">Origen</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 rounded bg-muted overflow-hidden">
                      <Image src={p.images?.[0] || "/placeholder.svg"} alt={p.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">€ {p.price.toFixed(2)}</td>
                <td className="p-3">{p.slug}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      className="h-8 w-24"
                      value={String(p.stock ?? "")}
                      onChange={(e) => setStock(p.slug, Number(e.target.value) || 0)}
                    />
                  </div>
                </td>
                <td className="p-3">
                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={p.visible !== false}
                      onChange={(e) => setVisibility(p.slug, e.target.checked)}
                    />
                    <span>{p.visible !== false ? "Sí" : "No"}</span>
                  </label>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded border ${p.isCustom ? "" : ""}`}>
                    {p.isCustom ? "Admin" : "Base"}
                  </span>
                </td>
                <td className="p-3">
                  {p.isCustom ? (
                    <Button variant="outline" size="sm" onClick={() => deleteProduct(p.slug)}>
                      Eliminar
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  Sin resultados.
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
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [category, setCategory] = useState(categories[0]?.title ?? "Camisas")
  const [colors, setColors] = useState("")
  const [fabrics, setFabrics] = useState("")
  const [description, setDescription] = useState("")
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)
  const [stock, setStockState] = useState<number | "">("")

  const handleFile = (file?: File) => {
    if (!file) return setImageDataUrl(null)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") setImageDataUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const reset = () => {
    setTitle("")
    setSlug("")
    setPrice("")
    setCategory(categories[0]?.title ?? "Camisas")
    setColors("")
    setFabrics("")
    setDescription("")
    setImageDataUrl(null)
    setVisible(true)
    setStockState("")
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !price || !imageDataUrl) return
    const newP = createProduct({
      slug,
      title,
      price: Number(price),
      images: [imageDataUrl],
      category,
      colors: colors.split(",").map((s) => s.trim()).filter(Boolean),
      fabrics: fabrics.split(",").map((s) => s.trim()).filter(Boolean),
      description: description || "—",
      visible,
      stock: typeof stock === "number" ? stock : undefined,
    })
    // Reset after creation
    reset()
    alert(`Producto creado: ${newP.title}`)
  }

  return (
    <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid gap-1">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="camisa-mi-modelo" required />
        </div>
        <div className="grid gap-1">
          <Label>Precio (EUR)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />
        </div>
        <div className="grid gap-1">
          <Label>Categoría</Label>
          <select className="h-10 rounded-md border bg-background px-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-1">
          <Label>Colores (separados por coma)</Label>
          <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Blanco, Negro, Celeste" />
        </div>
        <div className="grid gap-1">
          <Label>Tejidos (separados por coma)</Label>
          <Input value={fabrics} onChange={(e) => setFabrics(e.target.value)} placeholder="Algodón, Oxford" />
        </div>
        <div className="grid gap-1">
          <Label>Descripción</Label>
          <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Visibilidad</Label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            <span>Visible en tienda</span>
          </label>
        </div>
        <div className="grid gap-1">
          <Label>Stock</Label>
          <Input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStockState(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Ej. 25"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="rounded-none">Crear producto</Button>
          <Button type="button" variant="outline" onClick={reset} className="rounded-none">Limpiar</Button>
        </div>
      </div>

      <div className="grid gap-3">
        <Label>Imagen principal</Label>
        <label className="relative aspect-[4/5] w-full overflow-hidden rounded-md border bg-muted cursor-pointer">
          {imageDataUrl ? (
            <Image src={imageDataUrl || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
              Subir imagen
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
            className="hidden"
          />
        </label>
        {imageDataUrl && (
          <Button type="button" variant="ghost" onClick={() => setImageDataUrl(null)}>
            Quitar imagen
          </Button>
        )}
        <p className="text-xs text-muted-foreground">JPG/PNG/SVG. Recomendado 1200x1500.</p>
      </div>
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
                <td colSpan={6} className="p-6 text-center text-muted-foreground">Aún no hay órdenes.</td>
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
