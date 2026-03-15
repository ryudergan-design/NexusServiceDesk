"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  User,
  ShieldCheck,
  Radar,
  Sparkles,
  Waypoints,
} from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email({ message: "Informe um e-mail válido" }),
  password: z.string().min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
  accessMode: z.enum(["staff", "user"]),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormContent() {
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
      setError("Credenciais inválidas. Confira seu e-mail e senha.")
    } else if (errorParam) {
      setError("Não foi possível concluir o acesso. Tente novamente.")
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
      accessMode: "user",
    },
  })

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
        setError(result.error === "CredentialsSignin" ? "E-mail ou senha incorretos." : result.error)
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Erro inesperado ao realizar login.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#030712_48%,#020617_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a entrada
          </Link>

          <div className="mt-10 max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
              <Radar className="h-3.5 w-3.5" />
              Nexus ServiceDesk
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white">
                Acesse a operação no mesmo padrão visual da plataforma.
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/55">
                Entre como cliente para acompanhar seus chamados ou como atendente para operar triagem, desenvolvimento, testes, aprovação e toda a fila técnica.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: "Fila centralizada",
                  text: "Desk e Kanban com visão operacional da fila real.",
                  icon: Waypoints,
                },
                {
                  title: "Atendimento assistido por IA",
                  text: "Gemini apoiando triagem, resposta e próximo passo do ticket.",
                  icon: Sparkles,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-black text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/45">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <div className="rounded-[1.6rem] border border-white/10 bg-[#07101f] p-8 sm:p-9">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">Acesso seguro</p>
                  <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Entrar na plataforma</h1>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Use sua conta aprovada para acessar o ambiente operacional.
                  </p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 shadow-[0_0_28px_rgba(59,130,246,0.35)] sm:flex">
                  <Radar className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
                <button
                  type="button"
                  onClick={() => setAccessMode("user")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] transition-all",
                    accessMode === "user"
                      ? "bg-primary text-white shadow-[0_0_24px_rgba(59,130,246,0.28)]"
                      : "text-white/35 hover:text-white/70"
                  )}
                >
                  <User className="h-4 w-4" />
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setAccessMode("staff")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] transition-all",
                    accessMode === "staff"
                      ? "bg-primary text-white shadow-[0_0_24px_rgba(59,130,246,0.28)]"
                      : "text-white/35 hover:text-white/70"
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Atendente
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                    E-mail de acesso
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="voce@empresa.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] font-bold text-red-300">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-11 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-4 text-white/25 transition-colors hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] font-bold text-red-300">{errors.password.message}</p>}
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    "Entrar agora"
                  )}
                </button>
              </form>

              <div className="mt-8 space-y-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/25">
                  Ainda não tem acesso?
                </p>
                <Link href="/auth/register" className="text-sm font-black text-primary transition-colors hover:text-cyan-300">
                  Solicitar criação de conta
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#030712]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  )
}
