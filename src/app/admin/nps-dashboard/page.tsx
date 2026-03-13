'use client';

import { useEffect, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NPSData {
  distribution: { name: string; value: number }[];
  insights: { keyword: string; count: number }[];
  trends: { date: string; score: number }[];
  totalResponses: number;
  npsScore: number;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Promoters, Passives, Detractors

export default function NPSDashboard() {
  const [data, setData] = useState<NPSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNPSData = async () => {
      try {
        const response = await fetch('/api/ai/nps-analysis');
        if (response.ok) {
          const fetchedData = await response.json();
          setData(fetchedData);
        } else {
          console.error("Erro ao buscar dados do dashboard NPS");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard NPS", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNPSData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Carregando Dashboard NPS...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Satisfação (NPS)</h1>
        <p className="text-muted-foreground">
          Análise inteligente de sentimento baseada nos feedbacks dos usuários.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.npsScore}</div>
            <p className="text-xs text-muted-foreground">Score de -100 a 100</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalResponses}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Distribuição de NPS</CardTitle>
            <CardDescription>Promotores vs Neutros vs Detratores</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Insights da IA</CardTitle>
            <CardDescription>Temas mais extraídos dos feedbacks qualitativos</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.insights} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="keyword" type="category" width={100} tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8884d8" name="Menções" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
