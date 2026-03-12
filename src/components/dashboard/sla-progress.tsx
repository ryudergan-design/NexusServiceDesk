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

interface SLAProgressProps {
  createdAt: string | Date
  dueAt: string | Date | null
  label?: string
}

export function SLAProgress({ createdAt, dueAt, label = "SLA" }: SLAProgressProps) {
  const [percentage, setPercentage] = React.useState(0)
  
  React.useEffect(() => {
    const created = new Date(createdAt)
    const due = dueAt ? new Date(dueAt) : null
    setPercentage(calculateSLAPercentage(created, due))
  }, [createdAt, dueAt])

  if (!dueAt) return null

  const isCritical = percentage >= 80
  const isExpired = percentage >= 100

  const getStatusColor = () => {
    if (isExpired) return "bg-red-600"
    if (isCritical) return "bg-orange-500"
    if (percentage >= 50) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getTimeLeft = () => {
    const now = new Date()
    const due = new Date(dueAt)
    const diff = due.getTime() - now.getTime()
    
    if (diff <= 0) return "Expirado"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m restantes`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full space-y-1.5 cursor-help group/sla">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/40 group-hover/sla:text-white/60 transition-colors flex items-center gap-1">
                {isExpired ? (
                  <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {label}
              </span>
              <span className={`font-medium ${isCritical ? "text-orange-400" : "text-white/40"}`}>
                {percentage}%
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className={`h-full transition-all ${getStatusColor()}`}
              />
              {isCritical && !isExpired && (
                <motion.div 
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-white"
                />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black border-white/10 text-xs text-white">
          <p className="font-bold">{label}</p>
          <p className="text-white/60">{getTimeLeft()}</p>
          <p className="text-[10px] text-white/30 mt-1">
            Vence em: {new Date(dueAt).toLocaleString()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
