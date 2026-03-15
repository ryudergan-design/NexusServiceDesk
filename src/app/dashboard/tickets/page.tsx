"use client"

import { Suspense, useDeferredValue, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { DeskView } from "@/components/dashboard/desk-view"
import { KanbanView } from "@/components/dashboard/kanban-view"
import { TicketQuickView } from "@/components/dashboard/ticket-quick-view"
import { ViewMode, ViewToggle } from "@/components/dashboard/view-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { isClosedTicketStatus } from "@/lib/ticket-status"

function TicketsPageContent() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)

  const searchParams = useSearchParams()
  const view = searchParams ? searchParams.get("view") : null
  const agentId = searchParams ? searchParams.get("agentId") : null
  const searchFromUrl = searchParams ? searchParams.get("search") : null
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams()
      if (view) params.append("view", view)
      if (agentId) params.append("agentId", agentId)

      const res = await fetch(`/api/tickets?${params.toString()}`)
      if (!res.ok) throw new Error("Falha ao carregar chamados")
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch {
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchFromUrl) setSearchTerm(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    if (!agentId) {
      setSelectedAgent(null)
      return
    }

    fetch("/api/users/staff")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar atendentes")
        return res.json()
      })
      .then((data) => {
        const agent = data.find((item: any) => item.id === agentId)
        setSelectedAgent(agent)
      })
      .catch(() => setSelectedAgent(null))
  }, [agentId])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("i9-tickets-view-mode") as ViewMode
      if (savedMode) setViewMode(savedMode)
    }

    fetchTickets()
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCurrentUser(data?.user))
      .catch(() => setCurrentUser(null))
  }, [view, agentId])

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem("i9-tickets-view-mode", mode)
    window.dispatchEvent(new Event("storage"))
  }

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id)
    setIsQuickViewOpen(true)
  }

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        ticket.id.toString().includes(deferredSearchTerm)

      if (!matchesSearch) return false
      if (!currentUser) return true

      const activeRole = currentUser.activeRole || "USER"
      if (activeRole === "USER" && ticket.requesterId !== currentUser.id) return false
      if (agentId && ticket.assigneeId !== agentId) return false
      if (activeRole !== "USER" && viewMode === "kanban" && !view && !agentId) {
        const isOwnTicket = ticket.assigneeId === currentUser.id
        const isUnassignedNewTicket = !ticket.assigneeId && ticket.status === "NEW"

        if (!isOwnTicket && !isUnassignedNewTicket) return false
      }

      switch (view) {
        case "assigned":
          return ticket.assigneeId === currentUser.id
        case "pending_user":
          return ticket.status === "PENDING_USER"
        case "awaiting_approval":
          return ticket.status === "AWAITING_APPROVAL"
        case "my_open":
          return ticket.requesterId === currentUser.id && !isClosedTicketStatus(ticket.status)
        case "my_closed":
          return ticket.requesterId === currentUser.id && isClosedTicketStatus(ticket.status)
        case "my_approval":
          return ticket.requesterId === currentUser.id && ticket.status === "AWAITING_APPROVAL"
        case "my_pending":
          return ticket.requesterId === currentUser.id && ticket.status === "PENDING_USER"
        default:
          return true
      }
    })
  }, [agentId, currentUser, deferredSearchTerm, tickets, view, viewMode])

  const getPageTitle = () => {
    if (agentId) return `Fila de: ${selectedAgent?.name || "Carregando..."}`

    switch (view) {
      case "assigned":
        return "Meus Atendimentos"
      case "pending_user":
        return "Aguardando Cliente"
      case "awaiting_approval":
        return "Aguardando Aprovação"
      case "my_open":
        return "Minhas Solicitações Abertas"
      case "my_closed":
        return "Minhas Solicitações Encerradas"
      case "my_approval":
        return "Aguardando Minha Aprovação"
      case "my_pending":
        return "Aguardando Minha Resposta"
      default:
        return "Central de Chamados"
    }
  }

  return (
    <div className={cn("flex h-full flex-col space-y-6 transition-all duration-500 sm:space-y-8", viewMode === "kanban" ? "max-w-none" : "mx-auto w-full max-w-7xl")}>
      <TicketQuickView
        ticketId={selectedTicketId}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        onUpdate={fetchTickets}
      />

      <div className={cn("rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-5", viewMode === "kanban" && "lg:mx-2")}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">Central operacional</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{getPageTitle()}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Gerencie e acompanhe o ciclo de vida dos atendimentos com leitura confortável no mobile.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <ViewToggle mode={viewMode} onChange={handleViewChange} />
            <Link href="/dashboard/tickets/new" className="w-full sm:w-auto">
              <Button className="h-11 w-full rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-primary/90 sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Novo Chamado
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className={cn("grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]", viewMode === "kanban" && "lg:mx-2")}>
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar por ID ou título..."
            className="h-11 w-full rounded-2xl border-white/10 bg-white/5 pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-2xl border-white/10 bg-white/5 px-4 text-[11px] font-black uppercase tracking-[0.18em]"
          aria-label="Filtros avançados"
          onClick={() => toast.info("Filtros avançados em desenvolvimento.")}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-white/20 animate-pulse">Carregando chamados...</div>
      ) : (
        <div className="min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {viewMode === "kanban" ? (
                <KanbanView tickets={filteredTickets} currentUser={currentUser} onSelectTicket={handleSelectTicket} onUpdate={fetchTickets} />
              ) : (
                <DeskView tickets={filteredTickets} currentUser={currentUser} onSelectTicket={handleSelectTicket} onUpdate={fetchTickets} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-white/20 animate-pulse">
          Carregando Central de Chamados...
        </div>
      }
    >
      <TicketsPageContent />
    </Suspense>
  )
}
