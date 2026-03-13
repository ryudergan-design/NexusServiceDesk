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
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("kanban")}
        className={cn(
          "h-8 px-3 text-xs gap-2 transition-all",
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
          "h-8 px-3 text-xs gap-2 transition-all",
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
