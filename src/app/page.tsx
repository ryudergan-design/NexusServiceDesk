"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bot,
  CalendarRange,
  CircleDashed,
  Clock3,
  LayoutPanelTop,
  Radar,
  ShieldCheck,
  Sparkles,
  Ticket,
  Waypoints,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const highlights = [
  {
    title: "Operação em tempo real",
    description: "Kanban, Desk e detalhe técnico conectados no mesmo fluxo operacional.",
    icon: LayoutPanelTop,
    tone: "from-cyan-500/20 to-blue-500/5 text-cyan-300",
  },
  {
    title: "IA dentro do atendimento",
    description: "Triagem, resposta, escalonamento e planejamento de datas com Gemini.",
    icon: Bot,
    tone: "from-blue-500/20 to-indigo-500/5 text-blue-300",
  },
  {
    title: "Workflow completo",
    description: "Triagem, desenvolvimento, testes, aprovação e retorno ao cliente.",
    icon: Waypoints,
    tone: "from-emerald-500/20 to-teal-500/5 text-emerald-300",
  },
  {
    title: "Governança visível",
    description: "SLA, auditoria, orçamentos e rastreabilidade em toda a operação.",
    icon: ShieldCheck,
    tone: "from-violet-500/20 to-fuchsia-500/5 text-violet-300",
  },
]

const liveMetrics = [
  { label: "Views operacionais", value: "Desk + Kanban" },
  { label: "Fluxos ativos", value: "Triagem a Testes" },
  { label: "Planejamento", value: "Início e Entrega" },
  { label: "Atendimento assistido", value: "Humano + IA" },
]

const queueRows = [
  {
    id: "new",
    label: "Sem atendente",
    count: "18",
    detail: "Fila pronta para assumir no Desk",
    tone: "from-cyan-400 to-blue-500",
  },
  {
    id: "dev",
    label: "Em desenvolvimento",
    count: "24",
    detail: "Cards vivos com prazo e contexto",
    tone: "from-amber-400 to-orange-500",
  },
  {
    id: "test",
    label: "Em testes",
    count: "16",
    detail: "Validação antes do retorno ao cliente",
    tone: "from-emerald-400 to-teal-500",
  },
]

const timelineRows = [
  { title: "Chamado #542", range: "17 Mar - 19 Mar", status: "Em desenvolvimento" },
  { title: "Chamado #538", range: "18 Mar - 20 Mar", status: "Aguardando cliente" },
  { title: "Chamado #535", range: "19 Mar - 21 Mar", status: "Pronto para testes" },
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#030712_48%,#020617_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">Nexus ServiceDesk</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Operação High-Tech de Chamados</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden rounded-full border border-white/10 bg-white/5 px-5 text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild className="rounded-full px-5 font-black uppercase tracking-[0.16em] shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              <Link href="/auth/register">Criar Conta</Link>
            </Button>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Badge className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
                Phase 14 Consolidada
              </Badge>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Atendimento, workflow e inteligência no mesmo pulso operacional.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                O Nexus ServiceDesk centraliza fila, triagem, desenvolvimento, testes, aprovação e retorno ao cliente em uma experiência moderna, responsiva e assistida por IA.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-2xl px-7 text-sm font-black uppercase tracking-[0.18em] shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                <Link href="/auth/login" className="flex items-center gap-2">
                  Acessar Plataforma
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 px-7 text-sm font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl hover:bg-white/10 hover:text-white">
                <Link href="/auth/register">Solicitar Nova Conta</Link>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }} className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/[0.06]">
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br", item.tone)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-black text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/45">{item.description}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12 }} className="relative">
            <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-6 hidden h-36 w-36 rounded-full bg-primary/25 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(59,130,246,0.08),transparent_38%,transparent_62%,rgba(34,211,238,0.06))]" />

              <div className="relative rounded-[1.6rem] border border-white/10 bg-[#050b19]/95 p-5">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">Painel High-Tech</p>
                    <p className="mt-1 text-sm text-white/35">Prévia da operação real do Desk, IA e cronograma técnico.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    <CircleDashed className="h-3.5 w-3.5 animate-spin" />
                    Online
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {liveMetrics.map((metric, index) => (
                    <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">{metric.label}</p>
                      <p className="mt-3 text-lg font-black text-white">{metric.value}</p>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${58 + index * 9}%` }}
                          transition={{ duration: 0.9, delay: 0.25 + index * 0.07 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-primary to-violet-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-cyan-400/10 bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Fila operacional</p>
                        <p className="mt-2 text-sm text-white/40">Status vivos alinhados ao fluxo principal.</p>
                      </div>
                      <LayoutPanelTop className="h-4 w-4 text-cyan-300" />
                    </div>

                    <div className="mt-4 space-y-3">
                      {queueRows.map((row, index) => (
                        <motion.div
                          key={row.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.32 + index * 0.07 }}
                          className="rounded-2xl border border-white/8 bg-[#08101d] px-4 py-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("h-10 w-1 rounded-full bg-gradient-to-b", row.tone)} />
                              <div>
                                <p className="text-sm font-black text-white">{row.label}</p>
                                <p className="text-xs text-white/35">{row.detail}</p>
                              </div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-right">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Ativos</p>
                              <p className="text-lg font-black text-white">{row.count}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-3xl border border-blue-400/10 bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">Núcleo de IA</p>
                          <p className="mt-2 text-sm text-white/40">Assistência visível dentro do atendimento.</p>
                        </div>
                        <Sparkles className="h-4 w-4 text-blue-300" />
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/8 bg-[#08101d] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/15 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">Gemini em triagem e resposta</p>
                            <p className="text-xs text-white/35">Sugere status, datas e mensagem ao cliente.</p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Escalação</p>
                            <p className="mt-2 text-sm font-black text-white">Atendente definido</p>
                          </div>
                          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Cliente</p>
                            <p className="mt-2 text-sm font-black text-white">Mensagem pública</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-violet-400/10 bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">Cronograma técnico</p>
                          <p className="mt-2 text-sm text-white/40">Início e entrega visíveis no detalhe.</p>
                        </div>
                        <CalendarRange className="h-4 w-4 text-violet-300" />
                      </div>

                      <div className="mt-4 space-y-3">
                        {timelineRows.map((row, index) => (
                          <motion.div
                            key={row.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.45 + index * 0.06 }}
                            className="flex items-start gap-3 rounded-2xl border border-white/8 bg-[#08101d] p-3"
                          >
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
                              <Clock3 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-white">{row.title}</p>
                              <p className="mt-1 text-xs text-white/35">{row.range}</p>
                              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-violet-200/80">{row.status}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white/45">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-cyan-300" />
                    Desk, Kanban, IA e cronograma no mesmo contexto operacional.
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
