import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface KPICardsProps {
  openTickets: number
  slaCompliance: number
  mttr: number // Mean Time To Resolution in minutes
}

export function KPICards({ openTickets, slaCompliance, mttr }: KPICardsProps) {
  const formatMTTR = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-l-4 border-l-blue-500 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tickets Abertos</CardTitle>
          <AlertCircle className="w-4 h-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openTickets}</div>
          <p className="text-xs text-muted-foreground">Chamados ativos no momento</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Conformidade SLA</CardTitle>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{slaCompliance}%</div>
          <p className="text-xs text-muted-foreground">Dentro do prazo acordado</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">MTTR Médio</CardTitle>
          <Clock className="w-4 h-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMTTR(mttr)}</div>
          <p className="text-xs text-muted-foreground">Tempo médio de resolução</p>
        </CardContent>
      </Card>
    </div>
  )
}
