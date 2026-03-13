"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TicketDetailView } from "@/components/dashboard/ticket-detail-view"

export default function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id
  const router = useRouter()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 px-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/60 shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Visualização Completa</h1>
      </div>
      
      <div className="bg-black/20 rounded-2xl border border-white/10 overflow-hidden h-[calc(100vh-180px)]">
        <TicketDetailView 
          ticketId={id} 
          onClose={() => router.back()} 
        />
      </div>
    </div>
  )
}
