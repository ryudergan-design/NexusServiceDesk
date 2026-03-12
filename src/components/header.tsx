"use client"

import { Bell, Search, User } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export function Header() {
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
        <button className="relative rounded-full p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Administrador</p>
            <p className="text-xs text-muted-foreground">TI / Gestão</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
