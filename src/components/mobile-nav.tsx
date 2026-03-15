"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/sidebar-content"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors hover:text-white lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-[360px] border-r border-white/10 bg-[#030712] p-0">
        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
        <React.Suspense
          fallback={
            <div className="space-y-4 p-4">
              <div className="h-8 w-full animate-pulse rounded bg-white/5" />
              <div className="h-8 w-full animate-pulse rounded bg-white/5" />
            </div>
          }
        >
          <SidebarContent onItemClick={() => setOpen(false)} />
        </React.Suspense>
      </SheetContent>
    </Sheet>
  )
}
