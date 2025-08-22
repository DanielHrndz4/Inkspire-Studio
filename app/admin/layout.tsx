"use client"

import { useAuthStore } from "@/store/authStore"
import NotFound from "../not-found"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === "admin"

  if (!isAdmin) {
    return <NotFound />
  }

  return <>{children}</>
}
