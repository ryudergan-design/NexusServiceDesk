# Contexto da Fase 1: Fundação e Autenticação

## Decisões de Produto e UX

### 1. Fluxo de Onboarding e Cadastro
- **Modelo de Acesso:** Misto. O usuário pode se cadastrar livremente, mas o acesso ao sistema depende de aprovação manual de um Administrador.
- **Autenticação:** Inicialmente apenas E-mail/Senha via Supabase Auth + Auth.js v5.
- **Validação:** A aprovação do Admin é o único portão necessário (sem obrigatoriedade de confirmação de e-mail por link/OTP nesta fase).
- **Perfil Inicial:** Preenchimento obrigatório de dados adicionais (Departamento, Telefone, Cargo) logo no primeiro acesso após a aprovação.

### 2. Layout e Densidade da UI
- **Navegação Desktop:** Sidebar fixa com ícones e texto para máxima clareza.
- **Densidade Visual:** Estilo "Confortável" (Espaçosa), com foco em respiro e tipografia moderna.
- **Dashboard:** Estrutura de Grid Flexível (Drag & Drop) para widgets, permitindo personalização futura.
- **Navegação Mobile:** Menu hambúrguer lateral (consistente com a sidebar desktop).

### 3. Estilo das Animações 'High-Tech'
- **Loading State:** Loaders customizados com efeito "Glow/Neon" para uma estética premium.
- **Transições:** Fade In/Out suave entre páginas para manter a fluidez da interface.
- **Efeitos de Hover:** Uso intensivo de Glassmorphism com bordas brilhantes em cards e botões.
- **Feedback de Clique:** Micro-feedback de escala (escala reduzida levemente ao clicar) para resposta táctil.

## Contexto Técnico de Código
- **Framework:** Next.js 15 (App Router).
- **Estilização:** Tailwind CSS + Framer Motion.
- **Auth:** Auth.js v5 com Prisma Adapter conectado ao Supabase.
- **Componentes:** Shadcn/UI como base, customizados com efeitos de vidro e glow.
- **Gerenciamento de Tema:** `next-themes` configurado para Dark Mode nativo.

## Próximos Passos
- Pesquisa técnica detalhada sobre integração Drag & Drop (ex: dnd-kit) com layouts flexíveis.
- Iniciar o Setup do Projeto (Fase 1).
