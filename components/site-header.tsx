"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, Search, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart"
import MegaMenu from "./mega-menu"
import MobileNav from "./mobile-nav"
import { useAuth } from "@/components/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"

export default function SiteHeader() {
  const { count, setOpen } = useCart()
  const [showSearch, setShowSearch] = useState(false)
  const { openAuth } = useAuth()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link href="/" className="font-semibold tracking-widest uppercase">
              Inkspire Studio
            </Link>
          </div>

          <MegaMenu />

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos"
                  className="pl-9 w-[220px] rounded-none"
                  aria-label="Buscar"
                />
              </div>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos"
                className="pl-9 rounded-none"
                aria-label="Buscar"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
