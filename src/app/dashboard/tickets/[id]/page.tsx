"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  ChevronRight,
  MoreVertical,
  Paperclip
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const statusLabels: Record<string, string> = {
  NEW: "Novo",
  TRIAGE: "Em Triagem",
  DEVELOPMENT: "Desenvolvimento",
  TEST: "Em Teste",
  COMPLETED: "Concluído",
}

export default function TicketDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [ticket, setTicket] = useState<any>(null)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTicket(data)
        setIsLoading(false)
      })
  }, [params.id])

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`/api/tickets/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus, comment: "Status atualizado pelo atendente." })
    })
    if (res.ok) {
      const updated = await res.json()
      setTicket({ ...ticket, status: updated.status })
      // Recarregar para ver a nova transição na timeline
      router.refresh()
    }
  }

  if (isLoading) return <div className="p-8 text-white">Carregando chamado...</div>
  if (!ticket) return <div className="p-8 text-white">Chamado não encontrado.</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/30 uppercase tracking-widest">#{ticket.id.slice(-8).toUpperCase()}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {statusLabels[ticket.status]}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{ticket.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {ticket.status === "NEW" && (
            <Button onClick={() => updateStatus("TRIAGE")} className="bg-amber-500 hover:bg-amber-600 text-white">
              Iniciar Triagem
            </Button>
          )}
          {ticket.status === "TRIAGE" && (
            <Button onClick={() => updateStatus("DEVELOPMENT")} className="bg-purple-500 hover:bg-purple-600 text-white">
              Mover para Dev
            </Button>
          )}
          {ticket.status !== "COMPLETED" && (
            <Button onClick={() => updateStatus("COMPLETED")} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Resolver Chamado
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Descrição do Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
              
              {ticket.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <h4 className="text-sm font-semibold text-white/50 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" /> Anexos ({ticket.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {ticket.attachments.map((file: any) => (
                      <a 
                        key={file.id} 
                        href={file.fileUrl} 
                        target="_blank"
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-xs text-white/70">{file.filename}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Timeline de Interações
            </h3>
            
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
              {ticket.transitions.map((t: any, index: number) => (
                <div key={t.id} className="relative flex items-start gap-6 pl-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black border border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm">
                        <span className="font-bold text-white">{t.performedBy.name}</span>
                        <span className="text-white/40 mx-2">alterou status de</span>
                        <Badge variant="outline" className="text-[10px] text-white/30">{statusLabels[t.fromStatus] || "INÍCIO"}</Badge>
                        <ChevronRight className="inline h-3 w-3 mx-1 text-white/20" />
                        <Badge variant="outline" className="text-[10px] text-primary">{statusLabels[t.toStatus]}</Badge>
                      </div>
                      <time className="text-[10px] text-white/20">{new Date(t.createdAt).toLocaleString()}</time>
                    </div>
                    {t.comment && (
                      <p className="mt-2 text-sm text-white/60 bg-white/5 p-3 rounded-lg border border-white/5 italic">
                        "{t.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Solicitante</span>
                  <span className="text-white font-medium">{ticket.requester.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Atendente</span>
                  <span className="text-white font-medium">{ticket.assignee?.name || "Não atribuído"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Prioridade</span>
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                    {ticket.priority}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Tipo</span>
                  <span className="text-white">{ticket.type}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Categoria</span>
                  <span className="text-white">{ticket.category.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-primary/5 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-xs border-white/5 hover:bg-white/5">
                <User className="mr-2 h-3 w-3" /> Assumir Chamado
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs border-white/5 hover:bg-white/5">
                <MessageSquare className="mr-2 h-3 w-3" /> Adicionar Nota Privada
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
