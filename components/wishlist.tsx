"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import {
  fetchWishlist,
  toggleWishlistItem,
  clearWishlist as clearWishlistApi,
} from "@/hooks/supabase/wishlist.supabase"

const KEY = "inkspire_wishlist"

function read(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

function write(slugs: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(slugs)) } catch {}
}

export function useWishlist() {
  const user = useAuthStore((s) => s.user)
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    // Always seed state from localStorage so saved hearts render immediately
    setSlugs(read())

    const userId = user?.id
    if (!userId) return

    fetchWishlist()
      .then((list) => {
        setSlugs(list)
        write(list) // keep localStorage in sync
      })
      .catch(() => setSlugs([]))
  }, [user?.id]) // depend on the id only

  const isSaved = useCallback((slug: string) => slugs.includes(slug), [slugs])

  const toggle = useCallback(
    async (slug: string) => {
      const userId = user?.id
      console.log('user id', user)
      if (!userId) {
        setSlugs((prev) => {
          const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]
          write(next)
          return next
        })
        return
      }
      await toggleWishlistItem(slug)
      const updated = await fetchWishlist()
      console.log(updated)
      setSlugs(updated)
      write(updated) // persist for faster client loads
    },
    [user?.id]
  )

  const clear = useCallback(async () => {
    const userId = user?.id
    if (!userId) {
      setSlugs([])
      write([])
      return
    }
    await clearWishlistApi()
    setSlugs([])
    write([])
  }, [user?.id])

  return useMemo(() => ({ slugs, isSaved, toggle, clear }), [slugs, isSaved, toggle, clear])
}
