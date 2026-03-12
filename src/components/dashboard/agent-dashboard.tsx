import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, AlertTriangle, User, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Ticket {
  id: string
  title: string
  priority: string
  resolutionTimeDue: Date | null
  status: string
}

interface Activity {
  id: string
  type: "comment" | "transition" | "assignment"
  user: string
  ticketId: string
  ticketTitle: string
  createdAt: Date
}

interface AgentDashboardProps {
  urgentTickets: Ticket[]
  recentActivities: Activity[]
}

export function AgentDashboard({ urgentTickets, recentActivities }: AgentDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            SLA Próximo ao Vencimento
          </CardTitle>
          <Badge variant="outline" className="border-orange-500/50 text-orange-500">
            {urgentTickets.length} Críticos
          </Badge>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {urgentTickets.map((ticket) => {
                const isOverdue = ticket.resolutionTimeDue && new Date() > new Date(ticket.resolutionTimeDue)
                
                return (
                  <div 
                    key={ticket.id} 
                    className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${
                      isOverdue 
                        ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                        : "border-border bg-background/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{ticket.title}</h3>
                      <Badge className={
                        ticket.priority === "CRITICAL" ? "bg-red-500" : 
                        ticket.priority === "HIGH" ? "bg-orange-500" : "bg-blue-500"
                      }>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {ticket.resolutionTimeDue 
                            ? `${isOverdue ? "Atrasado há" : "Vence em"} ${formatDistanceToNow(new Date(ticket.resolutionTimeDue), { locale: ptBR })}`
                            : "Sem prazo"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 uppercase">
                        <div className={`w-2 h-2 rounded-full ${isOverdue ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                        {ticket.status}
                      </div>
                    </div>
                  </div>
                )
              })}
              {urgentTickets.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  Nenhum chamado urgente no momento.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border-none bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-border before:to-transparent">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm z-10">
                    {activity.type === "comment" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                    {activity.type === "transition" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    {activity.type === "assignment" && <User className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="text-blue-500 font-bold">{activity.user}</span>
                      {" "}
                      {activity.type === "comment" && "comentou em"}
                      {activity.type === "transition" && "alterou o status de"}
                      {activity.type === "assignment" && "foi atribuído a"}
                      {" "}
                      <span className="italic">#{activity.ticketId} {activity.ticketTitle}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  Nenhuma atividade recente.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
