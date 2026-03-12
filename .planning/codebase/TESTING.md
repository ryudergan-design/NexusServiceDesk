# Padrões de Teste

**Data da Análise:** 2026-03-12

## Framework de Teste

**Runner Sugerido:**
- **Vitest** (Velocidade e compatibilidade com Next.js/Vite)
- Config: `vitest.config.ts`

**Biblioteca de Asserção:**
- `expect` (incluído no Vitest)
- `@testing-library/react` (para testes de componentes)

**Comandos Recomendados:**
```bash
npm test               # Executar todos os testes
npm run test:watch     # Modo watch
npm run test:coverage  # Cobertura
```

## Organização de Arquivos de Teste

**Localização:**
- Testes Unitários: Co-localizados com o código ou em subdiretórios `__tests__`.
- Exemplo: `src/lib/utils.test.ts` ao lado de `src/lib/utils.ts`.

**Nomenclatura:**
- `*.test.ts` para lógica pura.
- `*.test.tsx` para componentes React.

## Estrutura de Teste

**Organização da Suite:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
  it('should render the title correctly', () => {
    render(<Header />);
    expect(screen.getByText(/I9 Chamados/i)).toBeDefined();
  });
});
```

## Mocking

**Framework:** `vitest` (vi.mock).

**Padrões:**
- Mock de chamadas ao banco de dados (Prisma) usando `vitest-mock-extended`.
- Mock de Next.js `navigation` e `auth`.

**O que Mockar:**
- Chamadas externas (APIs, SDKs).
- Camada de banco de dados em testes unitários.

**O que NÃO Mockar:**
- Lógica de negócio pura em utilitários.
- Componentes puros em testes de integração de UI.

## Tipos de Teste

**Testes Unitários:**
- Foco em funções auxiliares (`lib/utils.ts`, `lib/sla.ts`).
- Validação de regras de negócio isoladas.

**Testes de Integração:**
- Validação de Server Actions com banco de dados de teste (SQLite in-memory ou dev.db separado).
- Fluxos de autenticação.

**Testes E2E:**
- Recomendação: **Playwright**.
- Fluxos críticos: Login, Abertura de Chamado, Atribuição de Técnico.

## Cobertura

**Alvo:** 70% de cobertura de código para lógica crítica de SLA e Chamados.

---

*Análise de testes: 2026-03-12*
