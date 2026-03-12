"use client"

import { Menu } from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 text-white/60 hover:text-white transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background border-r border-white/10 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
