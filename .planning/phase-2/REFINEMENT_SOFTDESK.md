# Refinamento de Fase 2: Workflow de Registro de Atividades (Estilo Softdesk)

## Objetivo
Implementar o sistema de "Diário de Bordo" do chamado, permitindo que atendentes registrem notas técnicas, comentários públicos e apontamento de esforço (Time Tracking) em uma timeline unificada.

## Requisitos de Negócio (ITIL)
1. **Notas Públicas:** Mensagens visíveis ao solicitante (interação cliente-suporte).
2. **Notas Internas (Técnicas):** Documentação técnica visível apenas para a equipe de atendimento (Administradores e Agentes).
3. **Registro de Esforço:** Campo opcional para informar minutos gastos na atividade realizada.
4. **Timeline Unificada:** Visualização cronológica mesclando:
    - Transições de Status (Automáticas).
    - Notas Públicas (Chat).
    - Notas Internas (Privadas).

## Especificação Técnica
- **Database:** Adicionar campos `isInternal` (Boolean) e `timeSpent` (Int) ao modelo `TicketComment` no Prisma.
- **API:** Criar endpoint `POST /api/tickets/[id]/comments` para processar as novas entradas.
- **Frontend:** 
    - Novo componente `ActivityForm` na página de detalhes do chamado.
    - Estilização diferenciada para Notas Internas (ex: fundo âmbar suave ou borda colorida).
    - Contador de tempo total gasto acumulado no chamado.

## Verificação (UAT)
- [ ] Registrar uma nota pública e vê-la na timeline.
- [ ] Registrar uma nota interna e garantir que tenha sinalização visual de "Privado".
- [ ] Validar se o tempo gasto (minutos) está sendo somado corretamente.
