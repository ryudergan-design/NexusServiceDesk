"use client"

import React, { useState, useMemo } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SLAProgress } from "@/components/dashboard/sla-progress"
import { 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  ChevronRight,
  Clock,
  User as UserIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Bot
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RobotAssignment } from "@/components/dashboard/robot-assignment"
import { AIPowerEffect } from "@/components/ui/ai-power-effect"

interface DeskViewProps {
  tickets: any[]
  currentUser: any
  onSelectTicket?: (ticketId: string) => void
  onUpdate?: () => void
}

const statusConfig: Record<string, { label: string, color: string }> = {
  NEW: { label: "Novo", color: "bg-blue-600/10 text-blue-400 border-blue-600/20" },
  TRIAGE: { label: "Em Triagem", color: "bg-amber-600/10 text-amber-400 border-amber-600/20" },
  DEVELOPMENT: { label: "Em Desenvolvimento", color: "bg-indigo-600/10 text-indigo-400 border-indigo-600/20" },
  TESTING: { label: "Em Testes", color: "bg-pink-600/10 text-pink-400 border-pink-600/20" },
  BUDGET_APPROVAL: { label: "Orçamento / Aprovação", color: "bg-purple-600/10 text-purple-400 border-purple-600/20" },
  PENDING_USER: { label: "Aguardando Cliente", color: "bg-orange-600/10 text-orange-400 border-orange-600/20" },
  COMPLETED: { label: "Concluído", color: "bg-emerald-600/10 text-emerald-400 border-emerald-600/20" },
}

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
}

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
}

export function DeskView({ tickets, currentUser, onSelectTicket, onUpdate }: DeskViewProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' })

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedTickets = useMemo(() => {
    const items = [...tickets]
    items.sort((a, b) => {
      let aValue: any = a[sortConfig.key]
      let bValue: any = b[sortConfig.key]

      // Lógicas especiais de valor
      if (sortConfig.key === 'category') {
        aValue = a.category.name
        bValue = b.category.name
      }
      if (sortConfig.key === 'requester') {
        aValue = a.requester.name
        bValue = b.requester.name
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    return items
  }, [tickets, sortConfig])

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-30" />
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" /> : 
      <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 overflow-hidden shadow-2xl backdrop-blur-xl">
      <Table>
        <TableHeader className="bg-white/[0.03]">
          <TableRow className="hover:bg-transparent border-white/5 h-12">
            <TableHead 
              className="w-[100px] cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('id')}
            >
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                ID <SortIcon columnKey="id" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                Assunto <SortIcon columnKey="title" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('priority')}
            >
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                Prioridade <SortIcon columnKey="priority" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('requester')}
            >
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                {currentUser?.activeRole === "USER" ? "Atendente" : "Cliente"} <SortIcon columnKey="requester" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                Status <SortIcon columnKey="status" />
              </div>
            </TableHead>
            <TableHead className="w-[80px]">
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                IA
              </div>
            </TableHead>
            <TableHead 
              className="w-[200px] cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('resolutionTimeDue')}
            >
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                SLA <SortIcon columnKey="resolutionTimeDue" />
              </div>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTickets.length > 0 ? (
            sortedTickets.map((ticket) => (
              <TableRow 
                key={ticket.id} 
                onClick={() => onSelectTicket?.(ticket.id.toString())}
                className={cn(
                  "group cursor-pointer hover:bg-white/[0.03] border-white/5 transition-all relative",
                  ticket.assignee?.isAI && "bg-primary/[0.01]"
                )}
              >
                <AIPowerEffect isActive={ticket.assignee?.isAI} />
                <TableCell className="py-4 relative z-10">
                  <span className="text-[12px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all tabular-nums shadow-sm">
                    {ticket.id}
                  </span>
                </TableCell>
                <TableCell className="relative z-10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight">
                      {ticket.title}
                    </span>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-white/20">
                      {ticket.type === "BUG" && <Bug className="h-2.5 w-2.5 text-red-500/50" />}
                      {ticket.type === "SUGGESTION" && <Lightbulb className="h-2.5 w-2.5 text-amber-500/50" />}
                      <span>{ticket.category.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-2.5 w-2.5" />
                        {ticket._count?.comments || 0}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="relative z-10">
                  <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest border-0 h-5 px-2 shadow-sm", priorityColors[ticket.priority])}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell className="relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors shadow-inner">
                      {currentUser?.activeRole === "USER" && ticket.assignee?.isAI ? (
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <UserIcon className="h-3.5 w-3.5 text-white/30 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                      {currentUser?.activeRole === "USER" 
                        ? (ticket.assignee?.name || "Sem Atendente") 
                        : ticket.requester.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="relative z-10">
                  <Badge className={cn("border-0 text-[10px] font-black uppercase tracking-widest h-6 px-3 shadow-md", statusConfig[ticket.status].color)}>
                    {statusConfig[ticket.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="relative z-10">
                  <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
                    {(currentUser?.role === "ADMIN" || currentUser?.role === "AGENT") && (
                      <RobotAssignment 
                        ticketId={ticket.id} 
                        currentAssigneeId={ticket.assigneeId} 
                        onAssigned={onUpdate}
                        variant="ghost"
                        size="icon"
                      />
                    )}
                    {ticket.assignee?.isAI && (
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="relative z-10">
                  <div className="w-[160px]">
                    <SLAProgress 
                      createdAt={ticket.createdAt} 
                      dueAt={ticket.resolutionTimeDue} 
                      plannedDueDate={ticket.plannedDueDate}
                      label=""
                      compact
                    />
                  </div>
                </TableCell>
                <TableCell className="relative z-10">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-all">
                    <ChevronRight className="h-4 w-4 text-white/5 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center gap-2 opacity-20">
                  <Bug className="h-8 w-8" />
                  <p className="text-xs font-black uppercase tracking-widest italic">Nenhum chamado disponível</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

