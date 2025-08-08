"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { CATEGORY_GROUPS, SHORTCUTS, TOP_LEVEL_MAIN } from "@/lib/menu"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)

  // Atajos: filtramos para no duplicar con los top-level
  const mobileShortcuts = SHORTCUTS.filter(sc => !TOP_LEVEL_MAIN.some(item => item.href === sc.href))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[360px] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="tracking-widest uppercase text-sm">
            Inkspire Studio
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 pb-8 space-y-6">
          {/* Top-level (principal) – botones grandes al inicio */}
          <div className="grid grid-cols-2 gap-2">
            {TOP_LEVEL_MAIN.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors",
                    isActive ? "font-medium" : ""
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Categorías (acordeones) */}
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 px-1">
              Categorías
            </div>
            <Accordion
              type="multiple"
              defaultValue={CATEGORY_GROUPS.map((g) => g.key)}
              className="w-full"
            >
              {CATEGORY_GROUPS.map((group) => (
                <AccordionItem key={group.key} value={group.key}>
                  <AccordionTrigger className="text-base">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent className="grid gap-2 pl-2">
                    {group.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={close}
                        className={cn(
                          "text-sm px-1 py-1 rounded hover:bg-muted transition-colors",
                          pathname === it.href ? "font-medium" : ""
                        )}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Resto de secciones */}
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 px-1">
              Secciones
            </div>
            <div className="grid gap-1">
              {mobileShortcuts.map((sc) => (
                <Link
                  key={sc.href}
                  href={sc.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-2 px-1 py-2 rounded hover:bg-muted transition-colors",
                    pathname === sc.href ||
                      (sc.href !== "/" && pathname?.startsWith(sc.href))
                      ? "font-medium"
                      : ""
                  )}
                >
                  {sc.icon ? <sc.icon className="h-4 w-4" /> : null}
                  <span>{sc.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
