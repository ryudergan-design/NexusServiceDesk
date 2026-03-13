# Plano de Verificação e Integração: 05-04

## Objetivo
Garantir que os componentes de UI da Fase 5 (IA) estejam 100% integrados e funcionais, cumprindo o checkpoint de verificação humana.

## Tarefas de Integração Final

### 1. Integrar CollectionChat na Abertura de Chamados
- **Arquivo:** `src/app/dashboard/tickets/new/page.tsx` (ou componente de formulário correspondente).
- **Ação:** Adicionar o `CollectionChat` para validar a completude do chamado antes da submissão final.

### 2. Integrar AIInsightCard no Detalhe do Chamado
- **Arquivo:** `src/components/dashboard/ticket-detail-view.tsx` (ou similar).
- **Ação:** Garantir que o `AIInsightCard` esteja visível na sidebar para agentes/admins.

### 3. Validar Dashboard NPS
- **Arquivo:** `src/app/admin/nps-dashboard/page.tsx`.
- **Ação:** Verificar se a rota está acessível e exibindo os dados (mesmo que mockados para o teste).

## Roteiro de Verificação Humana (Checkpoint)
1. **Ativar IA:** Ir em Perfil e ativar o switch de IA.
2. **Triagem/Coleta:** Tentar abrir um chamado vago. O `CollectionChat` deve intervir.
3. **Insights:** Abrir um chamado existente. O `AIInsightCard` deve mostrar o sumário e artigos.
4. **Resolução:** Usar o `Magic Compose` na área de resposta.
5. **Satisfação:** Avaliar um chamado e checar o `NPS Dashboard`.

## Próxima Ação
Executar a integração do `CollectionChat` no formulário de novos chamados.
