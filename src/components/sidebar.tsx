"use client"

import { Suspense } from "react"
import { SidebarContent } from "@/components/sidebar-content"

export function Sidebar() {
  return (
    <div className="hidden lg:flex h-full w-64 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <Suspense fallback={
        <div className="flex-1 p-4 space-y-4">
          <div className="h-8 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-8 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-8 w-full bg-white/5 rounded animate-pulse" />
        </div>
      }>
        <SidebarContent />
      </Suspense>
    </div>
  )
}
