"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
  Bug,
  Lightbulb,
  MessageSquare,
  User as UserIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const statusColumns = [
  { id: "NEW", label: "Novos", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "TRIAGE", label: "Em Triagem", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "DEVELOPMENT", label: "Desenvolvimento", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: "TEST", label: "Em Teste", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { id: "COMPLETED", label: "Concluídos", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
]

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-500/20 text-slate-400",
  MEDIUM: "bg-blue-500/20 text-blue-400",
  HIGH: "bg-orange-500/20 text-orange-400",
  CRITICAL: "bg-red-500/20 text-red-400",
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch("/api/tickets")
      .then(res => res.json())
      .then(data => {
        setTickets(data)
        setIsLoading(false)
      })
  }, [])

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Central de Chamados</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe o ciclo de vida dos atendimentos.</p>
        </div>
        <Link href="/dashboard/tickets/new">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> Novo Chamado
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <Input 
            placeholder="Buscar por ID ou título..." 
            className="pl-10 bg-white/5 border-white/10 w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="border-white/10 bg-white/5">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 min-w-max h-full">
          {statusColumns.map((column) => (
            <div key={column.id} className="w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={column.color}>
                    {column.label}
                  </Badge>
                  <span className="text-xs text-white/30 font-medium">
                    {filteredTickets.filter(t => t.status === column.id).length}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 p-2 rounded-xl bg-white/[0.02] border border-white/5 overflow-y-auto custom-scrollbar max-h-[600px]">
                {filteredTickets
                  .filter(t => t.status === column.id)
                  .map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      layoutId={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link href={`/dashboard/tickets/${ticket.id}`}>
                        <Card className="border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group group">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${priorityColors[ticket.priority]}`}>
                                {ticket.priority}
                              </Badge>
                              <span className="text-[10px] text-white/30">#{ticket.id.slice(-6).toUpperCase()}</span>
                            </div>
                            
                            <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
                              {ticket.title}
                            </h4>

                            <div className="flex items-center gap-3 text-[11px] text-white/40">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                0
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center border border-white/10">
                                  <UserIcon className="h-3 w-3 text-white/50" />
                                </div>
                                <span className="text-[10px] text-white/60 truncate max-w-[100px]">
                                  {ticket.requester.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {ticket.type === "BUG" && <Bug className="h-3 w-3 text-red-400" />}
                                {ticket.type === "SUGGESTION" && <Lightbulb className="h-3 w-3 text-amber-400" />}
                                <span className="text-[10px] text-white/30 truncate max-w-[60px]">
                                  {ticket.category.name}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                
                {filteredTickets.filter(t => t.status === column.id).length === 0 && (
                  <div className="h-24 flex items-center justify-center rounded-lg border border-dashed border-white/5">
                    <p className="text-[11px] text-white/20 italic">Vazio</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
