import { PrismaClient } from '@prisma/client';

export {};

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando configuração de FTS5 no SQLite (String ID support) ---');

  try {
    // 1. Limpar e recriar tabela virtual FTS5
    // Removemos o 'content' externo pois ele exige rowid (INTEGER), 
    // mas KnowledgeArticle usa CUID (TEXT).
    console.log('Removendo tabelas antigas se existirem...');
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_knowledge_article_ai;`);
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_knowledge_article_ad;`);
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_knowledge_article_au;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "KnowledgeArticle_FTS";`);

    console.log('Criando tabela virtual KnowledgeArticle_FTS...');
    await prisma.$executeRawUnsafe(`
      CREATE VIRTUAL TABLE IF NOT EXISTS "KnowledgeArticle_FTS" USING fts5(
          articleId,
          title,
          content,
          tags,
          tokenize='porter unicode61'
      );
    `);

    // 2. Criar Triggers para sincronização manual
    console.log('Criando triggers de sincronização...');

    // Trigger INSERT
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS trg_knowledge_article_ai AFTER INSERT ON "KnowledgeArticle" BEGIN
        INSERT INTO "KnowledgeArticle_FTS"(articleId, title, content, tags) 
        VALUES (new.id, new.title, new.content, new.tags);
      END;
    `);

    // Trigger DELETE
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS trg_knowledge_article_ad AFTER DELETE ON "KnowledgeArticle" BEGIN
        DELETE FROM "KnowledgeArticle_FTS" WHERE articleId = old.id;
      END;
    `);

    // Trigger UPDATE
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS trg_knowledge_article_au AFTER UPDATE ON "KnowledgeArticle" BEGIN
        UPDATE "KnowledgeArticle_FTS" 
        SET title = new.title, content = new.content, tags = new.tags
        WHERE articleId = new.id;
      END;
    `);

    // 3. Popular dados iniciais
    console.log('Sincronizando dados existentes...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO "KnowledgeArticle_FTS"(articleId, title, content, tags)
      SELECT id, title, content, tags FROM "KnowledgeArticle";
    `);

    console.log('--- FTS5 configurado com sucesso para IDs do tipo String! ---');
  } catch (error) {
    console.error('Erro ao configurar FTS5:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
