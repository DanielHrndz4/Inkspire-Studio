"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export type User = { email: string; name?: string }

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  openAuth: (mode?: "login" | "register") => void
  ensureAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const KEY_CURRENT_USER = "inkspire_current_user"
const KEY_USERS = "inkspire_users"
const KEY_USER_ORDERS = "inkspire_user_orders" // email -> string[] ids

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
  } catch {}
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
    const users = getJSON<Record<string, User>>(KEY_USERS, {})
    if (!users[email]) {
      // crear usuario básico si no existe
      users[email] = { email }
      setJSON(KEY_USERS, users)
    }
    setJSON(KEY_CURRENT_USER, users[email])
    setUser(users[email])
    setOpen(false)
    resolverRef.current?.()
    resolverRef.current = null
  }, [])

  const register = useCallback(async (name: string, email: string, _password: string) => {
    const users = getJSON<Record<string, User>>(KEY_USERS, {})
    users[email] = { email, name }
    setJSON(KEY_USERS, users)
    setJSON(KEY_CURRENT_USER, users[email])
    setUser(users[email])
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
      <AuthModal open={open} onOpenChange={setOpen} mode={mode} onModeChange={setMode} onLogin={login} onRegister={register} />
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
  onRegister: (name: string, email: string, password: string) => Promise<void>
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    if (!open) {
      setEmail("")
      setPassword("")
      setName("")
    }
  }, [open])

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
          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@dominio.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-pass">Contraseña</Label>
              <Input id="login-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button className="w-full rounded-none" onClick={() => onLogin(email, password)} disabled={!email || !password}>
              Entrar
            </Button>
          </TabsContent>
          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="reg-name">Nombre</Label>
              <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@dominio.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-pass">Contraseña</Label>
              <Input id="reg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button className="w-full rounded-none" onClick={() => onRegister(name, email, password)} disabled={!email || !password || !name}>
              Crear cuenta
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
