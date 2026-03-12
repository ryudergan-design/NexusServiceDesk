"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, Lock, Building, Phone, Briefcase, CheckCircle2 } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres" }),
  department: z.string().min(2, { message: "Departamento é obrigatório" }),
  jobTitle: z.string().min(2, { message: "Cargo é obrigatório" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const nextStep = async () => {
    const fields = step === 1 ? ["name", "email", "password"] : []
    const isValid = await trigger(fields as any)
    if (isValid) setStep(step + 1)
  }

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    console.log("Register Data:", data)
    // Simular registro
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/20 p-4">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h2>
          <p className="text-muted-foreground mb-8">
            Seu cadastro foi recebido com sucesso. Aguarde a aprovação de um administrador para acessar o sistema.
          </p>
          <a
            href="/auth/login"
            className="inline-block w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Voltar para o Login
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-20 blur-xl"></div>
        
        <div className="relative rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Criar Conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Etapa {step} de 2</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                      <input
                        {...register("name")}
                        placeholder="João Silva"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="joao@empresa.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
                  >
                    Próximo Passo
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Departamento</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                      <input
                        {...register("department")}
                        placeholder="TI / Marketing / Vendas"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Cargo</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                      <input
                        {...register("jobTitle")}
                        placeholder="Analista Sênior"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                      <input
                        {...register("phone")}
                        placeholder="(11) 99999-9999"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-2/3 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all flex justify-center"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        "Finalizar Cadastro"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="/auth/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Fazer Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
