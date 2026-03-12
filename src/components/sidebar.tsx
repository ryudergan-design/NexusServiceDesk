"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Ticket, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Users,
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Ticket, label: "Meus Chamados", href: "/tickets" },
  { icon: BookOpen, label: "Base de Conhecimento", href: "/knowledge" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
  { icon: Users, label: "Equipe", href: "/team" },
  { icon: Settings, label: "Configurações", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">I9 Chamados</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"
              )} />
              {item.label}
              
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 h-5 w-1 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}
