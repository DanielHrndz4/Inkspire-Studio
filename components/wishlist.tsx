"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

const KEY = "inkspire_wishlist"

function read(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function write(slugs: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs))
  } catch {
    // noop
  }
}

export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    setSlugs(read())
  }, [])

  const isSaved = useCallback((slug: string) => slugs.includes(slug), [slugs])

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]
      write(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setSlugs([])
    write([])
  }, [])

  return useMemo(() => ({ slugs, isSaved, toggle, clear }), [slugs, isSaved, toggle, clear])
}
