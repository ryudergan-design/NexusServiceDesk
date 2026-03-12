import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CategoryChart } from "./category-chart"
import { IncidentTrendChart } from "./incident-trend-chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface AgentPerformance {
  id: string
  name: string
  image?: string
  resolvedCount: number
  slaCompliance: number
}

interface ManagerDashboardProps {
  categoryData: any[]
  trendData: any[]
  agentRanking: AgentPerformance[]
}

export function ManagerDashboard({ categoryData, trendData, agentRanking }: ManagerDashboardProps) {
  const handleExport = () => {
    // Implement CSV export logic
    console.log("Exporting reports...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Visão Geral de Performance</h2>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <IncidentTrendChart data={trendData} />
        <CategoryChart data={categoryData} />
      </div>

      <Card className="border-none bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Ranking de Produtividade dos Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead className="text-right">Chamados Resolvidos</TableHead>
                <TableHead className="text-right">SLA Compliance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentRanking.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={agent.image} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{agent.name}</span>
                  </TableCell>
                  <TableCell className="text-right">{agent.resolvedCount}</TableCell>
                  <TableCell className="text-right w-[200px]">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={agent.slaCompliance} className="h-2 w-24" />
                      <span className="text-xs font-bold w-8">{agent.slaCompliance}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {agentRanking.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                    Dados de performance insuficientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
