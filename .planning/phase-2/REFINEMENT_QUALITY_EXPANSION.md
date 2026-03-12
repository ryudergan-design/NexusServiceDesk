# Refinamento Fase 2.5: Expansão do Módulo de Qualidade e Notificações (Padrão Softdesk)

## Objetivo
Transformar a pesquisa de satisfação em um workflow interativo e rastreável, integrando-a ao sistema de notificações (sino), timeline de atividades e permitindo a abertura via popup, garantindo que apenas usuários logados como Solicitantes possam avaliar.

## Escopo e Impacto
- **Arquitetura de Dados (CSAT):** Criação da tabela `SatisfactionSurvey` para separar dados de qualidade do ticket principal.
- **Sistema de Notificações:** Implementação da tabela `Notification` e API para alertar o solicitante sobre avaliações pendentes.
- **Workflow de UI:** 
    - Migração da pesquisa para um componente `Dialog` (popup).
    - Botão "Avaliar Atendimento" nos logs de conclusão da timeline.
    - Sinalização visual no sino do Header para chamados concluídos.
- **Segurança:** Restrição rigorosa baseada no `activeRole` da sessão.

## Mudanças no Banco de Dados (Prisma)
```prisma
model SatisfactionSurvey {
  id        String   @id @default(cuid())
  rating    Int
  feedback  String?
  ticketId  String   @unique
  userId    String
  createdAt DateTime @default(now())
  
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  type      String   // INFO, WARNING, SUCCESS, SURVEY
  read      Boolean  @default(false)
  link      String?  // Link para o chamado
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

## Plano de Implementação (Passo a Passo)

### 1. Reestruturação de Dados
- [ ] Atualizar `prisma/schema.prisma` com os novos modelos e remover `rating`/`feedback` do modelo `Ticket` (após migração).
- [ ] Executar `npx prisma migrate dev --name create_quality_and_notifications`.

### 2. Sistema de Notificações (Backend)
- [ ] Criar API `GET /api/notifications` para listar alertas do usuário logado.
- [ ] Criar API `PATCH /api/notifications/[id]` para marcar como lida.
- [ ] Atualizar o workflow de encerramento do chamado (`PATCH /api/tickets/[id]`) para criar automaticamente uma notificação do tipo `SURVEY` para o solicitante.

### 3. Interface Interativa (Frontend)
- [ ] **Sino de Notificações:** Atualizar `src/components/header.tsx` para buscar e listar notificações reais.
- [ ] **Satisfaction Dialog:** Modificar `src/components/dashboard/satisfaction-survey.tsx` para ser um componente que pode ser usado dentro de um `Dialog`.
- [ ] **Timeline Integration:** Na página do chamado, quando o log de transição for `toStatus === 'COMPLETED'`, exibir um botão "Avaliar Solução" para o solicitante.

### 4. Segurança de Papéis
- [ ] Garantir que o `Dialog` de avaliação valide `activeRole === 'USER'`.

## Verificação
- [ ] Concluir um chamado como atendente e ver o ponto vermelho aparecer no sino do solicitante.
- [ ] Clicar na notificação e verificar se o popup de avaliação abre corretamente.
- [ ] Validar se os dados estão sendo gravados na nova tabela `SatisfactionSurvey`.
