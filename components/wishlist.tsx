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
  const user = useAuthStore((s) => s.user)
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      setSlugs(read())
      return
    }
    fetchWishlist(user.id)
      .then(setSlugs)
      .catch(() => setSlugs([]))
  }, [user])

  const isSaved = useCallback((slug: string) => slugs.includes(slug), [slugs])

  const toggle = useCallback(
    async (slug: string) => {
      if (!user) {
        setSlugs((prev) => {
          const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]
          write(next)
          return next
        })
        return
      }
      await toggleWishlistItem(user.id, slug)
      const updated = await fetchWishlist(user.id)
      setSlugs(updated)
    },
    [user]
  )

  const clear = useCallback(async () => {
    if (!user) {
      setSlugs([])
      write([])
      return
    }
    await clearWishlistApi(user.id)
    setSlugs([])
  }, [user])

  return useMemo(() => ({ slugs, isSaved, toggle, clear }), [slugs, isSaved, toggle, clear])
}
