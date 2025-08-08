"use client"

import { nanoid } from "nanoid/non-secure"
import { type Product } from "@/lib/types"
import { products as builtin } from "@/lib/data"
import { type CartItem } from "@/components/cart"

const KEY_PRODUCTS = "inkspire_admin_products" // custom products
const KEY_VISIBILITY = "inkspire_visibility"   // slug -> boolean
const KEY_STOCK = "inkspire_stock"             // slug -> number
const KEY_ORDERS = "inkspire_orders"           // array of orders
const CHANNEL = "inkspire-events"

export type AdminProduct = Product & {
  isCustom: boolean
  stock?: number
  visible?: boolean
  createdAt?: number
}

export type AdminOrder = {
  id: string
  createdAt: number
  status: "pagado" | "pendiente"
  items: CartItem[]
  total: number
  customer?: { name?: string; email?: string }
}

function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function setJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // noop
  }
}

function bc() {
  return new BroadcastChannel(CHANNEL)
}

// Visibility
export function getVisibilityMap(): Record<string, boolean> {
  return getJSON<Record<string, boolean>>(KEY_VISIBILITY, {})
}
export function setVisibility(slug: string, visible: boolean) {
  const map = getVisibilityMap()
  map[slug] = visible
  setJSON(KEY_VISIBILITY, map)
  bc().postMessage({ type: "product:visibility", payload: { slug, visible } })
}

// Stock
export function getStockMap(): Record<string, number> {
  return getJSON<Record<string, number>>(KEY_STOCK, {})
}
export function setStock(slug: string, stock: number) {
  const map = getStockMap()
  map[slug] = Math.max(0, Math.floor(stock))
  setJSON(KEY_STOCK, map)
  bc().postMessage({ type: "product:stock", payload: { slug, stock: map[slug] } })
}

// Custom products
export function listCustomProducts(): AdminProduct[] {
  return getJSON<AdminProduct[]>(KEY_PRODUCTS, [])
}
export function saveCustomProducts(list: AdminProduct[]) {
  setJSON(KEY_PRODUCTS, list)
}

export function createProduct(p: Omit<Product, "id"> & { stock?: number; visible?: boolean }) {
  const list = listCustomProducts()
  const id = nanoid(8)
  const prod: AdminProduct = {
    id,
    isCustom: true,
    createdAt: Date.now(),
    ...p,
  }
  list.unshift(prod)
  saveCustomProducts(list)
  // persist overlays
  if (typeof p.visible === "boolean") setVisibility(p.slug, p.visible)
  if (typeof p.stock === "number") setStock(p.slug, p.stock)
  bc().postMessage({ type: "product:created", payload: prod })
  return prod
}

export function deleteProduct(slug: string) {
  const list = listCustomProducts()
  const next = list.filter((p) => p.slug !== slug)
  saveCustomProducts(next)
  bc().postMessage({ type: "product:deleted", payload: { slug } })
}

// Merge products: builtin + custom with visibility and stock overlays
export function listAllProducts(): AdminProduct[] {
  const custom = listCustomProducts()
  const vis = getVisibilityMap()
  const stock = getStockMap()

  // Builtins as AdminProduct
  const base: AdminProduct[] = builtin.map((p) => ({
    ...p,
    isCustom: false,
    visible: vis[p.slug] ?? true,
    stock: stock[p.slug] ?? undefined,
  }))
  // Custom (ensure overlays applied)
  const customs: AdminProduct[] = custom.map((p) => ({
    ...p,
    visible: vis[p.slug] ?? (typeof p.visible === "boolean" ? p.visible : true),
    stock: stock[p.slug] ?? p.stock,
  }))
  // Deduplicate by slug (custom wins)
  const map = new Map<string, AdminProduct>()
  base.forEach((p) => map.set(p.slug, p))
  customs.forEach((p) => map.set(p.slug, p))
  return Array.from(map.values())
}

// Orders
export function listOrders(): AdminOrder[] {
  return getJSON<AdminOrder[]>(KEY_ORDERS, []).sort((a, b) => b.createdAt - a.createdAt)
}
export function addOrder(order: Omit<AdminOrder, "id" | "createdAt" | "status"> & { status?: AdminOrder["status"] }) {
  const current = listOrders()
  const o: AdminOrder = {
    id: nanoid(10),
    createdAt: Date.now(),
    status: order.status ?? "pagado",
    items: order.items,
    total: order.total,
    customer: order.customer,
  }
  const next = [o, ...current]
  setJSON(KEY_ORDERS, next)
  bc().postMessage({ type: "order:new", payload: o })
  return o
}

// Subscribe to realtime events
export type InkspireEvent =
  | { type: "order:new"; payload: AdminOrder }
  | { type: "product:created"; payload: AdminProduct }
  | { type: "product:deleted"; payload: { slug: string } }
  | { type: "product:visibility"; payload: { slug: string; visible: boolean } }
  | { type: "product:stock"; payload: { slug: string; stock: number } }

export function subscribe(cb: (e: InkspireEvent) => void) {
  const channel = bc()
  channel.onmessage = (msg) => {
    cb(msg.data as InkspireEvent)
  }
  return () => channel.close()
}
