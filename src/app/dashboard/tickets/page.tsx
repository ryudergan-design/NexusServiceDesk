"use client"

import { useState, useEffect, Suspense, useDeferredValue, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanView } from "@/components/dashboard/kanban-view"
import { DeskView } from "@/components/dashboard/desk-view"
import { ViewToggle, ViewMode } from "@/components/dashboard/view-toggle"
import { TicketQuickView } from "@/components/dashboard/ticket-quick-view"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { isClosedTicketStatus } from "@/lib/ticket-status"

function TicketsPageContent() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const searchParams = useSearchParams()
  const view = searchParams ? searchParams.get("view") : null
  const agentId = searchParams ? searchParams.get("agentId") : null
  const searchFromUrl = searchParams ? searchParams.get("search") : null
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
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
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchFromUrl])

  useEffect(() => {
    if (agentId) {
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
    } else {
      setSelectedAgent(null)
    }
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
  }, [tickets, deferredSearchTerm, currentUser, agentId, view])

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
    <div
      className={cn(
        "space-y-8 h-full flex flex-col transition-all duration-500",
        viewMode === "kanban" ? "max-w-none" : "max-w-7xl mx-auto w-full px-4"
      )}
    >
      <TicketQuickView
        ticketId={selectedTicketId}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        onUpdate={fetchTickets}
      />

      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
          viewMode === "kanban" && "px-2"
        )}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{getPageTitle()}</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe o ciclo de vida dos atendimentos.</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle mode={viewMode} onChange={handleViewChange} />
          <Link href="/dashboard/tickets/new">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" /> Novo Chamado
            </Button>
          </Link>
        </div>
      </div>

      <div className={cn("flex items-center gap-4", viewMode === "kanban" && "px-2")}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar por ID ou título..."
            className="pl-10 bg-white/5 border-white/10 w-full max-w-sm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-white/10 bg-white/5"
          aria-label="Filtros avançados"
          onClick={() => toast.info("Filtros avançados em desenvolvimento.")}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-white/20 animate-pulse">Carregando chamados...</div>
      ) : (
        <div className="flex-1 min-h-0">
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
                <KanbanView
                  tickets={filteredTickets}
                  currentUser={currentUser}
                  onSelectTicket={handleSelectTicket}
                  onUpdate={fetchTickets}
                />
              ) : (
                <DeskView
                  tickets={filteredTickets}
                  currentUser={currentUser}
                  onSelectTicket={handleSelectTicket}
                  onUpdate={fetchTickets}
                />
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
        <div className="flex-1 flex items-center justify-center text-white/20 animate-pulse">
          Carregando Central de Chamados...
        </div>
      }
    >
      <TicketsPageContent />
    </Suspense>
  )
}
