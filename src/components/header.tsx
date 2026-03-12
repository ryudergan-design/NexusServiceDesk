"use client"

import { Bell, Search, User } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { useSession } from "next-auth/react"
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
import { cn } from "@/lib/utils"

export function Header() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.filter((n: any) => !n.read).length)
    } catch (e) {}
  }

  useEffect(() => {
    if (session) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // Polling a cada 30s
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-full p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-white/10 text-white p-0 overflow-hidden">
            <DropdownMenuLabel className="p-4 border-b border-white/10 flex items-center justify-between">
              Notificações
              {unreadCount > 0 && <span className="text-[10px] bg-primary px-2 py-0.5 rounded-full">{unreadCount} novas</span>}
            </DropdownMenuLabel>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n.id} 
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "p-4 border-b border-white/5 cursor-pointer flex flex-col items-start gap-1 hover:bg-white/5 transition-colors",
                      !n.read && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-bold">{n.title}</span>
                      <span className="text-[9px] text-white/20">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-snug">{n.message}</p>
                    {n.link && (
                      <Link href={n.link} className="text-[10px] text-primary mt-1 hover:underline">
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
                className="w-full py-3 text-[10px] uppercase font-bold text-white/40 hover:text-white transition-colors bg-white/5"
              >
                Marcar todas como lidas
              </button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link href="/dashboard/profile" className="flex items-center gap-3 border-l border-white/10 pl-4 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{user?.department || "Service Desk"}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-xs font-bold text-white uppercase">
              {user?.name?.substring(0, 2) || "U"}
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}
