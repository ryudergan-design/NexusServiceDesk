"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet"
import { SidebarContent } from "@/components/sidebar-content"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 text-white/60 hover:text-white transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-black border-r border-white/10 w-64">
        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
        <React.Suspense fallback={
          <div className="p-4 space-y-4">
            <div className="h-8 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-full bg-white/5 rounded animate-pulse" />
          </div>
        }>
          <SidebarContent onItemClick={() => setOpen(false)} />
        </React.Suspense>
      </SheetContent>
    </Sheet>
  )
}
