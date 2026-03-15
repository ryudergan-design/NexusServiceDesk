"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, Reorder, motion } from "framer-motion"
import {
  Bot,
  Bug,
  ChevronRight,
  Clock,
  Inbox,
  Lightbulb,
  MessageSquare,
  User as UserIcon,
  GripHorizontal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SLAProgress } from "@/components/dashboard/sla-progress"
import { cn } from "@/lib/utils"
import { RobotAssignment } from "@/components/dashboard/robot-assignment"
import { AIPowerEffect } from "@/components/ui/ai-power-effect"
import { useVirtualList } from "@/hooks/use-virtual-list"

interface KanbanViewProps {
  tickets: any[]
  currentUser: any
  onSelectTicket?: (ticketId: string) => void
  onUpdate?: () => void
}

const KANBAN_CARD_HEIGHT = 266

const DEFAULT_COLUMNS = [
  { id: "NEW", label: "Novo", color: "border-t-blue-600 bg-blue-600/5", textColor: "text-blue-400" },
  { id: "TRIAGE", label: "Em Triagem", color: "border-t-amber-600 bg-amber-600/5", textColor: "text-amber-400" },
  { id: "DEVELOPMENT", label: "Em Desenvolvimento", color: "border-t-indigo-600 bg-indigo-600/5", textColor: "text-indigo-400" },
  { id: "TEST", label: "Em Teste", color: "border-t-pink-600 bg-pink-600/5", textColor: "text-pink-400" },
  { id: "AWAITING_APPROVAL", label: "Aguardando Aprovação", color: "border-t-purple-600 bg-purple-600/5", textColor: "text-purple-400" },
  { id: "PENDING_USER", label: "Aguardando Cliente", color: "border-t-orange-600 bg-orange-600/5", textColor: "text-orange-400" },
  { id: "COMPLETED", label: "Concluído", color: "border-t-emerald-600 bg-emerald-600/5", textColor: "text-emerald-400" },
]

const statusAliases: Record<string, string> = {
  TESTING: "TEST",
  BUDGET_APPROVAL: "AWAITING_APPROVAL",
  RESOLVED: "COMPLETED",
}

const priorityStyles: Record<string, string> = {
  LOW: "border-l-slate-500",
  MEDIUM: "border-l-blue-500",
  HIGH: "border-l-orange-500",
  CRITICAL: "border-l-red-600 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
  URGENT: "border-l-red-600 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
}

const priorityBadgeColors: Record<string, string> = {
  LOW: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
  URGENT: "bg-red-500/10 text-red-400 border-red-500/20",
}

function normalizeStatus(status: string) {
  return statusAliases[status] || status
}

function KanbanColumn({
  column,
  tickets,
  currentUser,
  onSelectTicket,
  onUpdate,
}: {
  column: { id: string; label: string; color: string; textColor: string }
  tickets: any[]
  currentUser: any
  onSelectTicket?: (ticketId: string) => void
  onUpdate?: () => void
}) {
  const { containerRef, paddingTop, paddingBottom, startIndex, endIndex } = useVirtualList({
    itemCount: tickets.length,
    itemHeight: KANBAN_CARD_HEIGHT,
    overscan: 3,
    enabled: tickets.length > 10,
  })

  const visibleTickets = tickets.slice(startIndex, endIndex)

  return (
    <Reorder.Item key={column.id} value={column} className="w-[320px] flex flex-col gap-4">
      <div className={cn("flex items-center justify-between px-4 py-3 rounded-xl border-t-4 border-x border-b border-white/10 bg-slate-900/50 transition-all", column.color)}>
        <div className="flex items-center gap-3">
          <GripHorizontal className="h-4 w-4 text-white/20 cursor-grab active:cursor-grabbing hover:text-white/40 transition-colors" />
          <span className={cn("text-xs font-black uppercase tracking-widest", column.textColor)}>
            {column.label}
          </span>
        </div>
        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 font-bold px-2">
          {tickets.length}
        </Badge>
      </div>

      <div ref={containerRef} className="flex-1 p-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-280px)] min-h-[200px]">
        {tickets.length > 0 ? (
          <div style={{ paddingTop, paddingBottom }}>
            <AnimatePresence mode="popLayout">
              {visibleTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="pb-3 last:pb-0"
                  style={{ minHeight: `${KANBAN_CARD_HEIGHT - 12}px` }}
                >
                  <Card
                    className={cn(
                      "border-white/10 border-l-4 bg-slate-900/80 hover:bg-slate-800 transition-all cursor-pointer group shadow-lg overflow-hidden relative",
                      priorityStyles[ticket.priority] || priorityStyles.MEDIUM,
                      ticket.assignee?.isAI && "border-primary/30 bg-primary/[0.02]"
                    )}
                    onClick={() => onSelectTicket?.(ticket.id.toString())}
                  >
                    <AIPowerEffect isActive={ticket.assignee?.isAI} />
                    <CardContent className="p-4 space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-tighter px-1.5 h-4 border-white/5", priorityBadgeColors[ticket.priority] || priorityBadgeColors.MEDIUM)}>
                            {ticket.priority}
                          </Badge>
                          {ticket.requesterId === currentUser?.id && (ticket.status === "PENDING_USER" || ticket.status === "AWAITING_APPROVAL") && (
                            <Badge className="bg-amber-500 text-black border-0 text-[8px] font-black uppercase px-1.5 h-4 animate-pulse">
                              Ação Requerida
                            </Badge>
                          )}
                          {ticket.assignee?.isAI && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black uppercase px-1.5 h-4 flex items-center gap-1">
                              <Bot className="h-2 w-2" /> IA Ativa
                            </Badge>
                          )}
                        </div>
                        <span className="text-[12px] font-black text-white/40 group-hover:text-primary transition-colors tabular-nums bg-white/5 px-1.5 rounded border border-white/5 shadow-inner">
                          {ticket.id}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {ticket.title}
                      </h4>

                      <SLAProgress
                        createdAt={ticket.createdAt}
                        dueAt={ticket.resolutionTimeDue}
                        plannedDueDate={ticket.plannedDueDate}
                        label=""
                        compact
                      />

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            {currentUser?.activeRole === "USER" && ticket.assignee?.isAI ? (
                              <Bot className="h-3 w-3 text-primary" />
                            ) : (
                              <UserIcon className="h-3 w-3 text-white/30" />
                            )}
                          </div>
                          <span className="text-[10px] text-white/60 font-medium truncate max-w-[80px]">
                            {currentUser?.activeRole === "USER"
                              ? (ticket.assignee?.name || "Sem Atendente")
                              : (ticket.requester?.name || "Sem Cliente")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {(currentUser?.role === "ADMIN" || currentUser?.role === "AGENT") && (
                            <div onClick={(event) => event.stopPropagation()}>
                              <RobotAssignment
                                ticketId={ticket.id}
                                currentAssigneeId={ticket.assigneeId}
                                onAssigned={onUpdate}
                              />
                            </div>
                          )}
                          <div className="h-5 w-5 rounded bg-white/5 flex items-center justify-center border border-white/5">
                            {ticket.type === "BUG" ? (
                              <Bug className="h-3 w-3 text-red-500/40" />
                            ) : (
                              <Lightbulb className="h-3 w-3 text-amber-500/40" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-white/20 font-bold uppercase tracking-tighter">
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-2.5 w-2.5" />
                          {ticket._count?.comments || 0}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white/[0.02] border-white/10 text-white/20 hover:bg-white/[0.04] hover:border-white/20 transition-colors duration-500">
            <div className="p-3 rounded-full bg-white/[0.03] mb-2 transition-transform duration-500">
              <Inbox className="h-5 w-5 opacity-20" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aguardando</span>
          </div>
        )}
      </div>
    </Reorder.Item>
  )
}

export function KanbanView({ tickets, currentUser, onSelectTicket, onUpdate }: KanbanViewProps) {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)

  useEffect(() => {
    const savedOrder = localStorage.getItem("i9-kanban-column-order")
    if (!savedOrder) return

    try {
      const orderIds = JSON.parse(savedOrder)
      const reordered = orderIds
        .map((id: string) => DEFAULT_COLUMNS.find((column) => column.id === id))
        .filter(Boolean)
      const missing = DEFAULT_COLUMNS.filter((column) => !orderIds.includes(column.id))
      setColumns([...(reordered as typeof DEFAULT_COLUMNS), ...missing])
    } catch {
      setColumns(DEFAULT_COLUMNS)
    }
  }, [])

  const handleReorder = (newOrder: typeof DEFAULT_COLUMNS) => {
    setColumns(newOrder)
    localStorage.setItem("i9-kanban-column-order", JSON.stringify(newOrder.map((column) => column.id)))
  }

  const normalizedTickets = useMemo(
    () => tickets.map((ticket) => ({ ...ticket, normalizedStatus: normalizeStatus(ticket.status) })),
    [tickets]
  )

  const ticketsByColumn = useMemo(() => {
    return normalizedTickets.reduce<Record<string, any[]>>((acc, ticket) => {
      if (!acc[ticket.normalizedStatus]) acc[ticket.normalizedStatus] = []
      acc[ticket.normalizedStatus].push(ticket)
      return acc
    }, {})
  }, [normalizedTickets])

  return (
    <div className="flex-1 overflow-x-auto pb-10 custom-scrollbar">
      <Reorder.Group axis="x" values={columns} onReorder={handleReorder} className="flex gap-6 min-w-max h-full px-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tickets={ticketsByColumn[column.id] || []}
            currentUser={currentUser}
            onSelectTicket={onSelectTicket}
            onUpdate={onUpdate}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}
