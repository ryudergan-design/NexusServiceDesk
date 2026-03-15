"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Clock, Filter, Search, UserPlus } from "lucide-react"
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
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data?.user))
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
          comment: "Chamado assumido pelo atendente via fila de triagem.",
        }),
      })

      if (res.ok) {
        toast.success("Chamado assumido com sucesso!")
        fetchTickets()
        router.refresh()
        return
      }

      toast.error("Não foi possível assumir o chamado.")
    } catch {
      toast.error("Erro ao assumir chamado.")
    }
  }

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id)
    setIsQuickViewOpen(true)
  }

  const filteredTickets = tickets.filter(
    (ticket) => ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.id.toString().includes(searchTerm)
  )

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
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-200">Fila de triagem</p>
            <h1 className="mt-2 flex items-center gap-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              <AlertTriangle className="h-6 w-6 text-amber-500 sm:h-8 sm:w-8" />
              Sem atendente
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Chamados aguardando o primeiro responsável, com leitura confortável no mobile e alternância entre Desk e Kanban.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <ViewToggle mode={viewMode} onChange={handleViewChange} />
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="flex flex-1 items-center justify-center text-white/20 animate-pulse">Carregando fila...</div>
      ) : (
        <div className="min-h-0 flex-1">
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
                  <KanbanView tickets={filteredTickets} currentUser={currentUser} onSelectTicket={handleSelectTicket} onUpdate={fetchTickets} />
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
                        className="h-8 gap-1 rounded-xl text-[11px] font-black uppercase tracking-[0.16em]"
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
              <p className="text-sm text-white/20">Tudo limpo. Nenhum chamado aguardando triagem.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
