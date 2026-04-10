# Brand Guidelines — ASOF

Diretrizes de marca e UI baseadas na implementação atual do site. Este documento consolida os tokens
e padrões já existentes na codebase, sem propor alterações.

## Identidade e tom

- Nome/assinatura: ASOF — Associação Nacional dos Oficiais de Chancelaria do Serviço Exterior
  Brasileiro.
- Tom visual: institucional, elegante, com foco em credibilidade e clareza.
- Linguagem: direta, objetiva, com voz ativa.

## Paleta de cores (tokens oficiais)

### Primárias

- Primary: `#040920` (principal)
- Primary Dark: `#0D2A4A`

### Acentos

- Accent: `#82b4d6`
- Accent Light: `#a0c8e4`

### Neutros

- Neutral: `#e7edf4`
- Branco: `#FFFFFF`

### Combinações acessíveis (WCAG)

- Texto em fundo claro:
  - `text-primary` (AAA)
  - `text-primary-dark` (AAA)
  - `text-slate-700` (AA)
- Texto em fundo escuro:
  - `text-white` (AAA)
  - `text-neutral` (AAA)
  - `text-accent` (AA)
  - `text-accent-light` (AA)
- Botões aprovados: `primary`, `accent`, `outline`, `ghost`, `outlineInverse` (Todos AA+)

## Tipografia

- Serif (títulos): Playfair Display (`font-serif`)
- Sans (corpo): Inter (`font-sans`)

### Escala tipográfica (Tailwind)

- `text-xs` 12px / 1.2
- `text-sm` 14px / 1.4
- `text-base` 16px / 1.5
- `text-lg` 18px / 1.5
- `text-xl` 20px / 1.6
- `text-2xl` 24px / 1.6
- `text-3xl` 30px / 1.5
- `text-4xl` 36px / 1.4
- `text-5xl` 48px / 1.3
- `text-6xl` 60px / 1.2
- `text-7xl` 72px / 1.1

### Uso recomendado

- Títulos e números-chave: `font-serif` + `font-semibold`/`font-bold`
- Corpo, navegação e CTAs: `font-sans`
- Uppercase para navegação e badges com `tracking-widest` ou `tracking-[0.2em]`
- Comprimento ideal de linha: `max-w-prose` (65ch)

## Espaçamento e grid

- Sistema 8pt: múltiplos de 8px
- Grid de referência: 4 colunas (mobile), 8 (tablet), 12 (desktop)
- Container padrão: `container mx-auto px-6`
- Seções padrão: `py-24`
- Gaps recorrentes: `gap-8` em grids

## Bordas, sombras e formas

- Raio base: `rounded-sm` (consistente em cards, botões, badges, inputs)
- Bordas discretas: `border-slate-200/300`
- Sombras: `shadow-sm` (base), `shadow-md`/`shadow-lg` em hover/elevação

## Componentes-chave

- Header fixo: topo escuro translúcido, scrolled claro com `shadow-sm`
  - Transição: `background-color`, `box-shadow` (200ms ease-out). Ver seção
    [Motion](#motion-e-interações).
- Botões:
  - `primary`: fundo primary + texto branco
  - `accent`: fundo accent + texto primary
  - `outline`: borda primary + fundo branco
  - `ghost`: borda slate + fundo branco
  - `outlineInverse`: branco em fundo escuro
  - Interação: Hover/Active com transição de `background-color` e `transform` (150ms fast). Ver
    seção [Motion](#motion-e-interações).
- Badges: uppercase, `text-sm`, `font-bold`, `rounded-sm`
- Cards: `bg-white`, padding 24px, hover com `shadow-md`
  - Interação: Hover com transição de `box-shadow` e `transform` (200ms ease-out). Ver seção
    [Motion](#motion-e-interações).

## Imagens e ícones

- Ícones: Lucide React (24–32px em cards)
- Imagens: foco institucional; usar overlays para contraste e `grayscale` parcial quando necessário
- Logos: manter proporções, evitar distorções e sombras pesadas

## Motion e interações

- Easing principal: `--ease-elegant` (cubic-bezier 0.22,1,0.36,1)
- Durações padrão: 150ms (fast), 400ms (normal), 800ms (elegant)
- Hover: leves lifts/scale, underline expand em links
- Respeitar `prefers-reduced-motion`

## Acessibilidade

- Contraste alvo: WCAG 2.1 AA (preferência AAA quando possível)
- Tamanho mínimo de toque: 48px
- Foco visível: `focus:ring-2` com `ring-accent` e `ring-offset-2`
- Redução de movimento respeitada globalmente

## Tom de conteúdo

- Cabeçalhos concisos e informativos
- CTAs diretos (ex.: “Acesse”, “Leia”, “Inscreva-se”)
- Evitar jargões; manter linguagem institucional

## Referências na codebase

- Tokens e cores: `tailwind.config.ts`
- Sistema de design: `docs/design-system.md`
- Brand kit consolidado: `brandkit-asof.md`
- Motion e timings: `app/globals.css`, `lib/motion-config.ts`, `lib/motion-variants.ts`
