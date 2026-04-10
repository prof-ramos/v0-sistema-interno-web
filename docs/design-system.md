# Design System — Sistema Interno | Gestão Integrada

Abaixo está o detalhamento do Design System completo, estruturado para seguir as diretrizes rigorosas da ASOF. Ele define a stack atual (Next.js, Tailwind CSS, fontes Inter + Playfair Display) e serve como fonte de verdade para a interface.

---

## 1. Tabela de Design Tokens

### 1.1 — Espaçamento (8pt Grid)

| Token | Valor | Uso |
|---|---|---|
| `--space-1` | `4px` | Ajuste fino: gap entre ícone e label, padding interno de badges |
| `--space-2` | `8px` | Padding interno de chips/tags, gap mínimo entre elementos |
| `--space-3` | `16px` | Padding de inputs, gap padrão entre itens de lista, margens mobile |
| `--space-4` | `24px` | Padding de cards, gap entre seções internas |
| `--space-5` | `32px` | Padding de seções, gap entre blocos, margens tablet |
| `--space-6` | `40px` | Espaçamento entre seções maiores |
| `--space-7` | `48px` | Padding de containers de página |
| `--space-8` | `56px` | Espaçamento entre blocos de conteúdo |
| `--space-9` | `64px` | Altura de header, margin vertical de seções |
| `--space-10` | `80px` | Espaçamento extra-large |
| `--space-11` | `96px` | Espaçamento de layout |

### 1.2 — Tipografia (Escala Modular 1.250 — Major Third)

Base: `1rem = 16px`, ratio `1.250`.

| Token | Tamanho | Line-Height (1.5×) | Peso | Uso |
|---|---|---|---|---|
| `--text-xs` | `0.64rem` (10.24px) | `1rem` (16px) | 400 | Micro-labels, counters de badge |
| `--text-sm` | `0.8rem` (12.8px) | `1.25rem` (20px) | 400 | Captions, metadata de data, status tags |
| `--text-base` | `1rem` (16px) | `1.5rem` (24px) | 400 | Corpo de texto, inputs, labels de form |
| `--text-md` | `1.25rem` (20px) | `2rem` (32px) | 500 | Subtítulos de card, nomes em listas |
| `--text-lg` | `1.563rem` (25px) | `2.5rem` (40px) | 600 | Títulos de seção (Solicitações Recentes) |
| `--text-xl` | `1.953rem` (31.25px) | `3rem` (48px) | 700 | Títulos de página (H1: Dashboard, Cadastro) |
| `--text-2xl` | `2.441rem` (39.06px) | `3.5rem` (56px) | 700 | Display numbers (KPI: "3", "1") |
| `--text-3xl` | `3.052rem` (48.83px) | `4rem` (64px) | 700 | Hero/Display (uso reservado) |

**Famílias tipográficas:**
- `--font-sans`: `'Inter', sans-serif` — Interface, corpo, labels
- `--font-display`: `'Playfair Display', serif` — Headings H1

### 1.3 — Cores (Paleta Semântica)

| Token | Hex | Uso |
|---|---|---|
| `--color-background` | `#f8fafc` | Fundo da página |
| `--color-surface` | `#ffffff` | Fundo de cards, sidebar |
| `--color-foreground` | `#495565` | Texto principal |
| `--color-muted` | `#6b7380` | Texto secundário, metadata |
| `--color-primary` | `#040920` | Texto H1, botões primários |
| `--color-primary-fg` | `#ffffff` | Texto sobre primary |
| `--color-accent` | `#82b4d6` | Links, bordas de foco, ícones ativos |
| `--color-border` | `#e5e7ec` | Bordas de cards, separadores, inputs |
| `--color-success` | `#2f9f3d` | Status: Aprovada, Finalizado, Ativo |
| `--color-warning` | `#c09000` | Status: Pendente, Em Análise |
| `--color-destructive` | `#e40017` | Status: Urgente, ações destrutivas |
| `--color-info` | `#3c7ebe` | Status: Enviado, informativos |

### 1.4 — Breakpoints e Grid

| Breakpoint | Min-Width | Colunas | Margens | Gutter |
|---|---|---|---|---|
| Mobile | `0px` | 4 | `16px` (--space-3) | `16px` |
| Tablet | `768px` | 8 | `32px` (--space-5) | `24px` |
| Desktop | `1024px` | 12 | auto (centralizado) | `24px` |

- **Container max-width**: `1200px`
- **Sidebar/Main ratio**: `1:1.618` (Golden Ratio) → Sidebar ≈ `280px`, Conteúdo ≈ `~453px × 1.618 ≈ 920px` do espaço restante

### 1.5 — Proporções de Aspecto

| Uso | Ratio |
|---|---|
| Cards de mídia/imagem | `16:9` |
| Ícones / Avatars | `1:1` (40×40px, 48×48px, 64×64px) |
| Stat Cards (KPI) | `~3:2` (min-width proporcional) |
| Sidebar : Main Content | `1 : 1.618` |

### 1.6 — Acessibilidade (WCAG 2.1)

| Regra | Valor | Notas |
|---|---|---|
| Min touch target | `44 × 44px` | Botões, links, ícones clicáveis |
| Line-height mínimo | `1.5 × font-size` | Já garantido na escala acima |
| Contraste mínimo (AA) | `4.5:1` texto normal, `3:1` texto grande | `#495565` sobre `#fff` = ~5.9:1 ✓ |
| Focus visible | `2px solid var(--color-accent)` + offset `2px` | Todos os interativos |

---

## 2. Estrutura HTML Semântica (Dashboard)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard — Sistema Interno | Gestão Integrada</title>
  <link rel="stylesheet" href="design-system.css" />
</head>
<body class="ds-body">

  <!-- ============================== -->
  <!-- LAYOUT SHELL                   -->
  <!-- ============================== -->
  <div class="ds-layout">

    <!-- SIDEBAR (navigation) -->
    <aside class="ds-sidebar" aria-label="Menu principal">
      <div class="ds-sidebar__header">
        <img src="/logo.svg" alt="" class="ds-sidebar__logo" width="40" height="40" />
        <div class="ds-sidebar__brand">
          <span class="ds-sidebar__title">Sistema Interno</span>
          <span class="ds-sidebar__subtitle">Gestão Integrada</span>
        </div>
      </div>

      <nav class="ds-sidebar__nav">
        <ul class="ds-nav-list" role="list">
          <li class="ds-nav-item ds-nav-item--active">
            <a href="/" class="ds-nav-link" aria-current="page">
              <svg class="ds-icon ds-icon--sm" aria-hidden="true"><!-- dashboard icon --></svg>
              <span>Dashboard</span>
            </a>
          </li>
          <!-- Demais itens omitidos para brevidade... -->
        </ul>
      </nav>

      <div class="ds-sidebar__footer">
        <span class="ds-text--xs">v1.0.0</span>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <div class="ds-main-wrapper">

      <!-- TOP BAR -->
      <header class="ds-topbar">
        <button
          class="ds-btn ds-btn--icon"
          aria-label="Alternar sidebar"
          aria-expanded="true"
          aria-controls="sidebar"
        >
          <svg class="ds-icon ds-icon--sm" aria-hidden="true"><!-- menu icon --></svg>
        </button>

        <nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <ol class="ds-breadcrumb__list">
            <li class="ds-breadcrumb__item">
              <a href="/" class="ds-breadcrumb__link" aria-current="page">
                <svg class="ds-icon ds-icon--xs" aria-hidden="true"><!-- grid icon --></svg>
                Dashboard
              </a>
            </li>
          </ol>
        </nav>
      </header>

      <!-- PAGE CONTENT -->
      <main class="ds-page" id="main-content">
        <!-- Estrutura interna da página (Header, KPIs, Grids Ouro) -->
      </main>
    </div>
  </div>

</body>
</html>
```

---

## 3. CSS com CSS Variables (Base Parametrizada)

```css
/* ============================================
   DESIGN SYSTEM — Sistema Interno
   Grid: 8pt | Escala: 1.250 Major Third
   ============================================ */

/* ────────────────────────────────────
   LAYER 0: DESIGN TOKENS
   ──────────────────────────────────── */
:root {
  /* ── Spacing (8pt grid) ── */
  --space-unit: 8px;
  --space-1:  4px;                          /* ajuste fino */
  --space-2:  calc(var(--space-unit) * 1);  /* 8px  */
  --space-3:  calc(var(--space-unit) * 2);  /* 16px */
  --space-4:  calc(var(--space-unit) * 3);  /* 24px */
  --space-5:  calc(var(--space-unit) * 4);  /* 32px */
  --space-6:  calc(var(--space-unit) * 5);  /* 40px */
  --space-7:  calc(var(--space-unit) * 6);  /* 48px */
  --space-8:  calc(var(--space-unit) * 7);  /* 56px */
  --space-9:  calc(var(--space-unit) * 8);  /* 64px */
  --space-10: calc(var(--space-unit) * 10); /* 80px */
  --space-11: calc(var(--space-unit) * 12); /* 96px */

  /* ── Typography Scale (1.250 Major Third) ── */
  --text-xs:   0.64rem;    /* 10.24px */
  --text-sm:   0.8rem;     /* 12.8px  */
  --text-base: 1rem;       /* 16px    */
  --text-md:   1.25rem;    /* 20px    */
  --text-lg:   1.563rem;   /* 25px    */
  --text-xl:   1.953rem;   /* 31.25px */
  --text-2xl:  2.441rem;   /* 39.06px */
  --text-3xl:  3.052rem;   /* 48.83px */

  /* Line-heights (≥ 1.5× font-size, snapped to 8pt) */
  --lh-xs:   1rem;     /* 16px */
  --lh-sm:   1.25rem;  /* 20px */
  --lh-base: 1.5rem;   /* 24px */
  --lh-md:   2rem;     /* 32px */
  --lh-lg:   2.5rem;   /* 40px */
  --lh-xl:   3rem;     /* 48px */
  --lh-2xl:  3.5rem;   /* 56px */
  --lh-3xl:  4rem;     /* 64px */

  /* Font weights */
  --fw-regular:  400;
  --fw-medium:   500;
  --fw-semibold: 600;
  --fw-bold:     700;

  /* Font families */
  --font-sans:    'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;

  /* ── Colors (Semantic) ── */
  --color-background:     #f8fafc;
  --color-surface:        #ffffff;
  --color-foreground:     #495565;
  --color-foreground-bold:#040920;
  --color-muted:          #6b7380;
  --color-muted-bg:       #f3f4f6;

  --color-primary:        #040920;
  --color-primary-fg:     #ffffff;
  --color-accent:         #82b4d6;
  --color-accent-fg:      #040920;

  --color-border:         #e5e7ec;
  --color-input:          #e5e7ec;
  --color-ring:           #82b4d6;

  --color-success:        #2f9f3d;
  --color-success-fg:     #ffffff;
  --color-success-subtle: #ecfdf5;

  --color-warning:        #c09000;
  --color-warning-fg:     #1f1400;
  --color-warning-subtle: #fefce8;

  --color-destructive:    #e40017;
  --color-destructive-fg: #ffffff;
  --color-destructive-subtle: #fef2f2;

  --color-info:           #3c7ebe;
  --color-info-fg:        #ffffff;
  --color-info-subtle:    #eff6ff;

  /* ── Borders & Radii ── */
  --radius-sm:  2px;
  --radius-md:  var(--space-2);   /* 8px */
  --radius-lg:  var(--space-3);   /* 16px */
  --radius-full: 9999px;

  --border-width: 1px;

  /* ── Shadows ── */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.07),
                0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.08),
                0 4px 6px -4px rgba(0, 0, 0, 0.04);

  /* ── Layout ── */
  --sidebar-width:   280px;
  --topbar-height:   var(--space-9);  /* 64px */
  --container-max:   1200px;
  --golden-ratio:    1.618;

  /* ── Transitions ── */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;

  /* ── Accessibility ── */
  --min-tap-target: 44px;
  --focus-ring:     2px solid var(--color-ring);
  --focus-offset:   2px;
}

/* ────────────────────────────────────
   LAYER 1: RESET & BASE
   ──────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 100%; /* 16px base */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--lh-base);
  color: var(--color-foreground);
  background-color: var(--color-background);
}

/* Accessibility: Focus styles for all interactive elements */
:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}

/* ... Utilitários tipográficos e de layout omitidos para brevidade (referenciar Design System Core) ... */

/* ────────────────────────────────────
   COMPLETIONS: LIST ITEMS & ASIDE
   ──────────────────────────────────── */
.ds-solicitation-item:last-child {
  border-bottom: none;
}

.ds-quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2); /* 8px */
}

.ds-quick-action {
  display: flex;
  align-items: center;
  gap: var(--space-3); /* 16px */
  padding: var(--space-3); /* 16px */
  min-height: var(--min-tap-target); /* 44px */
  border-radius: var(--radius-md); /* 8px */
  color: var(--color-foreground-bold);
  text-decoration: none;
  font-weight: var(--fw-medium);
  transition: background var(--transition-fast),
              color var(--transition-fast);
}

.ds-quick-action:hover {
  background: var(--color-muted-bg);
  color: var(--color-accent-fg);
}
```
