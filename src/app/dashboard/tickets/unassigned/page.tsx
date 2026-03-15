"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Clock, Filter, Search, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DeskView } from "@/components/dashboard/desk-view"
import { KanbanView } from "@/components/dashboard/kanban-view"
import { TicketQuickView } from "@/components/dashboard/ticket-quick-view"
import { ViewMode, ViewToggle } from "@/components/dashboard/view-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function UnassignedTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("desk")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets?unassigned=true")
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("i9-tickets-view-mode") as ViewMode
      if (savedMode) setViewMode(savedMode)
    }

    fetchTickets()
    fetch("/api/auth/session").then((res) => res.json()).then((data) => setCurrentUser(data?.user))
  }, [])

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem("i9-tickets-view-mode", mode)
    window.dispatchEvent(new Event("storage"))
  }

  const handleAssignToMe = async (ticketId: string | number) => {
    try {
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()

      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assigneeId: session.user.id,
          comment: "Chamado assumido pelo atendente via fila de triagem."
        })
      })

      if (res.ok) {
        toast.success("Chamado assumido com sucesso!")
        fetchTickets()
        router.refresh()
        return
      }

      toast.error("Nao foi possivel assumir o chamado.")
    } catch {
      toast.error("Erro ao assumir chamado.")
    }
  }

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id)
    setIsQuickViewOpen(true)
  }

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toString().includes(searchTerm)
  )

  return (
    <div className={cn(
      "space-y-8 h-full flex flex-col transition-all duration-500",
      viewMode === "kanban" ? "max-w-none" : "max-w-7xl mx-auto w-full px-4"
    )}>
      <TicketQuickView
        ticketId={selectedTicketId}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        onUpdate={fetchTickets}
      />

      <div className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        viewMode === "kanban" && "px-2"
      )}>
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
            <AlertTriangle className="h-8 w-8 text-amber-500" /> Fila de Triagem
          </h1>
          <p className="mt-2 text-muted-foreground">Chamados que ainda nao possuem um atendente atribuido.</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle mode={viewMode} onChange={handleViewChange} />
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-4",
        viewMode === "kanban" && "px-2"
      )}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar por ID ou titulo..."
            className="w-full max-w-sm border-white/10 bg-white/5 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-white/10 bg-white/5"
          aria-label="Filtros avancados"
          onClick={() => toast.info("Filtros avancados em desenvolvimento.")}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-white/20 animate-pulse">
          Carregando fila...
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          {filteredTickets.length > 0 ? (
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
                    renderRowActions={(ticket) => (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 gap-1 text-[11px]"
                        onClick={() => handleAssignToMe(ticket.id)}
                      >
                        <UserPlus className="h-3 w-3" /> Assumir
                      </Button>
                    )}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
              <Clock className="mb-2 h-8 w-8 text-white/10" />
              <p className="text-sm text-white/20">Tudo limpo! Nenhum chamado aguardando triagem.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
