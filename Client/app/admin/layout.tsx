"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authed = typeof window !== "undefined" && localStorage.getItem("admin_authed") === "1"

    // If visiting /admin (or any subroute except /admin/signin) and NOT authed -> redirect to signin
    if (!authed && pathname !== "/admin/signin") {
      router.replace("/admin/signin")
      return
    }
    // If already authed and on /admin/signin, go to /admin
    if (authed && pathname === "/admin/signin") {
      router.replace("/admin")
    }
  }, [pathname, router])

  return <>{children}</>
}
