"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore, type User as AuthStoreUser } from "@/store/authStore"

export default function AdminSignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const loginStore = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    // If already admin, redirect
    if (user?.role === "admin") {
      router.replace("/admin")
    }
  }, [router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)

    // Demo credentials (can be changed to your liking)
    const DEMO_EMAIL = "admin@inkspire.local"
    const DEMO_PASS = "admin123"

    // Very simple client-side check
    setTimeout(() => {
      if ((email || "").toLowerCase() === DEMO_EMAIL && password === DEMO_PASS) {
        const authUser: AuthStoreUser = {
          id: "demo-admin",
          name: "Admin",
          lastname: "",
          email,
          tel: "",
          role: "admin",
        }
        loginStore(authUser, "")
        router.replace("/admin")
      } else {
        setError("Credenciales inválidas. Prueba admin@inkspire.local / admin123")
      }
      setPending(false)
    }, 400)
  }

  return (
    <main className="min-h-[100dvh] grid place-items-center bg-white">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="tracking-tight">Acceso administrador</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@inkspire.local"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="rounded-none h-11" disabled={pending}>
              {pending ? "Ingresando…" : "Ingresar"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Demo: admin@inkspire.local / admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
