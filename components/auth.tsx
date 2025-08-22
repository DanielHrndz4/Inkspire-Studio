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
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

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

function getRegisterErrorMessage(error: any) {
  const message = error?.message || "";

  if (message.includes("users_id_fkey")) {
    return "El correo ya está registrado. Intenta con otro o inicia sesión.";
  }

  if (message.includes("duplicate key value")) {
    return "Ya existe una cuenta con este correo.";
  }

  return "El correo ya está registrado. Intenta con otro o inicia sesión.";
}

const registerSchema = z
  .object({
    name: z.string().min(1, { message: "El nombre es requerido" }).max(50, { message: "El nombre es demasiado largo" }),
    lastName: z.string().min(1, { message: "El apellido es requerido" }).max(50, { message: "El apellido es demasiado largo" }),
    phone: z.string()
      .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
      .max(15, { message: "El teléfono es demasiado largo" })
      .regex(/^[+]?[\d\s\-()]+$/, { message: "Formato de teléfono inválido" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[a-z]/, { message: "La contraseña debe contener al menos una minúscula" })
      .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una mayúscula" })
      .regex(/\d/, { message: "La contraseña debe contener al menos un número" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "La contraseña debe contener al menos un carácter especial" }),
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) {
      setEmail("")
      setPassword("")
      setName("")
      setLastName("")
      setPhone("")
      setConfirmPassword("")
      setError(null)
      setFieldErrors({})
    }
  }, [open])

  const validateLoginForm = () => {
    try {
      loginSchema.parse({ email: email.trim(), password })
      setFieldErrors({})
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((error) => {
          if (error.path) errors[error.path[0]] = error.message
        })
        setFieldErrors(errors)
      }
      return false
    }
  }

  const validateRegisterForm = () => {
    try {
      registerSchema.parse({
        name,
        lastName,
        phone,
        email: email.trim(),
        password,
        confirmPassword,
      })
      setFieldErrors({})
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((error) => {
          if (error.path) errors[error.path[0]] = error.message
        })
        setFieldErrors(errors)
      }
      return false
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    setMessage("")

    if (!validateLoginForm()) {
      setLoading(false)
      return
    }

    try {
      const result = await signIn({
        email: email.trim().toLowerCase(),
        password,
      })

      if (result && "error" in result) {
        // Manejo específico de errores de Supabase
        if (
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error &&
          typeof (result.error as any).message === "string"
        ) {
          const errorMsg = (result.error as any).message;
          if (errorMsg.includes("Invalid login credentials")) {
            throw new Error("Email o contraseña incorrectos")
          } else if (errorMsg.includes("Email not confirmed")) {
            throw new Error("Por favor, confirma tu correo electrónico antes de iniciar sesión")
          } else {
            throw result.error
          }
        } else {
          throw result.error
        }
      }

      if (!result || !result.user) {
        throw new Error("No se pudo obtener la información del usuario. Intenta nuevamente.");
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
      await onLogin(email.trim(), password)

      setMessage("¡Bienvenido! Redirigiendo...")
      setTimeout(() => {
        location.reload()
      }, 2000)
    } catch (err: any) {
      console.error("Error en login:", err)
      setError(err.message || "El usuario o contraseña son incorrectos")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    setMessage("")

    if (!validateRegisterForm()) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signUp({
        name: name.trim(),
        lastname: lastName.trim(),
        tel: phone.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // Manejo específico de errores de Supabase
        if (error.includes("already registered")) {
          throw new Error("Este correo electrónico ya está registrado")
        } else if (error.includes("weak password")) {
          throw new Error("La contraseña es demasiado débil")
        } else {
          throw new Error(getRegisterErrorMessage(error))
        }
      }

      console.log("Usuario registrado:", data)
      setMessage("¡Registro exitoso! Revisa tu correo y confirma tu cuenta para poder iniciar sesión.")
      
      // Limpiar formulario después de registro exitoso
      setTimeout(() => {
        setName("")
        setLastName("")
        setPhone("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        onModeChange("login")
        setMessage("Por favor, confirma tu correo electrónico antes de iniciar sesión.")
      }, 3000)
    } catch (err: any) {
      console.error("Error en registro:", err)
      setError(err.message || "Error al registrar")
    } finally {
      setLoading(false)
    }
  }

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
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
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
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs">{fieldErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-pass">Contraseña</Label>
              <div className="relative">
                <Input
                  id="login-pass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={fieldErrors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs">{fieldErrors.password}</p>}
            </div>
            <Button
              className="w-full rounded-none"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Procesando..." : "Entrar"}
            </Button>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register" className="space-y-4 pt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reg-name">Nombre</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={fieldErrors.name ? "border-red-500" : ""}
              />
              {fieldErrors.name && <p className="text-red-500 text-xs">{fieldErrors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-lastname">Apellidos</Label>
              <Input
                id="reg-lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tus apellidos"
                className={fieldErrors.lastName ? "border-red-500" : ""}
              />
              {fieldErrors.lastName && <p className="text-red-500 text-xs">{fieldErrors.lastName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-phone">Teléfono</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 123 456 7890"
                className={fieldErrors.phone ? "border-red-500" : ""}
              />
              {fieldErrors.phone && <p className="text-red-500 text-xs">{fieldErrors.phone}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@dominio.com"
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs">{fieldErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-pass">Contraseña</Label>
              <div className="relative">
                <Input
                  id="reg-pass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={fieldErrors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs">{fieldErrors.password}</p>}
              {password && !fieldErrors.password && (
                <div className="text-xs text-gray-500 mt-1">
                  La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-confirm-pass">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="reg-confirm-pass"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={fieldErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-500 text-xs">{fieldErrors.confirmPassword}</p>}
            </div>
            <Button
              className="w-full rounded-none"
              onClick={handleRegister}
              disabled={loading || !email || !password || !name || !lastName || !phone || !confirmPassword}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Procesando..." : "Crear cuenta"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}