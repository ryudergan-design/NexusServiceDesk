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
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4 px-4 sm:px-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/60 shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Visualização Completa</h1>
      </div>
      
      <div className="min-h-[calc(100dvh-160px)] overflow-x-auto overflow-y-hidden rounded-2xl border border-white/10 bg-black/20 md:h-[calc(100vh-180px)] md:overflow-hidden">
        <TicketDetailView 
          ticketId={id} 
          onClose={() => router.back()} 
        />
      </div>
    </div>
  )
}
