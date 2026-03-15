import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Limpando Gatilhos e Tabelas FTS5 para Migração ---')
  
  try {
    // Lista de gatilhos e tabelas que costumam dar erro no SQLite com Prisma
    const drops = [
      'DROP TRIGGER IF EXISTS trg_knowledge_article_ai',
      'DROP TRIGGER IF EXISTS trg_knowledge_article_au',
      'DROP TRIGGER IF EXISTS trg_knowledge_article_ad',
      'DROP TABLE IF EXISTS KnowledgeArticle_FTS',
      'DROP TABLE IF EXISTS KnowledgeArticle_FTS_config',
      'DROP TABLE IF EXISTS KnowledgeArticle_FTS_content',
      'DROP TABLE IF EXISTS KnowledgeArticle_FTS_data',
      'DROP TABLE IF EXISTS KnowledgeArticle_FTS_docsize',
      'DROP TABLE IF EXISTS KnowledgeArticle_FTS_idx'
    ]

    for (const cmd of drops) {
      try {
        await prisma.$executeRawUnsafe(cmd)
        console.log(`Sucesso: ${cmd}`)
      } catch (e) {
        console.log(`Aviso (pode ser ignorado): ${cmd}`)
      }
    }

    console.log('\n--- Gatilhos removidos! Agora você pode rodar npx prisma db push ---')
  } catch (error) {
    console.error('Erro ao limpar banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

