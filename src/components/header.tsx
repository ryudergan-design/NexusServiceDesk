"use client"

import { Bell, Search, User, LogOut, UserCircle, ShieldCheck } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
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

  const activeRole = user?.activeRole || "USER"
  const baseRole = user?.role || "USER"
  const isDualRole = baseRole === "ADMIN" || baseRole === "AGENT"

  const handleSwitchRole = async () => {
    const targetRole = activeRole === "USER" ? baseRole : "USER"
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole })
      })

      if (res.ok) {
        await update({ activeRole: targetRole })
        toast.success(`Modo ${targetRole === "USER" ? "Cliente" : "Atendente"} ativado!`)
        router.push("/dashboard")
        setTimeout(() => window.location.reload(), 100)
      }
    } catch (error) {
      toast.error("Erro ao alternar modo.")
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" })
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
      setUnreadCount(Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0)
    } catch (e) {}
  }

  useEffect(() => {
    if (session) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    fetchNotifications()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/20 px-4 md:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <input
            placeholder="Pesquisar chamados..."
            className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-full p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-950 border-white/10 text-white p-0 overflow-hidden shadow-2xl">
            <DropdownMenuLabel className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              Notificações
              {unreadCount > 0 && <span className="text-[10px] bg-primary px-2 py-0.5 rounded-full font-black uppercase">{unreadCount} novas</span>}
            </DropdownMenuLabel>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n.id} 
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "p-4 border-b border-white/5 cursor-pointer flex flex-col items-start gap-1 hover:bg-white/5 transition-colors focus:bg-white/5 outline-none",
                      !n.read && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-bold">{n.title}</span>
                      <span className="text-[9px] text-white/20">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-snug">{n.message}</p>
                    {n.link && (
                      <Link href={n.link} className="text-[10px] text-primary mt-1 hover:underline font-bold">
                        Ver detalhes
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-8 text-center text-white/20 text-xs italic">
                  Nenhuma notificação por aqui.
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <button 
                onClick={() => markAsRead("all")}
                className="w-full py-3 text-[10px] uppercase font-black text-white/40 hover:text-white transition-colors bg-white/5"
              >
                Marcar todas como lidas
              </button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 border-l border-white/10 pl-6 hover:opacity-80 transition-all outline-none group active:scale-95">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white group-hover:text-primary transition-colors leading-none mb-1 uppercase tracking-tight">{user?.name || "Usuário"}</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", activeRole === "USER" ? "bg-blue-500" : "bg-emerald-500")} />
                  <p className="text-[9px] text-white/40 uppercase font-black tracking-[0.15em]">{activeRole === "USER" ? "Cliente" : "Atendente"}</p>
                </div>
                </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary via-primary/40 to-accent p-[1.5px] border border-white/5 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-slate-950 text-sm font-black text-white uppercase tracking-tighter">
                  {user?.name?.substring(0, 2) || "U"}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-slate-950/95 backdrop-blur-2xl border-white/10 text-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl">
            <div className="p-4 mb-3 bg-gradient-to-br from-white/[0.05] to-transparent rounded-xl border border-white/5 relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/card:opacity-20 transition-opacity">
                <UserCircle className="h-12 w-12 text-white" />
              </div>
              <p className="text-xs font-black text-white uppercase truncate relative z-10">{user?.name}</p>
              <p className="text-[10px] text-white/40 truncate relative z-10 mb-3">{user?.email}</p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Departamento</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[9px] font-black h-5 uppercase">{user?.department || "Geral"}</Badge>
              </div>
            </div>

            <div className="space-y-1">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 focus:bg-white/5 transition-all text-xs font-bold text-white/70 hover:text-white outline-none group/item">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/item:border-blue-500/50">
                    <UserCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  Configurações de Perfil
                </Link>
              </DropdownMenuItem>

              {isDualRole && (
                <DropdownMenuItem 
                  onClick={handleSwitchRole}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 focus:bg-white/5 transition-all text-xs font-bold text-white/70 hover:text-white outline-none group/item"
                >
                  <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:item:border-blue-500/50">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                  </div>
                  Alternar para {activeRole === "USER" ? "Atendente" : "Cliente"}
                  </DropdownMenuItem>
                  )}
            </div>

            <DropdownMenuSeparator className="bg-white/5 my-3" />
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive focus:bg-destructive/10 transition-all text-xs font-black uppercase tracking-tighter outline-none group/item"
            >
              <div className="h-7 w-7 rounded-lg bg-destructive/10 flex items-center justify-center border border-destructive/20 group-hover/item:border-destructive/50">
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
