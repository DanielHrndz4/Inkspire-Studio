"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore, type User as AuthStoreUser } from "@/store/authStore"
import signUp from "@/hooks/supabase/signup.supabase"
import { signIn } from "@/hooks/supabase/signin.supabase"
import { z } from "zod"

export type User = {
  email: string
  name?: string
  lastName?: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  logout: () => void
  openAuth: (mode?: "login" | "register") => void
  ensureAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const KEY_CURRENT_USER = "inkspire_current_user"
const KEY_USER_ORDERS = "inkspire_user_orders"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
})

const registerSchema = z
  .object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    lastName: z.string().min(1, { message: "El apellido es requerido" }),
    phone: z.string().min(10, { message: "El teléfono es requerido" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string().min(8, { message: "La confirmación es requerida" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden"
  })

function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function setJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { }
}

export function linkOrderToUser(email: string, orderId: string) {
  const map = getJSON<Record<string, string[]>>(KEY_USER_ORDERS, {})
  const list = map[email] ?? []
  if (!list.includes(orderId)) list.unshift(orderId)
  map[email] = list
  setJSON(KEY_USER_ORDERS, map)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")
  const resolverRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const u = getJSON<User | null>(KEY_CURRENT_USER, null)
    setUser(u)
  }, [])

  const login = useCallback(async (email: string, _password: string) => {
    const current: User = { email }
    setJSON(KEY_CURRENT_USER, current)
    setUser(current)
    setOpen(false)
    resolverRef.current?.()
    resolverRef.current = null
  }, [])

  const register = useCallback(async (data: {
    name: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }) => {
    if (data.password !== data.confirmPassword) {
      throw new Error("Las contraseñas no coinciden")
    }
    const newUser: User = {
      email: data.email,
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
    }
    setJSON(KEY_CURRENT_USER, newUser)
    setUser(newUser)
    setOpen(false)
    resolverRef.current?.()
    resolverRef.current = null
  }, [])

  const logout = useCallback(() => {
    setJSON(KEY_CURRENT_USER, null)
    setUser(null)
  }, [])

  const openAuth = useCallback((m: "login" | "register" = "login") => {
    setMode(m)
    setOpen(true)
  }, [])

  const ensureAuth = useCallback(() => {
    if (user) return Promise.resolve()
    setMode("login")
    setOpen(true)
    return new Promise<void>((resolve) => {
      resolverRef.current = resolve
    })
  }, [user])

  const value = useMemo(
    () => ({ user, login, register, logout, openAuth, ensureAuth }),
    [user, login, register, logout, openAuth, ensureAuth]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        onModeChange={setMode}
        onLogin={login}
        onRegister={register}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

function AuthModal({
  open,
  onOpenChange,
  mode,
  onModeChange,
  onLogin,
  onRegister,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  mode: "login" | "register"
  onModeChange: (m: "login" | "register") => void
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (data: {
    name: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }) => Promise<void>
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setEmail("")
      setPassword("")
      setName("")
      setLastName("")
      setPhone("")
      setConfirmPassword("")
      setError(null)
    }
  }, [open])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    setMessage("")

    try {
      const parsed = loginSchema.safeParse({ email: email.trim(), password })
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message)
      }

      const result = await signIn({
        email: parsed.data.email.toLowerCase(),
        password: parsed.data.password,
      })

      if ("error" in result) {
        throw result.error
      }

      const authUser: AuthStoreUser = {
        id: result.user.id,
        name: result.user.profile?.name || "",
        lastname: result.user.profile?.lastname || "",
        tel: result.user.profile?.tel || "",
        email: result.user.email || "",
        role: result.user.profile?.role || "user",
      }

      useAuthStore.getState().login(authUser, result.session?.access_token || "")

      // Actualiza contexto local para compatibilidad con ensureAuth
      await onLogin(parsed.data.email, parsed.data.password)

      setMessage("¡Bienvenido!")
      setTimeout(() => {
        location.reload()
      }, 2000)
    } catch (err: any) {
      console.error("Error en login:", err)
      const errorMessage = err.message?.includes("Invalid login credentials")
        ? "Email o contraseña incorrectos"
        : err.message || "Error al iniciar sesión"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  };

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    setMessage("")

    try {
      const parsed = registerSchema.safeParse({
        name,
        lastName,
        phone,
        email: email.trim(),
        password,
        confirmPassword,
      })
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message)
      }

      const { data, error }: any = await signUp({
        name: parsed.data.name,
        lastname: parsed.data.lastName,
        tel: parsed.data.phone,
        email: parsed.data.email.toLowerCase(),
        password: parsed.data.password,
      })

      if (error) {
        throw error
      }

      console.log("Usuario registrado:", data)
      setMessage("¡Registro exitoso! Ahora puedes iniciar sesión.")
    } catch (err) {
      console.error("Error en registro:", err)
      setError(err instanceof Error ? err.message : "Error al registrar")
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</DialogTitle>
        </DialogHeader>
        <Tabs value={mode} onValueChange={(v) => onModeChange(v as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Ingresar</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login" className="space-y-4 pt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@dominio.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-pass">Contraseña</Label>
              <Input
                id="login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              className="w-full rounded-none"
              onClick={handleLogin}
              disabled={!email || !password}
            >
              Entrar
            </Button>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register" className="space-y-4 pt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reg-name">Nombre</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-lastname">Apellidos</Label>
              <Input
                id="reg-lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tus apellidos"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-phone">Teléfono</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 123 456 7890"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@dominio.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-pass">Contraseña</Label>
              <Input
                id="reg-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-confirm-pass">Confirmar contraseña</Label>
              <Input
                id="reg-confirm-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              className="w-full rounded-none"
              onClick={handleRegister}
              disabled={!email || !password || !name || !lastName || !phone || !confirmPassword}
            >
              Crear cuenta
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}