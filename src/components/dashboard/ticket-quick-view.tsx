"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TicketDetailView } from "./ticket-detail-view"
import { X } from "lucide-react"

interface TicketQuickViewProps {
  ticketId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

export function TicketQuickView({ ticketId, open, onOpenChange, onUpdate }: TicketQuickViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-slate-950/95 backdrop-blur-2xl border-white/10 p-0 text-white overflow-hidden shadow-2xl rounded-3xl flex flex-col">
        <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between space-y-0 shrink-0">
          <DialogTitle className="text-white flex items-center gap-3 text-xl font-black">
            <div className="h-10 px-3 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-white/10">
              <span className="text-sm tracking-tighter">{ticketId}</span>
            </div>
            Detalhes do Chamado
          </DialogTitle>
        </DialogHeader>
        
        {ticketId && (
          <div className="flex-1 min-h-0">
            <TicketDetailView 
              ticketId={ticketId} 
              onClose={() => onOpenChange(false)}
              onUpdate={onUpdate}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
