"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendData {
  date: string
  incidents: number
  requests: number
}

interface IncidentTrendChartProps {
  data: TrendData[]
}

export function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Tendência de Incidentes (7 dias)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {payload[0].payload.date}
                        </span>
                        <div className="flex justify-between gap-4">
                          <span className="text-blue-500 text-[0.70rem] font-bold">Incidentes:</span>
                          <span className="font-bold">{payload[0].value}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-emerald-500 text-[0.70rem] font-bold">Requisições:</span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line 
              type="monotone" 
              dataKey="incidents" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#3b82f6" }} 
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="requests" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#10b981" }} 
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
