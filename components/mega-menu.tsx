"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { CATEGORY_GROUPS, SHORTCUTS, TOP_LEVEL_MAIN } from "@/lib/menu"
import { cn } from "@/lib/utils"

export default function MegaMenu() {
  const pathname = usePathname()

  // Filtro para que en el submenu no aparezcan los top-level
  const submenuShortcuts = SHORTCUTS

  return (
    <nav className="hidden md:flex items-center gap-1">
      {/* Ítems principales siempre visibles */}
      {TOP_LEVEL_MAIN.map((item:any) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2",
              isActive ? "font-medium" : ""
            )}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            <span>{item.label}</span>
          </Link>
        )
      })}

      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1">
              Explorar
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="center"
            sideOffset={10}
            className="w-[720px] p-0"
          >
            <div className="px-4 pt-4">
              <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                Navegación
              </DropdownMenuLabel>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2">
              {/* Columna 1: Grupos de categorías con submenús */}
              <div className="rounded-md border p-2">
                <div className="px-2 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
                  Categorías
                </div>
                <DropdownMenuGroup>
                  {CATEGORY_GROUPS.map((group) => {
                    const GroupIcon = group.icon
                    return (
                      <DropdownMenuSub key={group.key}>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          {GroupIcon ? <GroupIcon className="mr-2 h-4 w-4" /> : null}
                          <span>{group.title}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {group.items.map((it) => (
                            <DropdownMenuItem asChild key={it.href}>
                              <Link href={it.href} className="flex items-center gap-2">
                                <span>{it.label}</span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    )
                  })}
                </DropdownMenuGroup>
              </div>

              {/* Columna 2: Accesos directos restantes */}
              <div className="rounded-md border p-2">
                <div className="px-2 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
                  Secciones
                </div>
                <div className="grid">
                  {submenuShortcuts.map((sc) => {
                    const Icon = sc.icon
                    const isActive =
                      pathname === sc.href ||
                      (sc.href !== "/" && pathname?.startsWith(sc.href))
                    return (
                      <DropdownMenuItem asChild key={sc.href} className="cursor-pointer">
                        <Link
                          href={sc.href}
                          className={cn(
                            "flex items-center gap-2",
                            isActive ? "font-medium text-foreground" : "text-foreground"
                          )}
                        >
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          <span>{sc.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  <p className="text-xs text-muted-foreground">
                    Usa Tab y Enter para navegar. Escape cierra el menú.
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
