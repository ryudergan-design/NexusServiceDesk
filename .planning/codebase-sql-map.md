# Plano de Mapeamento de Base de Código e Estruturação SQL

Este plano visa executar o mapeamento completo da base de código do projeto **I9 Chamados**, com foco especial na transição total para SQLite e na garantia de que todas as ações do sistema gerem registros persistentes em tabelas organizadas.

## Objetivos
1. Executar o fluxo `/gsd:mapear-codigo` para gerar 7 documentos de análise.
2. Identificar todos os pontos de entrada de dados que precisam de persistência SQL.
3. Estruturar o projeto para que logs e registros de execução sejam salvos no SQLite.
4. Garantir que o gerenciamento de imagens (links) esteja centralizado no banco de dados.

## Áreas de Foco dos Agentes

### Agente 1: Foco Técnico (`STACK.md`, `INTEGRATIONS.md`)
- **Tarefa:** Analisar a stack Next.js + Prisma + SQLite.
- **Foco SQL:** Verificar a saúde da conexão Prisma e identificar como implementar uma tabela de logs globais.

### Agente 2: Foco Arquitetural (`ARCHITECTURE.md`, `STRUCTURE.md`)
- **Tarefa:** Mapear a estrutura de pastas e o fluxo de dados.
- **Foco SQL:** Identificar onde os registros do site (cadastros, chamados) são processados e como garantir que nada "escape" do banco de dados.

### Agente 3: Foco em Qualidade (`CONVENTIONS.md`, `TESTING.md`)
- **Tarefa:** Definir padrões de codificação e testes.
- **Foco SQL:** Estabelecer convenções para nomes de tabelas, campos e o padrão de armazenamento de links de imagens (ex: `attachments`).

### Agente 4: Foco em Preocupações (`CONCERNS.md`)
- **Tarefa:** Identificar riscos e dívidas técnicas.
- **Foco SQL:** Listar processos que hoje não geram registros (ex: tentativas de login falhas, acessos a páginas) e propor tabelas de auditoria.

## Passos de Implementação

### Fase 1: Mapeamento
1. Criar diretório `.planning/codebase/`.
2. Disparar agentes paralelos com as instruções acima.
3. Coletar e validar os 7 documentos gerados.

### Fase 2: Estruturação SQL (Pós-Mapeamento)
1. Criar pasta raiz `sql/` para documentação de arquitetura de dados pura.
2. Revisar `prisma/schema.prisma` para incluir:
   - Tabela `SystemLog` para auditoria e erros.
   - Garantir que todos os `Attachment` apontem para links (já presente, mas validar).
3. Atualizar planos de fases futuras para reforçar o uso de SQLite.

## Verificação
- [ ] Presença dos 7 documentos em `.planning/codebase/`.
- [ ] Relatório de lacunas de persistência (no `CONCERNS.md`).
- [ ] Confirmação de que todas as imagens salvam links no banco.
