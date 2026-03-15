"use client"

import { Bell, Search, LogOut, UserCircle, ShieldCheck } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Header() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const hasLoggedNotificationError = useRef(false)

  const activeRole = user?.activeRole || "USER"
  const baseRole = user?.role || "USER"
  const isDualRole = baseRole === "ADMIN" || baseRole === "AGENT"

  const handleSwitchRole = async () => {
    const targetRole = activeRole === "USER" ? baseRole : "USER"
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole }),
      })

      if (!res.ok) throw new Error("Falha ao alternar perfil")

      await update({ activeRole: targetRole })
      toast.success(`Modo ${targetRole === "USER" ? "Cliente" : "Atendente"} ativado!`)
      router.push("/dashboard")
      setTimeout(() => window.location.reload(), 100)
    } catch {
      toast.error("Erro ao alternar modo.")
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" })
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" })

      if (res.status === 401) {
        setNotifications([])
        setUnreadCount(0)
        return
      }

      if (!res.ok) throw new Error(`Falha ao buscar notificações (${res.status})`)

      const data = await res.json()
      const safeNotifications = Array.isArray(data) ? data : []
      setNotifications(safeNotifications)
      setUnreadCount(safeNotifications.filter((notification: any) => !notification.read).length)
      hasLoggedNotificationError.current = false
    } catch (error) {
      setNotifications([])
      setUnreadCount(0)

      if (!hasLoggedNotificationError.current) {
        console.warn("Falha ao buscar notificações:", error)
        hasLoggedNotificationError.current = true
      }
    }
  }

  useEffect(() => {
    if (!session) return

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [session])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error(`Falha ao marcar notificação (${res.status})`)
      fetchNotifications()
    } catch {
      toast.error("Não foi possível atualizar as notificações.")
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/20 px-4 md:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <input
            placeholder="Pesquisar chamados..."
            aria-label="Pesquisar chamados por ID ou título"
            className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const term = (e.target as HTMLInputElement).value
                if (term) {
                  router.push(`/dashboard/tickets?search=${encodeURIComponent(term)}`)
                }
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Ver notificações"
              className="relative rounded-full p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 overflow-hidden border-white/10 bg-slate-950 p-0 text-white shadow-2xl">
            <DropdownMenuLabel className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
              Notificações
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase">
                  {unreadCount} novas
                </span>
              )}
            </DropdownMenuLabel>
            <div className="custom-scrollbar max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex cursor-pointer flex-col items-start gap-1 border-b border-white/5 p-4 outline-none transition-colors hover:bg-white/5 focus:bg-white/5",
                      !notification.read && "border-l-2 border-l-primary bg-primary/5"
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-xs font-bold">{notification.title}</span>
                      <span className="text-[9px] text-white/20">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs leading-snug text-white/60">{notification.message}</p>
                    {notification.link && (
                      <Link href={notification.link} className="mt-1 text-[10px] font-bold text-primary hover:underline">
                        Ver detalhes
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-8 text-center text-xs italic text-white/20">
                  Nenhuma notificação por aqui.
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => markAsRead("all")}
                className="w-full bg-white/5 py-3 text-[10px] font-black uppercase text-white/40 transition-colors hover:text-white"
              >
                Marcar todas como lidas
              </button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-3 border-l border-white/10 pl-6 outline-none transition-all hover:opacity-80 active:scale-95">
              <div className="hidden text-right sm:block">
                <p className="mb-1 text-sm font-black leading-none tracking-tight text-white transition-colors group-hover:text-primary">
                  {user?.name || "Usuário"}
                </p>
                <div className="flex items-center justify-end gap-1.5">
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full animate-pulse",
                      activeRole === "USER" ? "bg-blue-500" : "bg-emerald-500"
                    )}
                  />
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">
                    {activeRole === "USER" ? "Cliente" : "Atendente"}
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-xl border border-white/5 bg-gradient-to-tr from-primary via-primary/40 to-accent p-[1.5px] shadow-lg transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-slate-950 text-sm font-black uppercase tracking-tighter text-white">
                  {user?.name?.substring(0, 2) || "U"}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-2xl border-white/10 bg-slate-950/95 p-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <div className="group/card relative mb-3 overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent p-4">
              <div className="absolute right-0 top-0 p-2 opacity-10 transition-opacity group-hover/card:opacity-20">
                <UserCircle className="h-12 w-12 text-white" />
              </div>
              <p className="relative z-10 truncate text-xs font-black uppercase text-white">{user?.name}</p>
              <p className="relative z-10 mb-3 truncate text-[10px] text-white/40">{user?.email}</p>
              <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Departamento</span>
                <Badge variant="secondary" className="h-5 border-0 bg-primary/10 text-[9px] font-black uppercase text-primary">
                  {user?.department || "Geral"}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/profile"
                  className="group/item flex cursor-pointer items-center gap-3 rounded-lg p-3 text-xs font-bold text-white/70 outline-none transition-all hover:bg-white/5 hover:text-white focus:bg-white/5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 group-hover/item:border-blue-500/50">
                    <UserCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  Configurações de Perfil
                </Link>
              </DropdownMenuItem>

              {isDualRole && (
                <DropdownMenuItem
                  onClick={handleSwitchRole}
                  className="group/item flex cursor-pointer items-center gap-3 rounded-lg p-3 text-xs font-bold text-white/70 outline-none transition-all hover:bg-white/5 hover:text-white focus:bg-white/5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 group-hover/item:border-blue-500/50">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                  </div>
                  Alternar para {activeRole === "USER" ? "Atendente" : "Cliente"}
                </DropdownMenuItem>
              )}
            </div>

            <DropdownMenuSeparator className="my-3 bg-white/5" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="group/item flex cursor-pointer items-center gap-3 rounded-lg p-3 text-xs font-black uppercase tracking-tighter text-destructive outline-none transition-all hover:bg-destructive/10 focus:bg-destructive/10"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 group-hover/item:border-destructive/50">
                <LogOut className="h-4 w-4" />
              </div>
              Encerrar Sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
