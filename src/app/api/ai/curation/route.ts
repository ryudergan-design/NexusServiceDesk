import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (!user || (user.role !== 'ADMIN' && user.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, categoryId, tags } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Cria o artigo na base de conhecimento
    const article = await prisma.knowledgeArticle.create({
      data: {
        title,
        content,
        categoryId,
        tags: Array.isArray(tags) ? tags.join(',') : tags,
      }
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('Erro ao aprovar rascunho de curadoria:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar artigo' }, { status: 500 });
  }
}
