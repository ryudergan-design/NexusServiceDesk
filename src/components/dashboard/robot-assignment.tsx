"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Check, Loader2, Trash2, ChevronRight } from "lucide-react"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { assignToAIAgent, unassignAIAgent } from "@/lib/actions/ai"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface RobotAssignmentProps {
  ticketId: number
  currentAssigneeId?: string | null
  onAssigned?: () => void
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "icon" | "default"
  className?: string
}

export function RobotAssignment({ 
  ticketId, 
  currentAssigneeId, 
  onAssigned,
  variant = "ghost",
  size = "icon",
  className
}: RobotAssignmentProps) {
  const { data: session } = useSession()
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [open, setOpen] = useState(false)

  const isClient = (session?.user as any)?.activeRole === "USER" || (session?.user as any)?.role === "USER"

  const fetchAgents = async () => {
    setFetching(true)
    try {
      const res = await fetch(`/api/ai-agents?t=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        setAgents(data)
      }
    } catch (e) {
      console.error("Erro ao buscar agentes IA", e)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const handleAssign = async (agentId: string) => {
    setLoading(true)
    try {
      await assignToAIAgent(ticketId, agentId)
      toast.success("Atendimento solicitado com sucesso!")
      setOpen(false)
      onAssigned?.()
    } catch (error: any) {
      toast.error(error.message || "Erro ao solicitar atendimento.")
    } finally {
      setLoading(false)
    }
  }

  const handleUnassign = async () => {
    setLoading(true)
    try {
      await unassignAIAgent(ticketId)
      toast.success("Robô removido com sucesso!")
      setOpen(false)
      onAssigned?.()
    } catch (error: any) {
      toast.error("Erro ao remover robô.")
    } finally {
      setLoading(false)
    }
  }

  const isAIActive = agents.some(a => a.id === currentAssigneeId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn(
            "h-9 w-9 p-0 rounded-xl transition-all duration-500 group relative overflow-hidden",
            isAIActive 
              ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:bg-primary hover:text-white" 
              : "bg-white/5 border-white/10 text-white/40 shadow-none hover:bg-white/10 hover:text-white",
            className
          )}
          title={isAIActive ? "Agente IA Ativo" : "Solicitar IA"}
        >
          {isAIActive && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}
          <Bot className={cn("h-5 w-5 relative z-10", isAIActive ? "animate-pulse" : "opacity-50 group-hover:opacity-100 group-hover:scale-110")} />
          {isAIActive && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-slate-900 border-white/10 p-2 shadow-2xl rounded-2xl">
        <div className="space-y-2">
          {isAIActive ? (
            <div className="space-y-2 p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/5 mb-1">
                <Bot className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Agente em Operação</span>
              </div>
              <Button 
                variant="destructive" 
                className="w-full justify-start gap-2 h-10 font-bold text-xs rounded-xl"
                onClick={handleUnassign}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Remover Robô
              </Button>
            </div>
          ) : (
            <div className="p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/5 mb-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Escolha um Especialista</span>
              </div>

              {fetching ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : agents.length > 0 ? (
                <div className="space-y-1">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      disabled={loading}
                      onClick={() => handleAssign(agent.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all hover:bg-white/5 group/bot"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/80 group-hover/bot:text-primary">{agent.name}</span>
                        {!isClient && <span className="text-[9px] font-mono opacity-30">{agent.aiModel}</span>}
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover/bot:opacity-100 group-hover/bot:translate-x-1 transition-all text-primary" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-[10px] text-white/20 italic">
                  Nenhum especialista disponível no momento.
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
