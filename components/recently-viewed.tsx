"use client"

import { useEffect, useMemo, useState } from "react"
import ProductCard from "@/components/product-card"
import { listAllProducts } from "@/lib/admin-store"

const KEY = "inkspire_recent"

function pushRecent(slug: string) {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as string[]) : []
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, 12)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // noop
  }
}

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export default function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    // registrar vista y leer
    pushRecent(currentSlug)
    setSlugs(readRecent().filter((s) => s !== currentSlug))
  }, [currentSlug])

  const all = useMemo(() => listAllProducts(), [])
  const items = slugs
    .map((s) => all.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 8) as NonNullable<typeof all[number]>[]

  if (items.length === 0) return null

  return (
    <section className="mt-10 border-t pt-8">
      <h3 className="text-lg tracking-tight mb-6">Vistos recientemente</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
