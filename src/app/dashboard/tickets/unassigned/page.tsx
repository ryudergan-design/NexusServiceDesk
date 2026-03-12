"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Plus, 
  Search, 
  Clock,
  UserPlus,
  AlertTriangle,
  ArrowRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SLAProgress } from "@/components/dashboard/sla-progress"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UnassignedTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const fetchTickets = async () => {
    const res = await fetch("/api/tickets?unassigned=true")
    const data = await res.json()
    setTickets(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleAssignToMe = async (ticketId: string) => {
    try {
      // Primeiro buscamos a sessão para pegar o ID do usuário (ou deixamos o backend resolver se não passarmos assigneeId)
      // No nosso PATCH atual, se não passarmos assigneeId ele mantém o atual. 
      // Mas podemos atualizar o PATCH para suportar "assignToMe" ou apenas buscar a sessão no client.
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()
      
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          assigneeId: session.user.id,
          comment: "Chamado assumido pelo atendente via fila de triagem." 
        })
      })

      if (res.ok) {
        toast.success("Chamado assumido com sucesso!")
        fetchTickets()
        router.refresh()
      }
    } catch (error) {
      toast.error("Erro ao assumir chamado.")
    }
  }

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-amber-500" /> Fila de Triagem
        </h1>
        <p className="mt-2 text-muted-foreground">Chamados que ainda não possuem um atendente atribuído.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <Input 
            placeholder="Buscar chamados..." 
            className="pl-10 bg-white/5 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-white/40">Carregando fila...</div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <motion.div key={ticket.id} layout>
              <Card className="border-white/10 bg-black/40 hover:bg-white/[0.02] transition-all group">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      {ticket.category.name}
                    </Badge>
                    <span className="text-[10px] text-white/30">#{ticket.id}</span>
                  </div>

                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
                    {ticket.title}
                  </h3>

                  <SLAProgress 
                    createdAt={ticket.createdAt} 
                    dueAt={ticket.resolutionTimeDue} 
                    label="Tempo de Resolução" 
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/30 uppercase tracking-tighter">Solicitante</span>
                      <span className="text-xs text-white/70">{ticket.requester.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 text-[11px] gap-1"
                        onClick={() => handleAssignToMe(ticket.id)}
                      >
                        <UserPlus className="h-3 w-3" /> Assumir
                      </Button>
                      <Link href={`/dashboard/tickets/${ticket.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <Clock className="h-8 w-8 text-white/10 mb-2" />
          <p className="text-sm text-white/20">Tudo limpo! Nenhum chamado aguardando triagem.</p>
        </div>
      )}
    </div>
  )
}
