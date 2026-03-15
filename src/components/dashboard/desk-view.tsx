"use client"

import React, { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { SLAProgress } from "@/components/dashboard/sla-progress"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Bot,
  Bug,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  User as UserIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RobotAssignment } from "@/components/dashboard/robot-assignment"
import { useVirtualList } from "@/hooks/use-virtual-list"

interface DeskViewProps {
  tickets: any[]
  currentUser: any
  onSelectTicket?: (ticketId: string) => void
  onUpdate?: () => void
  renderRowActions?: (ticket: any) => React.ReactNode
  emptyMessage?: string
}

const DESK_ROW_HEIGHT = 104

const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "Novo", color: "bg-blue-600/10 text-blue-400 border-blue-600/20" },
  TRIAGE: { label: "Em Triagem", color: "bg-amber-600/10 text-amber-400 border-amber-600/20" },
  DEVELOPMENT: { label: "Em Desenvolvimento", color: "bg-indigo-600/10 text-indigo-400 border-indigo-600/20" },
  TEST: { label: "Em Teste", color: "bg-pink-600/10 text-pink-400 border-pink-600/20" },
  TESTING: { label: "Em Testes", color: "bg-pink-600/10 text-pink-400 border-pink-600/20" },
  BUDGET_APPROVAL: { label: "Orçamento / Aprovação", color: "bg-purple-600/10 text-purple-400 border-purple-600/20" },
  AWAITING_APPROVAL: { label: "Aguardando Aprovação", color: "bg-purple-600/10 text-purple-400 border-purple-600/20" },
  PENDING_USER: { label: "Aguardando Cliente", color: "bg-orange-600/10 text-orange-400 border-orange-600/20" },
  COMPLETED: { label: "Concluído", color: "bg-emerald-600/10 text-emerald-400 border-emerald-600/20" },
  RESOLVED: { label: "Concluído", color: "bg-emerald-600/10 text-emerald-400 border-emerald-600/20" },
}

const fallbackStatus = {
  label: "Status Desconhecido",
  color: "bg-slate-600/10 text-slate-300 border-slate-600/20",
}

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
  URGENT: "bg-red-500/10 text-red-400 border-red-500/20",
}

const fallbackPriority = "bg-slate-500/10 text-slate-400 border-slate-500/20"

type SortConfig = {
  key: string
  direction: "asc" | "desc"
}

function getGridTemplate(hasCustomActions: boolean) {
  return hasCustomActions
    ? "100px minmax(260px,1.8fr) 140px 180px 180px 80px 220px 120px 50px"
    : "100px minmax(260px,1.8fr) 140px 180px 180px 80px 220px 50px"
}

function SortIcon({
  columnKey,
  sortConfig,
}: {
  columnKey: string
  sortConfig: SortConfig
}) {
  if (sortConfig.key !== columnKey) return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-30" />
  return sortConfig.direction === "asc" ? (
    <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
  )
}

export function DeskView({
  tickets,
  currentUser,
  onSelectTicket,
  onUpdate,
  renderRowActions,
  emptyMessage = "Nenhum chamado disponível",
}: DeskViewProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "createdAt", direction: "desc" })

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedTickets = useMemo(() => {
    const items = [...tickets]
    items.sort((a, b) => {
      let aValue: any = a[sortConfig.key]
      let bValue: any = b[sortConfig.key]

      if (sortConfig.key === "category") {
        aValue = a.category?.name || ""
        bValue = b.category?.name || ""
      }
      if (sortConfig.key === "requester") {
        aValue = a.requester?.name || ""
        bValue = b.requester?.name || ""
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
    return items
  }, [tickets, sortConfig])

  const hasCustomActions = Boolean(renderRowActions)
  const isClientView = currentUser?.activeRole === "USER"
  const gridTemplateColumns = getGridTemplate(hasCustomActions)

  const { containerRef, paddingTop, paddingBottom, startIndex, endIndex } = useVirtualList({
    itemCount: sortedTickets.length,
    itemHeight: DESK_ROW_HEIGHT,
    overscan: 6,
    enabled: sortedTickets.length > 18,
  })

  const visibleTickets = sortedTickets.slice(startIndex, endIndex)

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 overflow-hidden shadow-2xl backdrop-blur-xl h-full flex flex-col">
      <div ref={containerRef} className="flex-1 overflow-auto custom-scrollbar min-h-[420px]">
        <div className="min-w-[1360px]">
      <div
        className="sticky top-0 z-10 grid border-b border-white/5 bg-slate-950/95 px-4 py-3 backdrop-blur-xl"
        style={{ gridTemplateColumns }}
      >
        <button type="button" className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors text-left" onClick={() => handleSort("id")}>
          ID <SortIcon columnKey="id" sortConfig={sortConfig} />
        </button>
        <button type="button" className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors text-left" onClick={() => handleSort("title")}>
          Assunto <SortIcon columnKey="title" sortConfig={sortConfig} />
        </button>
        <button type="button" className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors text-left" onClick={() => handleSort("priority")}>
          Prioridade <SortIcon columnKey="priority" sortConfig={sortConfig} />
        </button>
        <button type="button" className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors text-left" onClick={() => handleSort("requester")}>
          {currentUser?.activeRole === "USER" ? "Atendente" : "Cliente"} <SortIcon columnKey="requester" sortConfig={sortConfig} />
        </button>
        <button type="button" className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors text-left" onClick={() => handleSort("status")}>
          Status <SortIcon columnKey="status" sortConfig={sortConfig} />
        </button>
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">IA</div>
        <button type="button" className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors text-left" onClick={() => handleSort("resolutionTimeDue")}>
          SLA <SortIcon columnKey="resolutionTimeDue" sortConfig={sortConfig} />
        </button>
        {hasCustomActions && <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">Ação</div>}
        <div />
      </div>

      {sortedTickets.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 opacity-20">
            <Bug className="h-8 w-8" />
            <p className="text-xs font-black uppercase tracking-widest italic">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ paddingTop, paddingBottom }}>
            {visibleTickets.map((ticket) => {
              const statusPresentation = statusConfig[ticket.status] || fallbackStatus
              const priorityColor = priorityColors[ticket.priority] || fallbackPriority

              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket?.(ticket.id.toString())}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onSelectTicket?.(ticket.id.toString())
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "grid w-full items-center border-b border-white/5 px-4 py-3 text-left transition-all hover:bg-white/[0.03]",
                    ticket.assignee?.isAI && "bg-primary/[0.01]"
                  )}
                  style={{
                    gridTemplateColumns,
                    minHeight: `${DESK_ROW_HEIGHT}px`,
                  }}
                >
                  <div>
                    <span className="text-[12px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/20 transition-all tabular-nums shadow-sm">
                      {ticket.id}
                    </span>
                  </div>

                  <div className="min-w-0 pr-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white leading-tight line-clamp-2">
                        {ticket.title}
                      </span>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-white/20">
                        {ticket.type === "BUG" && <Bug className="h-2.5 w-2.5 text-red-500/50" />}
                        {ticket.type === "SUGGESTION" && <Lightbulb className="h-2.5 w-2.5 text-amber-500/50" />}
                        <span>{ticket.category?.name || "Sem categoria"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-2.5 w-2.5" />
                          {ticket._count?.comments || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest border-0 h-5 px-2 shadow-sm", priorityColor)}>
                      {ticket.priority}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                        {currentUser?.activeRole === "USER" && ticket.assignee?.isAI ? (
                          <Bot className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <UserIcon className="h-3.5 w-3.5 text-white/30" />
                        )}
                      </div>
                      {isClientView ? (
                        ticket.assignee?.name ? (
                          <span className="text-xs font-bold text-white/60 truncate">
                            {ticket.assignee.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-lg border border-dashed border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white/35">
                            Fila Geral
                          </span>
                        )
                      ) : (
                        <span className="text-xs font-bold text-white/60 truncate">
                          {ticket.requester?.name || "Sem Cliente"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Badge className={cn("border-0 text-[10px] font-black uppercase tracking-widest h-6 px-3 shadow-md", statusPresentation.color)}>
                      {statusPresentation.label}
                    </Badge>
                  </div>

                  <div onClick={(event) => event.stopPropagation()} className="flex items-center gap-2">
                    {(currentUser?.role === "ADMIN" || currentUser?.role === "AGENT") && (
                      <RobotAssignment
                        ticketId={ticket.id}
                        currentAssigneeId={ticket.assigneeId}
                        onAssigned={onUpdate}
                        variant="ghost"
                        size="icon"
                      />
                    )}
                    {ticket.assignee?.isAI && <Bot className="h-4 w-4 text-primary animate-pulse" />}
                  </div>

                  <div className="pr-4">
                    <SLAProgress
                      createdAt={ticket.createdAt}
                      dueAt={ticket.resolutionTimeDue}
                      plannedDueDate={ticket.plannedDueDate}
                      label=""
                      compact
                    />
                  </div>

                  {hasCustomActions && (
                    <div onClick={(event) => event.stopPropagation()} className="flex items-center">
                      {renderRowActions?.(ticket)}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center transition-all">
                      <ChevronRight className="h-4 w-4 text-white/10 transition-all" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
