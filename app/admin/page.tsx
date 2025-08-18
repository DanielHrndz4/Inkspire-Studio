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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ProductRecord,
  listProducts,
  createProduct as createDbProduct,
  updateProduct as updateDbProduct,
  deleteProduct as deleteDbProduct,
} from "@/hooks/supabase/products.supabase"
import { uploadProductImage } from "@/hooks/supabase/storage.supabase"
import {
  CategoryRecord,
  createCategory,
  listCategories,
} from "@/hooks/supabase/categories.supabase"
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

interface VariantForm {
  color: string
  sizes: string
  images: string
}

function NewProductTab() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [categoryImage, setCategoryImage] = useState("")
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryImage, setNewCategoryImage] = useState("")
  const [material, setMaterial] = useState("")
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [variants, setVariants] = useState<VariantForm[]>([
    { color: "", sizes: "", images: "" },
  ])

  useEffect(() => {
    listCategories().then(setCategories).catch(console.error)
  }, [])

  const handleCreateCategory = async () => {
    try {
      const cat = await createCategory({
        name: newCategoryName,
        image: newCategoryImage,
      })
      setCategories((prev) => [...prev, cat])
      setCategoryName(cat.name)
      setCategoryImage(cat.image || "")
      setNewCategoryName("")
      setNewCategoryImage("")
      setShowCategoryForm(false)
    } catch (err) {
      console.error(err)
      alert("Error al crear categoría")
    }
  }

  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: string,
  ) => {
    setVariants((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, { color: "", sizes: "", images: "" }])
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        title,
        description,
        type,
        category: { name: categoryName, image: categoryImage },
        material,
        price: parseFloat(price),
        discountPercentage: discount ? parseFloat(discount) : 0,
        product: variants.map((v) => ({
          color: v.color,
          size: v.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          images: v.images
            .split(/\n|,/) // allow comma or newline separated
            .map((s) => s.trim())
            .filter(Boolean),
        })),
      }
      const response = await createDbProduct(data)
      console.log(response)
      setTitle("")
      setDescription("")
      setType("")
      setCategoryName("")
      setCategoryImage("")
      setMaterial("")
      setPrice("")
      setDiscount("")
      setVariants([{ color: "", sizes: "", images: "" }])
      alert("Producto creado")
    } catch (err) {
      console.error(err)
      alert("Error al crear producto")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="t-shirt">t-shirt</SelectItem>
            <SelectItem value="hoodie">hoodie</SelectItem>
            <SelectItem value="polo">polo</SelectItem>
            <SelectItem value="croptop">croptop</SelectItem>
            <SelectItem value="oversized">oversized</SelectItem>
            <SelectItem value="long-sleeve">long-sleeve</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="material">Material</Label>
        <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="discount">Descuento %</Label>
        <Input
          id="discount"
          type="number"
          step="0.01"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={categoryName}
          onValueChange={(val) => {
            setCategoryName(val)
            const cat = categories.find((c) => c.name === val)
            setCategoryImage(cat?.image || "")
          }}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Selecciona categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name || `category-${c.id}`}> {/* Asegura que el value no sea vacío */}
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categoryImage && (
          <img
            src={categoryImage}
            alt={categoryName}
            className="mt-2 h-24 w-24 object-cover"
          />
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowCategoryForm((p) => !p)}
          className="w-fit rounded-none"
        >
          Crear categoría
        </Button>
        {showCategoryForm && (
          <div className="mt-2 grid gap-2 border p-4 rounded-md">
            <div className="grid gap-1">
              <Label htmlFor="newCategoryName">Nombre</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="newCategoryImage">Imagen</Label>
              <Input
                id="newCategoryImage"
                value={newCategoryImage}
                onChange={(e) => setNewCategoryImage(e.target.value)}
              />
              <Input
                id="newCategoryImageUpload"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = await uploadProductImage(file)
                  setNewCategoryImage(url)
                }}
              />
              {newCategoryImage && (
                <img
                  src={newCategoryImage}
                  alt={newCategoryName}
                  className="mt-2 h-24 w-24 object-cover"
                />
              )}
            </div>
            <Button
              type="button"
              onClick={handleCreateCategory}
              className="w-fit rounded-none"
            >
              Guardar categoría
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <h3 className="font-medium">Variantes</h3>
        {variants.map((v, idx) => (
          <div key={idx} className="grid gap-2 border p-4 rounded-md">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor={`color-${idx}`}>Color</Label>
                <Input
                  id={`color-${idx}`}
                  value={v.color}
                  onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor={`sizes-${idx}`}>Tallas (coma separadas)</Label>
                <Input
                  id={`sizes-${idx}`}
                  value={v.sizes}
                  onChange={(e) => handleVariantChange(idx, "sizes", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor={`images-${idx}`}>Imágenes (una por línea)</Label>
              <Textarea
                id={`images-${idx}`}
                value={v.images}
                onChange={(e) => handleVariantChange(idx, "images", e.target.value)}
              />
              <Input
                id={`images-upload-${idx}`}
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? [])
                  if (!files.length) return
                  const urls = await Promise.all(files.map(uploadProductImage))
                  const existing = v.images
                    .split(/\n|,/) // reuse same splitting logic
                    .map((s) => s.trim())
                    .filter(Boolean)
                  handleVariantChange(idx, "images", [...existing, ...urls].join("\n"))
                }}
              />
            </div>
            {variants.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeVariant(idx)}
                className="w-fit rounded-none"
              >
                Eliminar variante
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={addVariant}
          variant="outline"
          className="w-fit rounded-none"
        >
          Añadir variante
        </Button>
      </div>
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
