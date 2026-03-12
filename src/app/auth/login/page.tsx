"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres" }),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    console.log("Login Attempt:", data)
    // Simular delay de auth
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md"
      >
        {/* Glow Effect Background */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">I9 Chamados</h1>
            <p className="mt-2 text-sm text-muted-foreground">Acesse sua conta para gerenciar chamados</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="exemplo@i9.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Ainda não tem conta?{" "}
            <a href="/auth/register" className="font-semibold text-primary hover:underline underline-offset-4">
              Solicitar cadastro
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
