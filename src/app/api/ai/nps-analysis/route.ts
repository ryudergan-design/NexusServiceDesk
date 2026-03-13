import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Busca os logs de sentimento
    const sentimentLogs = await prisma.aILog.findMany({
      where: { agentName: 'nps-sentiment' },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limite para os últimos 100
    });

    let totalResponses = 0;
    let npsScore = 0;
    const distribution = { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 };
    const insightsCount: Record<string, number> = {};

    sentimentLogs.forEach(log => {
      try {
        const output = JSON.parse(log.output);
        totalResponses++;
        
        if (output.sentiment === 'POSITIVE') distribution.POSITIVE++;
        else if (output.sentiment === 'NEUTRAL') distribution.NEUTRAL++;
        else if (output.sentiment === 'NEGATIVE') distribution.NEGATIVE++;

        if (Array.isArray(output.insights)) {
          output.insights.forEach((insight: string) => {
            insightsCount[insight] = (insightsCount[insight] || 0) + 1;
          });
        }
      } catch (e) {
        // Ignora logs mal formatados
      }
    });

    if (totalResponses > 0) {
      const promoters = (distribution.POSITIVE / totalResponses) * 100;
      const detractors = (distribution.NEGATIVE / totalResponses) * 100;
      npsScore = Math.round(promoters - detractors);
    }

    const insights = Object.entries(insightsCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalResponses,
      npsScore,
      distribution: [
        { name: 'Promotores', value: distribution.POSITIVE },
        { name: 'Neutros', value: distribution.NEUTRAL },
        { name: 'Detratores', value: distribution.NEGATIVE },
      ],
      insights,
      trends: [
        // Mock de tendências para o gráfico
        { date: 'Mês Passado', score: npsScore - 5 },
        { date: 'Mês Atual', score: npsScore },
      ]
    });
  } catch (error) {
    console.error('Erro na API de NPS:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
