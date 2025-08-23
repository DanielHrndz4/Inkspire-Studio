"use client"

import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="opacity-0 animate-in fade-in duration-300 ease-out">
      {children}
    </div>
  )
}
