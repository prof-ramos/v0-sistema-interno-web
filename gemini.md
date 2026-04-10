# GEMINI.md - Sistema Interno de Gestão Integrada

Este documento fornece orientações e contexto sobre o projeto **v0-sistema-interno-web**, um sistema de gestão interna robusto e moderno.

## Visão Geral do Projeto

O sistema é uma aplicação web de gestão integrada que permite o gerenciamento de cadastros (pessoas e empresas), solicitações (fluxos de trabalho) e documentos oficiais. Ele foi desenvolvido com foco em performance, acessibilidade e experiência do usuário (UX).

### Tecnologias Principais

- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 + PostCSS
- **Componentes UI:** Radix UI (base para padrões Shadcn UI)
- **Gerenciamento de Estado:** Zustand (com persistência local)
- **Validação e Tipagem:** Zod + Custom Hooks
- **Ícones:** Lucide React
- **Gráficos:** Recharts

## Arquitetura e Estrutura de Pastas

O projeto segue uma estrutura modular e escalável:

- `app/`: Contém as rotas e layouts da aplicação (Dashboard, Cadastro, Solicitações, Documentos, Configurações).
- `components/`: Organizado por domínios de UI:
  - `ui/`: Componentes base reutilizáveis (botões, inputs, cards, etc.).
  - `layout/`: Componentes de estrutura (AppShell, Sidebar, Header).
  - `forms/`: Componentes especializados para formulários.
  - `feedback/`: Alertas, badges de status, diálogos de confirmação e estados de carregamento.
  - `data/`: Tabelas e visualização de dados.
- `store/`: Gerenciamento de estado global via Zustand (`useAppStore`).
- `lib/`: Utilitários (`utils.ts`), constantes globais (`constants.ts`), tipos TypeScript (`types.ts`) e esquemas de validação (`validations.ts`).
- `hooks/`: Hooks personalizados para lógica de negócio reutilizável (`use-validation`, `use-debounce`).
- `services/`: Camada de abstração para serviços externos ou persistência (`storage.ts`).

## Comandos Principais

Utilize os comandos abaixo para gerenciar o ciclo de vida do projeto:

| Comando | Descrição |
| --------- | ----------- |
| `npm run dev` | Inicia o servidor de desenvolvimento em `localhost:3000`. |
| `npm run build` | Compila a aplicação para produção. |
| `npm run start` | Inicia o servidor de produção após o build. |
| `npm run lint` | Executa a verificação estática do código com ESLint. |
| `npm run test` | Executa a suíte de testes E2E e unitários. Requer `playwright` ou `jest`/`vitest`. |
| `npm run type-check` | Executa a verificação de tipos do TypeScript (`tsc --noEmit`). |
| `npm run format` | Executa o Prettier para formatar código (requer prettier configurado). |

## Convenções de Desenvolvimento

- **Nomenclatura:**
  - Arquivos e pastas: `kebab-case`.
  - Componentes React: `PascalCase`.
  - Funções e variáveis: `camelCase`.
- **Componentes:** Prefira a criação de componentes pequenos e especializados. Utilize os componentes em `@/components/ui` como base.
- **Estado Global:** O `useAppStore` centraliza os dados principais. Para estados locais de formulários, utilize hooks de estado ou bibliotecas de formulário.
- **Validação:** Sempre utilize Zod para definir schemas de dados e os hooks de validação existentes para garantir a integridade dos dados inseridos.
- **Estilização:** Utilize classes utilitárias do Tailwind CSS. Evite CSS arbitrário fora do `globals.css`.
- **Acessibilidade:**
  - Utilize semântica HTML (ex: `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`, `<footer>`).
  - Aplique atributos ARIA obrigatórios (`role`, `aria-labelledby`, `aria-describedby`).
  - Siga padrões de navegação por teclado (`tabindex`, `focus-visible`, ordem de foco).
  - Mantenha contraste de cores mínimo (WCAG AA/AAA).
  - Formulários devem utilizar `<label>` vinculada por `htmlFor`/`id` em JSX (equivalente ao atributo HTML `for`) ou `aria-label`.
  - Mensagens de erro de validação (Zod) devem ser acessíveis e focáveis para leitores de tela.
- **Tratamento de Erros:**
  - API/Serviços: Trate chamadas em try/catch, parse os erros mapeando para a interface `ErrorResult`.
  - Fallbacks: Utilize o padrão ErrorBoundary, com componentes reutilizáveis baseados no design do `@/components/ui`.
  - Logging: Requer logging estruturado com `console.error` usando metadados e envio para monitoramento (ex: Sentry/Datadog).
  - UI: Não exiba stack traces brutos; utilize mensagens genéricas e localizadas com IDs de correlação sempre que possível.
  - O estado de erros globais ou bloqueantes deverá ficar centralizado no `useAppStore`.

## Fluxos de Trabalho Implementados

1. **Auto-Save:** O sistema possui um mecanismo de rascunho automático (com `debounce` ex: 1000ms a 5000ms) em formulários de cadastro e ações contínuas para evitar perda de dados.
2. **Persistência:** Dados simulados e alterações do usuário são atualmente persistidos no `localStorage` via Zustand `persist` middleware com `partialize` **em todos os ambientes**. **Risco aceito (MVP):** campos PII (nome, cpfCnpj, email, telefone, endereço em `cadastros`; perfil em `configuracoes`) permanecem no cliente durante a fase de protótipo. **Plano de migração:** ao implementar o backend (Prisma + PostgreSQL), remover slices PII do `partialize`, migrar para APIs autenticadas, e usar SQLite para testes locais em desenvolvimento. Os campos PII estão marcados com `⚠ PII` no `partialize` do store para referência.
3. **Feedback:** Ações irreversíveis (ex: Excluir) devem invocar um `<ConfirmDialog>`. Mensagens rápidas e fluxos não bloqueantes (ex: Sucesso ao salvar) utilizam `sonner` toasts categorizadas por severidade (success, error, warning).

## Configuração de Ambiente

- Variáveis de ambiente como `NEXT_PUBLIC_API_URL` e chaves sensíveis devem ficar documentadas em `.env.example` e implementadas em `.env.local`.
- Nunca comite secrets (chaves e tokens); todas as variáveis devem ser validadas em tempo de inicialização via Zod (`env.mjs` pattern).

## Integração com Backend/API

- As requisições (fetch) devem seguir o padrão de interface `ErrorResult` e implementar headers (`Authorization: Bearer <token>`).
- Todas mutações possuem verificações de role/permission no server para cada escopo/resource.

## Estratégia de Testes

- **E2E**: Framework Playwright cobrindo Chrome, Firefox e WebKit, executando os cenários de user flow.
- **Unitários e Componentes**: Framework Jest/Vitest em utilitários e hooks específicos (`hooks/use-validation`), sem dependência de UI.

## Deploy e CI/CD

- **Pipeline (GitHub Actions)**: Checkout -> Npm Install -> Linting -> Type Check -> E2E Tests -> Artefato/Build.
- Somente com sucesso do CI as branches serão promovidas a `staging`/`prod`.

## Convenções Git

- Utilize formato de conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Workflow padrão baseado em criação de ramas `feature/<nome>` saindo de `main`, protegidas por PR checklist.

## Monitoramento e Logs

- A aplicação utiliza logs categorizados: `info`, `warn`, `error` no server incluindo tracing (ex: `traceId`, `userId`, `component`).
- Monitorar a SLO de taxa de erro (< 1%) no cliente para garantir estabilidade, e correlacionar crashes aos deployments.

## Segurança

- **Autenticação**: Integração planejada com NextAuth.js / Auth.js para suporte a OAuth2 e MFA.
- **Autorização**: Controle de acesso baseado em roles (RBAC) validado em todas as chamadas de API (Server Components & Route Handlers).
- **Proteção de Dados**: Sanitização de inputs via Zod e headers de segurança (HSTS, CSP, X-Frame-Options) configurados no `next.config`.
- **Sensibilidade**: Dados PII são mascarados na interface e truncados em logs de depuração.

## Banco de Dados

- **ORM**: Prisma ou Drizzle (Sugerido) para gerenciamento de schema e migrações type-safe.
- **Cache**: Estratégia de revalidação de tags do Next.js aliada a Redis para sessões distribuídas se necessário.
- **Migrações**: Processo automatizado via CI/CD, com rollback testado em ambiente de staging.
