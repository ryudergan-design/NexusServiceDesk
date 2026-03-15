"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  History,
  LayoutPanelTop,
  ShieldCheck,
  Sparkles,
  Ticket,
  User as UserIcon,
  Users,
  Waypoints,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardClientProps {
  statsData: any
  activeRole: string
}

const BAR_COLORS = ["#22d3ee", "#3b82f6", "#a855f7", "#f59e0b", "#10b981", "#f43f5e"]

export function DashboardClient({ statsData, activeRole }: DashboardClientProps) {
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const isStaffMode = activeRole === "ADMIN" || activeRole === "AGENT"

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/dashboard/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-chamados-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert("Erro ao exportar relatório.")
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    if (!isStaffMode) return

    fetch("/api/dashboard/audit")
      .then((res) => res.json())
      .then((data) => {
        setAuditLogs(Array.isArray(data) ? data : [])
        setLoadingLogs(false)
      })
      .catch(() => setLoadingLogs(false))
  }, [isStaffMode])

  const stats = isStaffMode
    ? [
        {
          label: "Total de chamados",
          value: (statsData?.total ?? 0).toString(),
          icon: Ticket,
          href: "/dashboard/tickets",
          glow: "shadow-[0_0_30px_rgba(34,211,238,0.14)]",
          iconTone: "text-cyan-300",
          accent: "from-cyan-400/25 to-blue-500/10",
        },
        {
          label: "Em atendimento",
          value: (statsData?.open ?? 0).toString(),
          icon: Clock,
          href: "/dashboard/tickets?view=assigned",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.14)]",
          iconTone: "text-amber-300",
          accent: "from-amber-400/25 to-orange-500/10",
        },
        {
          label: "Concluídos",
          value: (statsData?.closed ?? 0).toString(),
          icon: CheckCircle2,
          href: "/dashboard/tickets?view=my_closed",
          glow: "shadow-[0_0_30px_rgba(16,185,129,0.14)]",
          iconTone: "text-emerald-300",
          accent: "from-emerald-400/25 to-teal-500/10",
        },
        {
          label: "Usuários aprovados",
          value: (statsData?.users ?? 0).toString(),
          icon: Users,
          href: "/dashboard/admin/users",
          glow: "shadow-[0_0_30px_rgba(168,85,247,0.14)]",
          iconTone: "text-fuchsia-300",
          accent: "from-fuchsia-500/25 to-violet-500/10",
        },
      ]
    : [
        {
          label: "Minhas solicitações",
          value: (statsData?.total ?? 0).toString(),
          icon: Ticket,
          href: "/dashboard/tickets?view=my_open",
          glow: "shadow-[0_0_30px_rgba(34,211,238,0.14)]",
          iconTone: "text-cyan-300",
          accent: "from-cyan-400/25 to-blue-500/10",
        },
        {
          label: "Aguardando aprovação",
          value: (statsData?.awaitingApproval ?? 0).toString(),
          icon: ShieldCheck,
          href: "/dashboard/tickets?view=my_approval",
          glow: "shadow-[0_0_30px_rgba(168,85,247,0.14)]",
          iconTone: "text-fuchsia-300",
          accent: "from-fuchsia-500/25 to-violet-500/10",
        },
        {
          label: "Aguardando resposta",
          value: (statsData?.awaitingResponse ?? 0).toString(),
          icon: History,
          href: "/dashboard/tickets?view=my_open",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.14)]",
          iconTone: "text-amber-300",
          accent: "from-amber-400/25 to-orange-500/10",
        },
        {
          label: "Finalizados",
          value: (statsData?.closed ?? 0).toString(),
          icon: CheckCircle2,
          href: "/dashboard/tickets?view=my_closed",
          glow: "shadow-[0_0_30px_rgba(16,185,129,0.14)]",
          iconTone: "text-emerald-300",
          accent: "from-emerald-400/25 to-teal-500/10",
        },
      ]

  const quickLinks = isStaffMode
    ? [
        {
          label: "Sem atendente",
          text: "Abrir fila para assumir e distribuir tickets.",
          href: "/dashboard/tickets/unassigned",
          icon: LayoutPanelTop,
          tone: "text-cyan-300",
        },
        {
          label: "Meus atendimentos",
          text: "Acompanhar tickets já atribuídos.",
          href: "/dashboard/tickets?view=assigned",
          icon: Waypoints,
          tone: "text-blue-300",
        },
        {
          label: "Aguardando aprovação",
          text: "Revisar chamados com orçamento pendente.",
          href: "/dashboard/tickets?view=awaiting_approval",
          icon: ShieldCheck,
          tone: "text-fuchsia-300",
        },
      ]
    : [
        {
          label: "Chamados abertos",
          text: "Ver solicitações em andamento.",
          href: "/dashboard/tickets?view=my_open",
          icon: Ticket,
          tone: "text-cyan-300",
        },
        {
          label: "Minha aprovação",
          text: "Revisar aprovações pendentes.",
          href: "/dashboard/tickets?view=my_approval",
          icon: ShieldCheck,
          tone: "text-fuchsia-300",
        },
        {
          label: "Histórico",
          text: "Consultar chamados finalizados.",
          href: "/dashboard/tickets?view=my_closed",
          icon: History,
          tone: "text-emerald-300",
        },
      ]

  const formatLogAction = (log: any) => {
    const name = log.user?.name || "Sistema"
    switch (log.action) {
      case "CREATE":
        return `${name} criou um novo ${log.entity}`
      case "UPDATE":
        return `${name} atualizou ${log.entity}`
      case "DELETE":
        return `${name} removeu ${log.entity}`
      case "UPDATE_STATUS":
        return `${name} alterou o status do chamado`
      default:
        return `${name} realizou uma ação em ${log.entity}`
    }
  }

  const topCategories = (statsData?.categoryStats ?? []).slice(0, 5)
  const aiOverview = statsData?.aiOverview

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">
            {isStaffMode ? "Indicadores operacionais" : "Resumo do atendimento"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/45">
            {isStaffMode
              ? "Volume, andamento, categorias e atividade recente."
              : "Visão rápida do que precisa da sua atenção."}
          </p>
        </div>

        {isStaffMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="h-11 rounded-2xl border-cyan-400/20 bg-white/[0.04] px-4 text-white hover:bg-white/[0.08]"
          >
            <Download className="mr-2 h-4 w-4 text-cyan-300" />
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.button
            key={stat.label}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            onClick={() => router.push(stat.href)}
            className={cn(
              "group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 text-left transition-all hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.06]",
              stat.glow
            )}
          >
            <div className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-90", stat.accent)} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">{stat.label}</p>
                <h3 className="mt-4 text-4xl font-black tracking-tight text-white">{stat.value}</h3>
              </div>
              <div className={cn("rounded-2xl border border-white/10 bg-[#09111f] p-3 transition-transform duration-300 group-hover:scale-110", stat.iconTone)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/30">
              Abrir
              <ArrowRight className="h-4 w-4" />
            </div>
          </motion.button>
        ))}
      </div>

      <div className={cn("grid gap-6", isStaffMode ? "xl:grid-cols-[1.08fr_0.92fr]" : "xl:grid-cols-[1.05fr_0.95fr]")}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">
                {isStaffMode ? "Acessos rápidos" : "Atalhos"}
              </p>
              <h3 className="mt-3 text-xl font-black text-white">
                {isStaffMode ? "Áreas mais usadas" : "Ações principais"}
              </h3>
            </div>
            {isStaffMode ? <Waypoints className="h-5 w-5 text-cyan-300" /> : <Sparkles className="h-5 w-5 text-fuchsia-300" />}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {quickLinks.map((card, index) => (
              <motion.button
                key={card.label}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + index * 0.07 }}
                onClick={() => router.push(card.href)}
                className="rounded-3xl border border-white/8 bg-[#08101d] p-4 text-left transition-all hover:border-cyan-400/20 hover:bg-[#0b1527]"
              >
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]", card.tone)}>
                  <card.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-black text-white">{card.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/40">{card.text}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {isStaffMode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-fuchsia-200">Categorias</p>
                <h3 className="mt-3 text-xl font-black text-white">Volume por categoria</h3>
              </div>
              <Ticket className="h-5 w-5 text-fuchsia-300" />
            </div>

            <div className="mt-5 h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData?.categoryStats ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#07101f",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {(statsData?.categoryStats ?? []).map((entry: any, index: number) => (
                      <Cell key={`${entry.name}-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-fuchsia-200">Prioridades</p>
                <h3 className="mt-3 text-xl font-black text-white">O que olhar agora</h3>
              </div>
              <AlertCircle className="h-5 w-5 text-fuchsia-300" />
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "Solicitações abertas", value: `${statsData?.total ?? 0} registradas` },
                { label: "Aguardando aprovação", value: `${statsData?.awaitingApproval ?? 0} pendentes` },
                { label: "Aguardando resposta", value: `${statsData?.awaitingResponse ?? 0} exigem retorno` },
                { label: "Finalizados", value: `${statsData?.closed ?? 0} concluídos` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-[#08101d] px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">{item.label}</p>
                  <p className="mt-2 text-sm font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {isStaffMode ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16 }}
            className="rounded-[1.8rem] border border-cyan-400/15 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">Radar de IA</p>
                <h3 className="mt-3 text-xl font-black text-white">Atendimento assistido</h3>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Robos ativos", value: `${aiOverview?.agents ?? 0}` },
                { label: "Tickets com IA", value: `${aiOverview?.activeTickets ?? 0}` },
                { label: "Processamentos 7 dias", value: `${aiOverview?.logsLast7Days ?? 0}` },
                { label: "Tickets com datas", value: `${aiOverview?.ticketsWithPlanning ?? 0}` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-[#08101d] px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-[#08101d] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">Leitura operacional</p>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
                  IA em producao
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Cobertura</p>
                  <p className="mt-2 text-sm font-black text-white">
                    {aiOverview?.activeTickets ?? 0} tickets em atendimento por IA
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Planejamento</p>
                  <p className="mt-2 text-sm font-black text-white">
                    {aiOverview?.ticketsWithPlanning ?? 0} tickets com inicio e entrega definidos
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Movimento</p>
                  <p className="mt-2 text-sm font-black text-white">
                    {aiOverview?.logsLast7Days ?? 0} processamentos registrados na ultima semana
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">Robos mais ativos</p>
              <div className="mt-3 space-y-3">
                {(aiOverview?.topAgents ?? []).length > 0 ? (
                  aiOverview.topAgents.map((agent: { name: string; count: number }, index: number) => (
                    <div key={agent.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-sm font-black text-white">{agent.name}</p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/25">Rank {index + 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-cyan-300">{agent.count}</p>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">execucoes</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-white/35">
                    Ainda nao existem logs suficientes para montar o ranking de IA.
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200">Resumo rápido</p>
                <h3 className="mt-3 text-xl font-black text-white">Leitura da operação</h3>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "Em andamento", value: `${statsData?.open ?? 0} tickets` },
                { label: "Concluídos", value: `${statsData?.closed ?? 0} tickets` },
                { label: "Categorias ativas", value: `${statsData?.categoryStats?.length ?? 0}` },
                { label: "Equipe aprovada", value: `${statsData?.users ?? 0} usuários` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-[#08101d] px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">{item.label}</p>
                  <p className="mt-2 text-sm font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {topCategories.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {topCategories.slice(0, 4).map((category: any, index: number) => (
                  <div key={category.name} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">Top {index + 1}</p>
                    <p className="mt-2 text-sm font-black text-white">{category.name}</p>
                    <p className="mt-2 text-xl font-black text-cyan-300">{category.value}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28 }}
            className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <h3 className="mb-6 flex items-center gap-2 text-lg font-black text-white">
              <History className="h-5 w-5 text-cyan-300" />
              Atividades recentes
            </h3>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[420px]">
              {loadingLogs ? (
                <p className="text-sm text-white/25 animate-pulse">Carregando logs...</p>
              ) : auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-[#08101d] p-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <UserIcon className="h-4 w-4 text-white/45" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 text-white/80">
                        {formatLogAction(log)}
                        {log.entityId && <span className="ml-1 text-[10px] font-mono text-white/25">#{log.entityId}</span>}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/25">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm italic text-white/25">Nenhuma atividade registrada.</p>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  )
}
