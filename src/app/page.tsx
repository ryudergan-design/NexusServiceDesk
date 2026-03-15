"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bot,
  LayoutPanelTop,
  Radar,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const highlights = [
  {
    title: "Operação conectada",
    description: "Desk, Kanban e contexto técnico alinhados em uma única experiência.",
    icon: LayoutPanelTop,
    tone: "from-cyan-500/20 via-sky-500/10 to-blue-500/5 text-cyan-300",
  },
  {
    title: "IA aplicada",
    description: "Triagem, resposta e escalonamento assistidos com leitura clara para a equipe.",
    icon: Bot,
    tone: "from-blue-500/20 via-indigo-500/10 to-cyan-500/5 text-blue-300",
  },
  {
    title: "Fluxo contínuo",
    description: "Do primeiro atendimento ao retorno final, sem perder ritmo nem contexto.",
    icon: Waypoints,
    tone: "from-emerald-500/20 via-teal-500/10 to-cyan-500/5 text-emerald-300",
  },
  {
    title: "Governança visível",
    description: "SLA, auditoria e rastreabilidade apresentados de forma objetiva.",
    icon: ShieldCheck,
    tone: "from-violet-500/20 via-fuchsia-500/10 to-blue-500/5 text-violet-300",
  },
]

const quickSignals = [
  "Desk e Kanban conectados",
  "IA apoiando a operação",
  "SLA e contexto no mesmo fluxo",
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.14),transparent_22%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.10),transparent_18%),linear-gradient(180deg,#020617_0%,#030712_48%,#020617_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-cyan-400/10 bg-cyan-400/10 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">Nexus ServiceDesk</p>
              <p className="text-[10px] uppercase tracking-[0.14em] leading-[1.35] text-white/35">Operação high-tech de chamados</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-full border border-white/10 bg-white/5 px-5 text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild className="rounded-full px-5 font-black uppercase tracking-[0.16em] shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              <Link href="/auth/register">Criar Conta</Link>
            </Button>
          </div>
        </header>

        <div className="relative flex flex-1 items-center py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl space-y-10">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <Badge className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
                  Nexus Operation Layer
                </Badge>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/55">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  Atendimento e operação no mesmo pulso
                </div>

                <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
                  Um portal de atendimento com presença high tech e cara de operação real.
                </h1>

                <p className="mx-auto max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
                  O Nexus ServiceDesk apresenta atendimento, fluxo técnico e apoio de IA em uma experiência moderna,
                  clara e responsiva, com identidade forte sem excesso de informação.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="flex flex-wrap justify-center gap-3">
                {quickSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 backdrop-blur-xl"
                  >
                    {signal}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Button asChild size="lg" className="h-14 rounded-2xl px-6 text-sm font-black uppercase tracking-[0.18em] shadow-[0_0_30px_rgba(59,130,246,0.35)] sm:min-w-[240px]">
                <Link href="/auth/login" className="flex items-center justify-center gap-2">
                  Acessar Plataforma
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl border-white/10 bg-white/5 px-6 text-sm font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl hover:bg-white/10 hover:text-white sm:min-w-[240px]"
              >
                <Link href="/auth/register" className="flex items-center justify-center">
                  Solicitar Nova Conta
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {highlights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/[0.06]">
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br", item.tone)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{item.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
