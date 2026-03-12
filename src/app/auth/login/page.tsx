"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Lock, Mail, AlertCircle, User, ShieldCheck } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres" }),
  accessMode: z.enum(["staff", "user"])
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessMode, setAccessMode] = useState<"staff" | "user">("user")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "CredentialsSignin") {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.")
    } else if (errorParam) {
      setError("Ocorreu um erro ao tentar entrar. Tente novamente.")
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      accessMode: "user"
    }
  })

  // Sincronizar campo oculto do formulário com o estado visual das abas
  useEffect(() => {
    setValue("accessMode", accessMode)
  }, [accessMode, setValue])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        accessMode: data.accessMode,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("E-mail ou senha incorretos.")
        } else {
          setError(result.error)
        }
        setIsLoading(false)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError("Erro inesperado ao realizar login.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary opacity-10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-accent opacity-10 blur-[120px] rounded-full animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-white">I9 <span className="text-primary">CHAMADOS</span></h1>
            <p className="mt-3 text-sm text-white/40 uppercase tracking-widest font-medium">Acesse seu painel</p>
          </div>

          {/* Role Switcher (Softdesk Style) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setAccessMode("user")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase transition-all rounded-lg",
                accessMode === "user" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <User className="h-3.5 w-3.5" /> Solicitante
            </button>
            <button
              type="button"
              onClick={() => setAccessMode("staff")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase transition-all rounded-lg",
                accessMode === "staff" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Atendente
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40" htmlFor="email">
                Identificação
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] font-bold text-red-400 uppercase">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40" htmlFor="password">
                Chave de Acesso
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-10 text-sm text-white placeholder:text-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-[10px] font-bold text-red-400 uppercase">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">
              Novo por aqui?{" "}
              <a href="/auth/register" className="text-primary hover:text-primary/80 transition-colors">
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
