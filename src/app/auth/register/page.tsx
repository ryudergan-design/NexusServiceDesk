"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Mail,
  Phone,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Waypoints,
} from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Informe seu nome completo" }),
  email: z.string().email({ message: "Informe um e-mail válido" }),
  password: z.string().min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
  department: z.string().min(2, { message: "Informe o setor ou departamento" }),
  jobTitle: z.string().min(2, { message: "Informe seu cargo" }),
  phone: z.string().min(10, { message: "Informe um telefone válido" }),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const nextStep = async () => {
    setServerError(null)
    const isValid = await trigger(["name", "email", "password"])
    if (isValid) {
      setStep(2)
    }
  }

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setServerError(result.error || "Não foi possível enviar sua solicitação agora.")
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
    } catch {
      setServerError("Erro inesperado ao enviar a solicitação de acesso.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#030712_48%,#020617_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

        <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="rounded-[1.6rem] border border-white/10 bg-[#07101f] p-8 text-center sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-primary to-cyan-400 shadow-[0_0_35px_rgba(59,130,246,0.35)]">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>

              <p className="mt-6 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">Solicitação enviada</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Seu acesso entrou para análise.
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/50 sm:text-base">
                Sua conta foi criada como solicitação pendente. Assim que um administrador aprovar o cadastro, você já poderá entrar na plataforma.
              </p>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">Próximo passo</p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  Aguarde a liberação do seu acesso. Depois disso, use sua conta na tela de login para acompanhar chamados, respostas e todo o fluxo do ServiceDesk.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/login"
                  className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] transition-all hover:opacity-90"
                >
                  Ir para login
                </Link>
                <Link
                  href="/"
                  className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[11px] font-black uppercase tracking-[0.22em] text-white/75 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  Voltar ao início
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#030712_48%,#020617_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a entrada
          </Link>

          <div className="mt-10 max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
              <Radar className="h-3.5 w-3.5" />
              Conta para solicitantes e operação
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white">
                Solicite acesso com o mesmo padrão visual da plataforma.
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/55">
                O cadastro envia sua conta para aprovação administrativa. Depois da liberação, você acompanha chamados, respostas, movimentações e todo o histórico do atendimento.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: "Fluxo organizado",
                  text: "Cadastro em duas etapas com dados essenciais para liberar acesso com contexto.",
                  icon: Waypoints,
                },
                {
                  title: "Entrada segura",
                  text: "Solicitação vai para aprovação antes de liberar a operação no ambiente.",
                  icon: ShieldCheck,
                },
                {
                  title: "Experiência alinhada",
                  text: "Mesmo visual high-tech do login e da plataforma principal.",
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
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">Cadastro assistido</p>
                  <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Criar solicitação de conta</h1>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Preencha seus dados para enviar o acesso para aprovação.
                  </p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 shadow-[0_0_28px_rgba(59,130,246,0.35)] sm:flex">
                  <Send className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3">
                {[1, 2].map((currentStep) => (
                  <div key={currentStep} className="flex flex-1 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-[11px] font-black uppercase tracking-[0.12em] transition-all ${
                        step === currentStep
                          ? "border-primary/40 bg-primary text-white shadow-[0_0_22px_rgba(59,130,246,0.26)]"
                          : "border-white/10 bg-white/[0.04] text-white/35"
                      }`}
                    >
                      0{currentStep}
                    </div>
                    {currentStep < 2 && <div className="h-px flex-1 bg-white/10" />}
                  </div>
                ))}
              </div>

              {serverError && (
                <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 14 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                          Nome completo
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                          <input
                            {...register("name")}
                            id="name"
                            placeholder="Como você gostaria de ser identificado"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                        {errors.name && <p className="text-[11px] font-bold text-red-300">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                          E-mail corporativo
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
                          Senha inicial
                        </label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                          <input
                            {...register("password")}
                            id="password"
                            type="password"
                            placeholder="Crie uma senha para seu acesso"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                        {errors.password && <p className="text-[11px] font-bold text-red-300">{errors.password.message}</p>}
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] transition-all hover:opacity-90"
                      >
                        Avançar cadastro
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <label htmlFor="department" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                          Setor ou departamento
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                          <input
                            {...register("department")}
                            id="department"
                            placeholder="Ex.: Comercial, TI, Financeiro"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                        {errors.department && <p className="text-[11px] font-bold text-red-300">{errors.department.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="jobTitle" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                          Cargo
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                          <input
                            {...register("jobTitle")}
                            id="jobTitle"
                            placeholder="Ex.: Analista, Coordenador, Supervisor"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                        {errors.jobTitle && <p className="text-[11px] font-bold text-red-300">{errors.jobTitle.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/30">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-4 h-4 w-4 text-white/20" />
                          <input
                            {...register("phone")}
                            id="phone"
                            placeholder="(00) 00000-0000"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/15 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                        {errors.phone && <p className="text-[11px] font-bold text-red-300">{errors.phone.message}</p>}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-[11px] font-black uppercase tracking-[0.22em] text-white/75 transition-all hover:bg-white/[0.08] hover:text-white"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Voltar
                        </button>
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="flex h-14 flex-[1.4] items-center justify-center rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] transition-all hover:opacity-90 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          ) : (
                            "Enviar para aprovação"
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-8 space-y-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/25">
                  Já tem acesso aprovado?
                </p>
                <Link href="/auth/login" className="text-sm font-black text-primary transition-colors hover:text-cyan-300">
                  Entrar na plataforma
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
