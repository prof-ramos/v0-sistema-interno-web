# Sistema Interno Web — CLAUDE.md

## Stack

- **Framework**: Next.js 16.2.0 (App Router, Turbopack)
- **Linguagem**: TypeScript 5.7.3 (strict mode)
- **Estilo**: Tailwind CSS 4.2 + tw-animate-css
- **Componentes UI**: shadcn/ui (Radix primitives)
- **Validacao**: Zod
- **Estado**: Zustand (persist middleware, localStorage)
- **ORM**: Prisma 7.7 + BetterSQLite3 adapter
- **Testes**: Node.js built-in test runner (unit) + Playwright (e2e)
- **Package manager**: npm (package-lock.json)

## Estrutura

```
app/                    # App Router pages + API routes
  api/cadastros/        # CRUD REST endpoints (Prisma)
  page.tsx              # Dashboard
  cadastro/page.tsx     # Formulario de cadastro
  solicitacoes/         # Solicitacoes (state local)
  documentos/           # Documentos (state local)
  configuracoes/        # Configuracoes do app
components/
  ui/                   # shadcn/ui components (somente os usados)
  forms/                # Form field, action buttons, sections
  layout/               # AppShell, AppSidebar, PageHeader, SectionCard
  feedback/             # ConfirmDialog, ErrorAlert, StatusBadge
  data/                 # DataTable, EmptyState, FiltersBar
hooks/                  # useAutoSave, useValidation, useMobile
lib/
  generated/prisma/     # Auto-gerado — NAO EDITAR manualmente
  validations.ts        # Zod schemas (cadastroSchema, mascaras)
  constants.ts          # Rotas, labels, cores por status
  types.ts              # Interfaces (Cadastro, Solicitacao, Documento, etc.)
  mock-data.ts          # Dados mock para desenvolvimento
  error-reporting.ts    # Abstracao de error reporting (console -> Sentry futuramente)
  prisma.ts             # Singleton PrismaClient
store/                  # Zustand store (useAppStore)
docs/                   # Brand guidelines, Design System
e2e/                    # Playwright page objects + testes
tests/                  # Unit tests
prisma/                 # Schema + seed
```

## Convencoes

### Tipos de Status

- **Cadastro**: `'ATIVO' | 'INATIVO' | 'PENDENTE'` (UPPERCASE)
- **Solicitacao**: `'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'concluida'` (lowercase)
- **Documento**: `'rascunho' | 'finalizado' | 'enviado' | 'arquivado'` (lowercase)

### Tipo de Pessoa

- `'FISICA' | 'JURIDICA'` (UPPERCASE)

### Imports

- Prisma Client: `import { PrismaClient } from '@/lib/generated/prisma/client'`
- Componentes: importar dos barrel exports (`@/components/layout`, `@/components/feedback`)
- AppSidebar: importar direto de `./app-sidebar` (nao do barrel)

## Scripts

```bash
npm run dev            # Desenvolvimento
npm run build          # Build producao (Turbopack + type-check)
npm run lint           # ESLint
npm run test:unit      # Node.js test runner
npm run test:e2e       # Playwright
npm run db:seed        # Popular DB com mock data
npm run db:migrate     # Prisma migrations
npm run db:studio      # Prisma Studio
```

## Dead Code Cleanup (2026-04-12)

Limpeza realizada com knip:
- 39 arquivos deletados (31 UI components, 2 Prisma gerados, 6 outros)
- 26 dependencias removidas (radix-ui nao usados, autoprefixer, cmdk, date-fns, etc.)
- Exports mortos removidos de 14 arquivos
- Bugs de tipo corrigidos (mock data, prisma import, seed)
- Restante no knip: apenas auto-gerado do Prisma (nao editar)
