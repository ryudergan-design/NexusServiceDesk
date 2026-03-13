"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { calculateSLAPercentage } from "@/lib/sla"
import { Clock, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SLAProgressProps {
  createdAt: string | Date
  dueAt: string | Date | null
  plannedDueDate?: string | Date | null
  label?: string
  compact?: boolean
}

export function SLAProgress({ createdAt, dueAt, plannedDueDate, label = "SLA", compact = false }: SLAProgressProps) {
  const [percentage, setPercentage] = React.useState(0)
  
  // Priorizar data planejada se ela existir
  const finalDueAt = plannedDueDate || dueAt

  React.useEffect(() => {
    const updatePercentage = () => {
      const created = new Date(createdAt).getTime()
      const due = finalDueAt ? new Date(finalDueAt).getTime() : null
      if (!due) return

      const now = new Date().getTime()
      const total = due - created
      const elapsed = now - created
      
      // Cálculo que permite passar de 100%
      const rawPercent = Math.floor((elapsed / total) * 100)
      setPercentage(rawPercent)
    }

    updatePercentage()
    const interval = setInterval(updatePercentage, 60000) // Atualiza a cada minuto
    return () => clearInterval(interval)
  }, [createdAt, finalDueAt])

  if (!finalDueAt) return null

  const isExpired = percentage >= 100
  const isCritical = percentage >= 80

  const getStatusColor = () => {
    if (isExpired) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
    if (isCritical) return "bg-orange-500"
    if (percentage >= 50) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full space-y-1.5 cursor-help group/sla">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-white/50 group-hover/sla:text-white/80 transition-colors flex items-center gap-1.5">
                {isExpired ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-white/30" />
                )}
                {label || "Prazo"}
              </span>
              <span className={cn(
                "tabular-nums tracking-tighter",
                isExpired ? "text-red-500" : isCritical ? "text-orange-400" : "text-emerald-400"
              )}>
                {percentage}%
              </span>
            </div>
            <div className={cn(
              "relative w-full overflow-hidden rounded-full bg-white/5 border border-white/5",
              compact ? "h-2" : "h-2.5"
            )}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                className={cn(
                  "h-full transition-all duration-500",
                  getStatusColor()
                )}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border-white/10 text-xs text-white p-3 shadow-2xl">
          <div className="space-y-1">
            <p className="font-black uppercase tracking-widest text-[10px] text-white/40">{label || "Resolução"}</p>
            <p className={cn("text-sm font-bold", isExpired ? "text-red-400" : "text-white")}>
              {isExpired ? `Atrasado em ${percentage - 100}%` : `${100 - percentage}% de tempo restante`}
            </p>
            <p className="text-[10px] text-white/30">
              Vence em: {new Date(finalDueAt).toLocaleString()}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
