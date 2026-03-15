"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Ticket, 
  LogOut,
  UserCircle,
  Users,
  Inbox,
  UserCheck,
  ChevronDown,
  History,
  ShieldCheck,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getNavCounts } from "@/lib/actions/nav"
import { toast } from "sonner"

export function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view")
  const { data: session } = useSession()
  const [counts, setCounts] = useState<any>(null)
  const [showTicketsMenu, setShowTicketsMenu] = useState(true)
  const [showStaff, setShowStaff] = useState(false)
  const [showAIs, setShowAIs] = useState(false)
  const [agents, setAgents] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<string>("kanban")

  const user = session?.user as any
  const isAdmin = user?.role === "ADMIN"
  const activeRole = user?.activeRole || "USER"
  const isStaffMode = activeRole === "ADMIN" || activeRole === "AGENT"

  useEffect(() => {
    getNavCounts()
      .then(setCounts)
      .catch(e => {
        console.error("Erro ao carregar contadores:", e)
        toast.error("Erro ao sincronizar indicadores.")
      })
    
    if (isStaffMode) {
      fetch("/api/users/staff")
        .then((res) => {
          if (!res.ok) throw new Error("Falha ao carregar atendentes")
          return res.json()
        })
        .then(data => setAgents(Array.isArray(data) ? data : []))
        .catch(e => {
          console.error("Erro ao carregar agentes:", e)
          setAgents([])
        })
    }
    
    // Sincronizar viewMode com localStorage
    const updateViewMode = () => {
      const mode = localStorage.getItem("i9-tickets-view-mode") || "kanban"
      setViewMode(mode)
    }

    updateViewMode()
    window.addEventListener("storage", updateViewMode)
    window.addEventListener("i9-view-mode-change", updateViewMode)

    return () => {
      window.removeEventListener("storage", updateViewMode)
      window.removeEventListener("i9-view-mode-change", updateViewMode)
    }
  }, [pathname, view, activeRole, isStaffMode])

  const showFilters = viewMode === "desk" && pathname.includes("/tickets")
  const humanAgents = agents.filter((a: any) => !a.isAI && a.id !== user?.id)
  const aiAgents = agents.filter((a: any) => a.isAI)

  const handleSignOut = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: "/auth/login" 
    })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus ServiceDesk</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            pathname === "/dashboard" 
              ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        {/* Chamados (Sempre Visível) */}
        <Link
          href="/dashboard/tickets"
          onClick={onItemClick}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            pathname === "/dashboard/tickets" && !view && !searchParams.get("agentId")
              ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
          )}
        >
          <Ticket className="h-5 w-5" />
          Chamados
        </Link>

        {/* Atendentes / IAs (Staff only) */}
        {isStaffMode && (
          <div className="pt-2">
            <button 
              onClick={() => setShowStaff(!showStaff)}
              aria-label={showStaff ? "Recolher menu de atendentes" : "Expandir menu de atendentes"}
              aria-expanded={showStaff}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/30 hover:text-white/50 transition-colors"
            >
              Atendentes
              <ChevronDown className={cn("h-3 w-3 transition-transform", !showStaff && "-rotate-90")} />
            </button>
            
            {showStaff && (
              <div className="mt-1 space-y-1">
                {humanAgents.map((agent: any) => (
                    <Link
                      key={agent.id}
                      href={`/dashboard/tickets?agentId=${agent.id}`}
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition-all",
                        searchParams.get("agentId") === agent.id
                          ? "bg-primary/10 text-primary" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                          <UserCircle className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate max-w-[140px]">{agent.name}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}

        {isStaffMode && (
          <div className="pt-1">
            <button 
              onClick={() => setShowAIs(!showAIs)}
              aria-label={showAIs ? "Recolher menu de IAs" : "Expandir menu de IAs"}
              aria-expanded={showAIs}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/30 hover:text-white/50 transition-colors"
            >
              IAs
              <ChevronDown className={cn("h-3 w-3 transition-transform", !showAIs && "-rotate-90")} />
            </button>

            {showAIs && (
              <div className="mt-1 space-y-1">
                {aiAgents.map((agent: any) => (
                    <Link
                      key={agent.id}
                      href={`/dashboard/tickets?agentId=${agent.id}`}
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition-all",
                        searchParams.get("agentId") === agent.id
                          ? "bg-primary/10 text-primary" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate max-w-[140px]">{agent.name}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Menu de Chamados (Equipe Técnica) - Só aparece no modo Desk */}
        {isStaffMode && showFilters && (
          <div className="pt-4 pb-2">
            <button 
              onClick={() => setShowTicketsMenu(!showTicketsMenu)}
              aria-label={showTicketsMenu ? "Recolher menu de gestão de atendimento" : "Expandir menu de gestão de atendimento"}
              aria-expanded={showTicketsMenu}
              className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-white/50 transition-colors"
            >
              Gestão de Atendimento
              <ChevronDown className={cn("h-3 w-3 transition-transform", !showTicketsMenu && "-rotate-90")} />
            </button>
            
            {showTicketsMenu && (
              <div className="mt-1 space-y-1">
                <Link
                  href="/dashboard/tickets?view=assigned"
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === "/dashboard/tickets" && view === "assigned"
                      ? "bg-primary/10 text-primary" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4" />
                    Meus Atendimentos
                  </div>
                  {counts?.assignedToMe > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                      {counts.assignedToMe}
                    </span>
                  )}
                </Link>

                <Link
                  href="/dashboard/tickets/unassigned"
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === "/dashboard/tickets/unassigned" 
                      ? "bg-amber-500/10 text-amber-500" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Inbox className="h-4 w-4" />
                    Sem Atendente
                  </div>
                  {counts?.unassigned > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                      {counts.unassigned}
                    </span>
                  )}
                </Link>

                <Link
                  href="/dashboard/tickets?view=pending_user"
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    view === "pending_user"
                      ? "bg-orange-500/10 text-orange-500" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4" />
                    Aguardando Cliente
                  </div>
                  {counts?.awaitingUser > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                      {counts.awaitingUser}
                    </span>
                  )}
                </Link>

                <Link
                  href="/dashboard/tickets?view=awaiting_approval"
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    view === "awaiting_approval"
                      ? "bg-purple-500/10 text-purple-500" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4" />
                    Orçamento / Aprovação
                  </div>
                  {counts?.awaitingApproval > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                      {counts.awaitingApproval}
                    </span>
                  )}
                </Link>

                <Link
                  href="/dashboard/tickets"
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === "/dashboard/tickets" && !view
                      ? "bg-white/10 text-white" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Ticket className="h-4 w-4" />
                  Todos os Chamados
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Menu Minhas Solicitações (Para Clientes) - Só aparece no modo Desk */}
        {!isStaffMode && showFilters && (
          <div className="pt-4 pb-2">
            <span className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
              Minhas Solicitações
            </span>
            <div className="mt-1 space-y-1">
              <Link
                href="/dashboard/tickets?view=my_open"
                onClick={onItemClick}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  view === "my_open" 
                    ? "bg-primary/10 text-primary" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Ticket className="h-4 w-4" />
                  Em Aberto
                </div>
                {counts?.myTickets > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                    {counts.myTickets}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard/tickets?view=my_approval"
                onClick={onItemClick}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  view === "my_approval" 
                    ? "bg-purple-500/10 text-purple-400" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4" />
                  Aguardando Aprovação
                </div>
                {counts?.myAwaitingApproval > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                    {counts.myAwaitingApproval}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard/tickets?view=my_closed"
                onClick={onItemClick}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  view === "my_closed" ? "bg-primary/10 text-primary" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                Histórico / Encerrados
              </Link>            </div>
          </div>
        )}

        {/* Configurações / Admin */}
        <div className="pt-4 pb-2">
          <span className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
            Sistema
          </span>
          <div className="mt-1 space-y-1">
            <Link
              href="/dashboard/profile"
              onClick={onItemClick}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                pathname === "/dashboard/profile" ? "bg-primary/10 text-primary" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <UserCircle className="h-5 w-5" />
              Meu Perfil
            </Link>

            {isStaffMode && isAdmin && (
              <Link
                href="/dashboard/admin/users"
                onClick={onItemClick}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  pathname === "/dashboard/admin/users" ? "bg-primary/10 text-primary" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Users className="h-5 w-5" />
                Gestão de Usuários
              </Link>
              )}

              <button
              onClick={() => {
                if (onItemClick) onItemClick();
                handleSignOut();
              }}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive/60 transition-all hover:bg-destructive/10 hover:text-destructive"
              >
              <LogOut className="h-5 w-5" />
              Encerrar Sessão
              </button>
              </div>
              </div>
              </nav>
              </div>
              )
              }
