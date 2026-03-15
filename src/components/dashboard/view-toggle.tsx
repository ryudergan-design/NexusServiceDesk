"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ViewMode = "kanban" | "desk"

interface ViewToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex w-full items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:w-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("kanban")}
        className={cn(
          "h-9 flex-1 px-3 text-[11px] gap-2 font-black uppercase tracking-[0.16em] transition-all sm:flex-none",
          mode === "kanban" 
            ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-primary/90" 
            : "text-white/40 hover:text-white hover:bg-white/5"
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Kanban
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("desk")}
        className={cn(
          "h-9 flex-1 px-3 text-[11px] gap-2 font-black uppercase tracking-[0.16em] transition-all sm:flex-none",
          mode === "desk" 
            ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-primary/90" 
            : "text-white/40 hover:text-white hover:bg-white/5"
        )}
      >
        <List className="h-3.5 w-3.5" />
        Desk
      </Button>
    </div>
  )
}
