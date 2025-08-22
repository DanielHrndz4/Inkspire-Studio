"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const isAdmin = user?.role === "admin"

    // If visiting /admin (or subroutes) and not admin -> redirect to signin
    if (!isAdmin && pathname !== "/admin/signin") {
      router.replace("/admin/signin")
      return
    }
    // If already admin and on /admin/signin, go to /admin
    if (isAdmin && pathname === "/admin/signin") {
      router.replace("/admin")
    }
  }, [pathname, router, user])

  return <>{children}</>
}
