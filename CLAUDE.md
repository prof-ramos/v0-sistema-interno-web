# Sistema Interno Web — CLAUDE.md

## Stack

- **Framework**: Next.js 16.2.0 (App Router, Turbopack)
- **Linguagem**: TypeScript 5.7.3 (strict mode)
- **Estilo**: Tailwind CSS 4.2 + tw-animate-css
- **Componentes UI**: shadcn/ui (Radix primitives)
- **Validacao**: Zod
- **Estado**: Zustand (persist middleware, localStorage)
- **ORM**: Prisma 7.7 + @prisma/adapter-pg
- **Banco**: Vercel Postgres (Free Tier)
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
  prisma.ts             # Singleton PrismaClient (PrismaPg adapter)
store/                  # Zustand store (useAppStore)
docs/                   # Brand guidelines, Design System
e2e/                    # Playwright page objects + testes
tests/                  # Unit tests
prisma/                 # Schema + seed
```

## Convencoes

### Tipos de Status (TODOS UPPERCASE)

- **Cadastro**: `'ATIVO' | 'INATIVO' | 'PENDENTE'`
- **Solicitacao**: `'PENDENTE' | 'EM_ANALISE' | 'APROVADA' | 'REJEITADA' | 'CONCLUIDA'`
- **Documento**: `'RASCUNHO' | 'FINALIZADO' | 'ENVIADO' | 'ARQUIVADO'`
- **Prioridade**: `'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'`
- **TipoDocumento**: `'OFICIO' | 'MEMORANDO' | 'PORTARIA' | 'DECRETO' | 'CONTRATO' | 'OUTRO'`

### Tipo de Pessoa

- `'FISICA' | 'JURIDICA'`

### Imports

- Prisma Client: `import { PrismaClient } from '@/lib/generated/prisma/client'`
- Componentes: importar dos barrel exports (`@/components/layout`, `@/components/feedback`)
- AppSidebar: importar direto de `./app-sidebar` (nao do barrel)

### Vercel Postgres

- Env vars injetadas automaticamente pela Vercel: `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
- prisma.config.ts usa `POSTGRES_PRISMA_URL` com validacao
- lib/prisma.ts usa `PrismaPg` adapter com connection string
- Para dev local: configurar `.env` com `DATABASE_URL` apontando para o Vercel Postgres

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

## Historico

### Dead Code Cleanup (2026-04-12)

Limpeza realizada com knip:
- 39 arquivos deletados (31 UI components, 2 Prisma gerados, 6 outros)
- 26 dependencias removidas (radix-ui nao usados, autoprefixer, cmdk, date-fns, etc.)
- Exports mortos removidos de 14 arquivos
- Bugs de tipo corrigidos (mock data, prisma import, seed)
- Restante no knip: apenas auto-gerado do Prisma (nao editar)

### Migracao Vercel Postgres (2026-04-12)

- Commit b69ebd8: migracao arquitetural (provider postgresql, adapter-pg, prisma.config.ts)
- Neon Postgres provisionado via `vercel integration add neon`
- Tabelas criadas via `prisma db push` (Neon us-east-1)
- Env vars injetadas automaticamente (POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING)
- Migrations SQLite removidas, .env limpo
- **Status: CONCLUIDO**

### CodeRabbit Review — Plano de Acao (59 achados)

#### Corrigir

- **Alta**: UPPERCASE em todos os status/enums (StatusSolicitacao, Prioridade, TipoDocumento, Documento.status + consumidores)
- **Alta**: await params fora do try em `[id]/route.ts` (GET/PUT/DELETE)
- **Alta**: fetchCadastros sem error handling (AbortController, try/catch, resp.ok)
- **Alta**: Side effect em setState (handleFieldChange) — mover validacao para fora do updater
- **Alta**: Dialog nao fecha apos delete — setDeleteDialogOpen(false) no finally

- **Media**: catch(error: any) em routes — trocar por unknown + Prisma type guard UPPERCASE em todos os status/enums (StatusSolicitacao, Prioridade, TipoDocumento, Documento.status + consumidores)
- **Alta**: await params fora do try em `[id]/route.ts` (GET/PUT/DELETE)
- **Alta**: fetchCadastros sem error handling (AbortController, try/catch, resp.ok)
- **Alta**: Side effect em setState (handleFieldChange) — mover validacao para fora do updater
- **Alta**: Dialog nao fecha apos delete — setDeleteDialogOpen(false) no finally
- **Media**: catch(error: any) em routes — trocar por unknown + Prisma type guard
- **Media**: error-reporting.ts stack undefined — checar typeof antes de spread
- **Media**: parseInt sem NaN handling — isFinite check + defaults
- **Media**: partial().safeParse permite body vazio — checar Object.keys
- **Media**: deepEqual bugs — Error.cause, NaN, ArrayBuffer type mixing, boxed Number
- **Media**: use-validation tipos + setAllTouched no-op — alinhar genericos, implementar
- **Baixa**: CADASTRO_STATUS_COLORS para constants.ts
- **Baixa**: daysFromNow(-10) → daysAgo(10)
- **Baixa**: Import `z` nao usado
- **Baixa**: catch(e) sem log em routes
- **Baixa**: Seed: comentario deleteMany + remover `as any`
- **Baixa**: Playwright: Locator import inline (solicitacoes-page, documentos-page)
- **Baixa**: base-page.ts optional chaining inconsistente

#### Pular

- badgeVariants export (falso positivo — so uso interno)
- CSS variables font (falso positivo — encadeamento correto)
- CadastroStatusBadge accept both forms (coberto por UPPERCASE)
- STATUS_CADASTRO_LABELS lowercase keys (coberto por UPPERCASE)
- Spinner inline component (Spinner ja existe em ui/)
- prisma/schema.prisma missing url (em prisma.config.ts — falso positivo)
- prisma.ts caminho relativo (ja usa connection string do env — obsoleto)
- Zustand PII persist (melhorar comentario, refatorar na migracao API)

#### Migration PostgreSQL (fazer junto com db:push)

- Criar nova migration com CHECK constraints (email, telefone, cep, uf, numero)
- Adicionar indices adicionais (nome, status+tipo composto)
- Seed.ts: atualizar para usar Prisma enums em vez de `as any`
