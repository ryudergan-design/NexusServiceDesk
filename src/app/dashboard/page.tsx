"use client"

import { motion } from "framer-motion"
import { Ticket, Users, Clock, CheckCircle2 } from "lucide-react"

const stats = [
  { label: "Total de Chamados", value: "154", icon: Ticket, color: "text-blue-500" },
  { label: "Em Atendimento", value: "28", icon: Clock, color: "text-amber-500" },
  { label: "Concluídos", value: "126", icon: CheckCircle2, color: "text-emerald-500" },
  { label: "Solicitantes Ativos", value: "452", icon: Users, color: "text-purple-500" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Principal</h1>
        <p className="mt-2 text-muted-foreground">Bem-vindo ao I9 Chamados, Administrador.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="mt-2 text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`rounded-xl bg-white/5 p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Placeholder para o sistema de Grid Flexível */}
        <div className="h-[400px] rounded-2xl border border-white/10 bg-white/5 p-8 flex items-center justify-center border-dashed">
          <p className="text-muted-foreground">Área para Widgets Flexíveis (Drag & Drop em breve)</p>
        </div>
        <div className="h-[400px] rounded-2xl border border-white/10 bg-white/5 p-8 flex items-center justify-center border-dashed">
          <p className="text-muted-foreground">Gráficos de Performance</p>
        </div>
      </div>
    </div>
  )
}
