"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Search, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart"
import MegaMenu from "./mega-menu"
import MobileNav from "./mobile-nav"
import { useAuth } from "@/components/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"
import { useWishlist } from "@/components/wishlist"
import { searchProducts } from "@/hooks/supabase/search.supabase"
import type { Products } from "@/interface/product.interface"
import { formatCurrency } from "@/lib/format"

export default function SiteHeader() {
  const { count, setOpen } = useCart()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Products[]>([])
  const router = useRouter()
  const { openAuth } = useAuth()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  useWishlist()

  useEffect(() => {
    const handler = setTimeout(async () => {
      const term = searchQuery.trim()
      if (!term) {
        setSuggestions([])
        return
      }
      try {
        const results = await searchProducts(term)
        setSuggestions(results.slice(0, 5))
        console.log(results)
      } catch (error) {
        console.error(error)
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [searchQuery])

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3" suppressHydrationWarning>
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="font-semibold tracking-widest uppercase">
              <div className="flex flex-row gap-2 items-center justify-center">
                <img src="/logo.png" alt="Inkspire Studio" className="w-10" />
                Inkspire Studio
              </div>
            </Link>
          </div>

          <MegaMenu />

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    // router.push(`/categories/q=${encodeURIComponent(searchQuery.trim())}`)
                    setShowSearch(false)
                    setSearchQuery("")
                    setSuggestions([])
                  }
                }}
              >
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" />
                </button>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos"
                  className="pl-9 w-[320px] rounded-none"
                  aria-label="Buscar"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-50 mt-1 w-full rounded-md border bg-background text-sm shadow">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.id}`}
                          className="block px-3 py-2 hover:bg-muted"
                          onClick={() => {
                            setShowSearch(false)
                            setSearchQuery("")
                            setSuggestions([])
                          }}
                        >
                          <div className="flex flex-row gap-3">
                            <img src={p.product[0]?.images[0]} alt="" className="w-1/5" />
                            <div className="flex flex-col justify-between">
                              <div className="flex flex-col">
                                <span>{p.title}</span>
                                <span className="block text-xs text-muted-foreground">{p.category?.name}</span>
                              </div>
                              <span>{formatCurrency(p.price)}</span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Buscar"
              onClick={() => setShowSearch((s) => !s)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={user ? "Cuenta" : "Iniciar sesión"}>
                  <div className="flex">
                    {isAuthenticated
                      ? user?.name
                        ? user.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n.charAt(0).toUpperCase())
                          .join("")
                        : ""
                      : <User className="h-5 w-5" />}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="text-xs">
                      {user?.name ? `${user.name} · ` : ""}{user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Mis pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => openAuth("login")}>Iniciar sesión</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAuth("register")}>Crear cuenta</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Carrito */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir carrito"
              onClick={() => setOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span
                  className="absolute -right-1 -top-1 h-4 min-w-[16px] rounded-full bg-foreground px-1 text-[10px] leading-4 text-background text-center"
                  aria-label={`Carrito con ${count} ${count === 1 ? "artículo" : "artículos"}`}
                >
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="pb-3 md:hidden">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  router.push(`/categories?q=${encodeURIComponent(searchQuery.trim())}`)
                  setShowSearch(false)
                  setSearchQuery("")
                  setSuggestions([])
                }
              }}
            >
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos"
                className="pl-9 rounded-none"
                aria-label="Buscar"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-md border bg-background text-sm shadow">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.id}`}
                        className="block px-3 py-2 hover:bg-muted"
                        onClick={() => {
                          setShowSearch(false)
                          setSearchQuery("")
                          setSuggestions([])
                        }}
                      >
                        <span>{p.title}</span>
                        <span className="block text-xs text-muted-foreground">{p.category?.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
