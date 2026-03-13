"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useState, useEffect } from "react"
import { Ticket, Users, Clock, CheckCircle2, History, User as UserIcon, Download, AlertCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DashboardClientProps {
  statsData: any
  activeRole: string
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444']

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
      a.download = `relatorio-chamados-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert("Erro ao exportar relatório.")
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    if (isStaffMode) {
      fetch("/api/dashboard/audit")
        .then(res => res.json())
        .then(data => {
          setAuditLogs(Array.isArray(data) ? data : [])
          setLoadingLogs(false)
        })
        .catch(() => setLoadingLogs(false))
    }
  }, [isStaffMode])

  const stats = isStaffMode ? [
    { label: "Total de Chamados", value: (statsData?.total ?? 0).toString(), icon: Ticket, color: "text-blue-500", href: "/dashboard/tickets" },
    { label: "Em Atendimento", value: (statsData?.open ?? 0).toString(), icon: Clock, color: "text-amber-500", href: "/dashboard/tickets?view=assigned" },
    { label: "Concluídos", value: (statsData?.closed ?? 0).toString(), icon: CheckCircle2, color: "text-emerald-500", href: "/dashboard/tickets?view=my_closed" },
    { label: "Gestão de Usuários", value: (statsData?.users ?? 0).toString(), icon: Users, color: "text-purple-500", href: "/dashboard/admin/users" },
  ] : [
    { label: "Minhas Solicitações", value: (statsData?.total ?? 0).toString(), icon: Ticket, color: "text-blue-500", href: "/dashboard/tickets?view=my_open" },
    { label: "Aguardando Aprovação", value: (statsData?.awaitingApproval ?? 0).toString(), icon: ShieldCheck, color: "text-purple-500", href: "/dashboard/tickets?view=my_approval" },
    { label: "Minha Resposta", value: (statsData?.awaitingResponse ?? 0).toString(), icon: History, color: "text-orange-500", href: "/dashboard/tickets?view=my_open" },
    { label: "Finalizados", value: (statsData?.closed ?? 0).toString(), icon: CheckCircle2, color: "text-emerald-500", href: "/dashboard/tickets?view=my_closed" },
  ]

  const formatLogAction = (log: any) => {
    const name = log.user?.name || "Sistema"
    switch (log.action) {
      case "CREATE": return `${name} criou um novo ${log.entity}`
      case "UPDATE": return `${name} atualizou ${log.entity}`
      case "DELETE": return `${name} removeu ${log.entity}`
      case "UPDATE_STATUS": return `${name} alterou o status do chamado`
      default: return `${name} realizou uma ação em ${log.entity}`
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white">
          {isStaffMode ? "Indicadores de Desempenho" : "Resumo de Atividades"}
        </h2>
        {isStaffMode && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isExporting}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2"
          >
            <Download className="h-4 w-4 text-primary" />
            {isExporting ? "Exportando..." : "Exportar Relatório CSV"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => stat.href && router.push(stat.href)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition-all cursor-pointer hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-white/80 transition-colors">{stat.label}</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={cn("rounded-xl bg-white/5 p-3 transition-transform group-hover:scale-110 duration-500", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isStaffMode ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico de Volume por Categoria */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Volume por Categoria</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statsData.categoryStats?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Feed de Auditoria Real */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Atividades Recentes
            </h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {loadingLogs ? (
                <p className="text-sm text-white/20 animate-pulse">Carregando logs...</p>
              ) : auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0">
                    <div className="mt-1 h-7 w-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <UserIcon className="h-3.5 w-3.5 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 leading-snug">
                        {formatLogAction(log)}
                        {log.entityId && <span className="ml-1 text-[10px] text-white/20 font-mono">#{log.entityId}</span>}
                      </p>
                      <p className="text-[10px] text-white/20 mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/20 italic">Nenhuma atividade registrada.</p>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <AlertCircle className="h-8 w-8 text-white/10 mb-2" />
          <p className="text-sm text-white/20 italic uppercase tracking-widest text-center">
            Suas métricas de atendimento e solicitações críticas são exibidas acima.
          </p>
        </div>
      )}
    </div>
  )
}
