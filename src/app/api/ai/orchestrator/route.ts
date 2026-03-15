import { NextResponse } from 'next/server';
import { GeminiAIService } from '@/lib/ai/gemini-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, context, requester, category, priority, agentId } = body || {};

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'A mensagem é obrigatória para a orquestração.' },
        { status: 400 }
      );
    }

    const result = await GeminiAIService.orchestrateConversation({
      message,
      context: Array.isArray(context) ? context : [],
      requester,
      category,
      priority,
    }, agentId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[AI_ORCHESTRATOR_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao processar a conversa híbrida.' },
      { status: 500 }
    );
  }
}
