"use client"

import { SidebarContent } from "@/components/sidebar-content"

export function Sidebar() {
  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <SidebarContent />
    </div>
  )
}
