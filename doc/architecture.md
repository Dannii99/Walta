# Frontend Architecture

## 1. Architecture Status

**REAL, NO PROPOSED.** This document describes the architecture of the **shipped MVP** of **Walta — Tu dinero, más claro**, not an initial proposal. The codebase has gone through:

- **Phase 1-2**: Foundations (Next.js 16, Prisma 7 + Neon, Auth.js v5, Tailwind v4, shadcn/ui, Recharts, Framer Motion, Sonner)
- **Phase 3**: Onboarding (4-step wizard: WelcomeStep → TemplateStep → IncomeStep → ReviewStep)
- **Phase 4**: Dashboard Visual (KPI cards, Hero donut, Health cards, Category breakdown, Add expense modal)
- **Phase 5**: Expenses module (renamed from `transactions` to `gastos` in UI, domain model is still `Transaction`)
- **Phase 6**: Rules module (`/reglas`) — 3 tabs: Income, Rule, Categories
- **Phase 7**: Simulations module (`/simulations`) — vehicle + housing + personal + other types, AI advisor + insights
- **Phase 8**: Loans / Credits module (`/credits`) — full loan tracker with amortization, fees, payments, extras, AI advisor + insights
- **Phase 9**: History module (`/history`) — refactored from "monthly closing" to **"decisions timeline"** (events derived on-the-fly from `Simulation` + `Loan` + `LoanPayment` + `LoanExtraPayment`)
- **Phase 10**: Settings (`/settings`) — theme selector + account
- **Phase 11**: AI module — GROQ integration (`llama-3.3-70b-versatile`) for 4 features (sim advisor, sim insights, loan advisor, loan insights) with 2-level cache (DB 24h + memory 1h)
- **Phase 12**: Dev cleanup — Tremor removal, Recharts wrapper pattern audit, dark mode everywhere

The architecture evolved organically from the original proposal (see `setup-plan.md` for the original). Major pivots:

1. **PWA was abandoned**: `next-pwa` is incompatible with Next.js 16 + Turbopack. The dependency is still in `package.json` but **not wired in `next.config.ts`**. The `/offline` page is a static fallback.
2. **Zustand is unused**: The dependency is in `package.json` (legacy from initial scaffolding) but has **zero imports in source code**. Client state is managed with `useState` + `useTransition` + Server Actions.
3. **TanStack Query is configured but rarely used**: It's in `app/providers.tsx` for future use, but the current data flow is **Server Component → `prisma.find*` directly → render**. Mutations use Server Actions + `revalidatePath`. No `useQuery` in production pages.
4. **Dinero.js is used only in `lib/currency.ts`**: Most UI formatting uses `Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" })` directly via `formatCOP(amount)`. Dinero.js exists for `addMoney` / `subtractMoney` / `multiplyMoney` helpers but is not the default code path.
5. **`middleware.ts` was renamed to `proxy.ts`** per the Next.js 16 deprecation notice. The file is a thin auth wrapper that redirects unauthenticated users from `/` and `/dashboard/*` to `/login`.

## 2. Technology Decision

**Framework selected: Next.js 16.2.6 (App Router)**

**Why Next.js (still valid):**

1. **Full-stack integrated**: Server Actions + Prisma + Neon eliminate the need for a separate backend. Mutations are 1 function, no API routes.
2. **Server Components**: Auth + DB query + render happens in one trip. The dashboard fetches budget + transactions + computes KPIs + renders — all server-side, zero JS shipped for the data layer.
3. **Ecosistema visual**: shadcn/ui + Recharts + Framer Motion is the most mature combination for "Stripe-quality" dashboards.
4. **Type safety end-to-end**: Prisma + Zod + TypeScript. No `any` in business logic.

**Alternatives not chosen (still not chosen):**

- *React + Vite*: Requires a separate backend for Prisma/Neon. The MVP grows naturally in one project.
- *Vue + Nuxt*: Good DX, but the shadcn-style component ecosystem is much smaller in Vue.
- *Angular*: Too verbose for an MVP.

## 3. Context

**Product**: A personal budget control web app that **replaces spreadsheets with a visual, interactive, decision-oriented experience**. Users create budgets, register income and categorized expenses, see their financial health via graphs and color indicators, evaluate if they follow healthy financial rules (e.g. 50/30/20 distribution), and simulate major decisions (vehicle, housing, savings goals) to understand if they're viable against their real budget capacity.

The MVP and its iterations cover: budget creation, dashboard, expenses tracking, rule editing, simulations, credit tracking, decision timeline, and AI-assisted insights. The product is web-only (no native mobile), uses a single currency (COP), and has a hardcoded demo user (no multi-tenant auth in the MVP).

## 4. Final Stack

Versions are exact, taken from `package.json` at the time of writing.

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| **Framework** | Next.js (App Router) | 16.2.6 | Active. Uses Turbopack default. |
| **Language** | TypeScript | 5.x (strict) | Active. |
| **UI runtime** | React | 19.2.4 | Active. |
| **Database** | Neon Postgres (serverless) | 1.1.0+ | Active. Connection via `PrismaNeon` adapter. |
| **ORM** | Prisma | 7.8.0 | Active. Client generated to `generated/prisma/`. |
| **Styling** | TailwindCSS | 4.x | Active. **CSS-based config** via `@theme inline` in `app/globals.css`. **No `tailwind.config.ts`**. |
| **UI components** | shadcn/ui (style: base-nova) | manual install | Active. 13 components in `components/ui/`. |
| **Charts** | Recharts | 3.8.1 | Active. Used in 4 modules (dashboard, credits, history, simulations). |
| **Animations** | Framer Motion | 12.40.0 | Active. Used in counters, stagger, page transitions, `AnimatePresence`. |
| **Icons** | Lucide React | 1.17.0+ | Active. **All icons are Lucide** (no heroicons, no react-icons). |
| **Forms** | React Hook Form + Zod | 7.76.1 / 4.4.3 | Active. `@hookform/resolvers` 5.4.0. |
| **Auth** | Auth.js v5 (NextAuth) | 5.0.0-beta.31 | Active. JWT strategy, hardcoded CredentialsProvider. |
| **Server state** | TanStack Query | 5.100.14 | **Configured but not used** in production pages. In `app/providers.tsx` for future. |
| **Client state** | (none) | — | Local `useState` + `useTransition`. No global store. |
| **State (Client)** | Zustand | 5.0.14 | **Installed but unused**. Legacy from scaffolding. Candidate for removal. |
| **Decimal precision** | Dinero.js | 2.0.2 | **Used only in `lib/currency.ts`**. UI uses `Intl.NumberFormat` + `formatCOP`. |
| **Theming** | next-themes | 0.4.6 | Active. `attribute="class"`, `storageKey="walta-theme"`, `disableTransitionOnChange`. |
| **Toasts** | sonner | 2.0.7 | Active. `<Toaster position="top-right" richColors />` in `app/providers.tsx`. |
| **PWA** | next-pwa | 5.6.0 | **DISABLED**. In `package.json` but NOT in `next.config.ts`. Incompatible with Next 16 + Turbopack. `/offline` page is a static fallback. |
| **AI** | GROQ (via fetch) | llama-3.3-70b-versatile | Active. Wrapper in `lib/ai/groq-client.ts`. Zod validation. 2-level cache. |
| **Animation lib (CSS)** | tw-animate-css | 1.4.0 | Active. Required by Tailwind v4 for animate utilities. |
| **Money input** | Custom `CurrencyInput` | manual | Active. Colombian thousands mask. |
| **Testing** | Vitest | 4.1.7 | Active. **119 unit tests** across 9 files. |
| **E2E testing** | Playwright | 1.60.0 | **Installed but no specs**. Used for ad-hoc smoke tests. |
| **Lint** | ESLint (flat config) | 9.x | Active. `eslint.config.mjs` with `eslint-config-next`. |

**Removed in dev cleanup**:
- `@tremor/react` — removed from `package.json` and `node_modules`. Was 0 imports in source code.
- `tailwind.config.ts` — never created. Tailwind v4 uses `@theme inline` in CSS.

## 5. Real Structure

The repository as it exists today. Generated from `ls`. **Not the proposed structure from the original architecture doc.**

```
presupuesto-app/
├── app/                              # Next.js App Router
│   ├── (auth)/
│   │   └── login/page.tsx            # Login page (public, Auth.js)
│   ├── (dashboard)/                  # Protected route group (sidebar layout)
│   │   ├── layout.tsx                # Sidebar + DashboardProvider + content
│   │   ├── page.tsx                  # Redirects to /dashboard
│   │   ├── dashboard/page.tsx        # Dashboard (KPIs, donut, health cards)
│   │   ├── dashboard/loading.tsx
│   │   ├── dashboard/error.tsx
│   │   ├── expenses/                 # /expenses — Gastos module
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── simulations/              # /simulations — Simulaciones module
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       ├── error.tsx
│   │   │       └── not-found.tsx
│   │   ├── reglas/                   # /reglas — Reglas module
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── credits/                  # /credits — Créditos module
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       ├── error.tsx
│   │   │       ├── not-found.tsx
│   │   │       └── edit/page.tsx
│   │   ├── history/                  # /history — Historial (timeline)
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── settings/                 # /settings — Configuración
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── loading.tsx               # Default group loading
│   │   └── error.tsx                 # Default group error
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts  # Auth.js handlers (re-exported from lib/auth)
│   ├── onboarding/                   # /onboarding — Top-level (NOT in dashboard group)
│   │   └── page.tsx                  # 4-step wizard
│   ├── offline/page.tsx              # Static /offline fallback
│   ├── layout.tsx                    # Root layout (Inter font, providers, html lang="es")
│   ├── providers.tsx                 # SessionProvider > ThemeProvider > QueryClientProvider > Toaster
│   ├── globals.css                   # Tailwind v4 @theme inline + dark mode custom variant
│   └── page.tsx                      # Root: redirect to /login or /dashboard
│
├── components/
│   ├── auth/                         # Login form pieces
│   │   ├── LoginForm.tsx
│   │   ├── LoginHero.tsx
│   │   ├── OAuthButton.tsx
│   │   ├── FeaturePill.tsx
│   │   └── TrustChip.tsx
│   ├── dashboard/                    # 12 components: DashboardContent, KPICard, CategoryDonutChart, etc.
│   ├── expenses/                     # 10 components: ExpensesClient, AddExpenseModal, ExpenseList, etc.
│   ├── simulations/                  # 15 components: SimulationsClient, SimulatorForm, AIAdvisorCard, AIInsightsBanner, etc.
│   ├── reglas/                       # 5 components: ReglasClient, Tabs, IncomeEditor, RuleEditor, CategoryManager
│   ├── credits/                      # 25 components: CreditCard, LoanForm, AILoanAdvisorCard, AvailableCreditCard, etc.
│   ├── history/                      # 11 components: Timeline, TimelineEvent, EventIcon, Tabs, etc.
│   ├── settings/                     # 3 components: ThemeSelector, AccountSection
│   ├── onboarding/                   # 6 components: OnboardingFlow + 4 step components + StepIndicator
│   ├── shared/                       # 4 components: Sidebar, MobileBottomNav, ThemeToggle, SaasHeader
│   └── ui/                           # 13 shadcn components: button, card, input, dialog, alert, alert-dialog, etc.
│
├── lib/
│   ├── prisma.ts                     # Singleton + PrismaNeon adapter
│   ├── auth.ts                       # NextAuth config (Credentials hardcoded)
│   ├── currency.ts                   # Dinero.js + formatCOP helper
│   ├── constants.ts                  # DEFAULT_BUDGET_RULE, REFERENCE_RATES, HEALTH_THRESHOLDS
│   ├── categories.ts                 # PREDEFINED_CATEGORIES (27) + OTHER_CATEGORY_KEY
│   ├── recurrence.ts                 # Recurrence (MONTHLY/BIWEEKLY/ONE_TIME) helpers
│   ├── dashboard-helpers.ts          # computeHealthStatus, formatMonthName, getDynamicMessage
│   ├── simulation-engine.ts          # Pure math: calculateFrenchEA, calculateNominalMonthly, getVerdict, VERDICT_CONFIG
│   ├── simulation-types.ts           # Simulation domain types, parsers, labels, ENGINE_TO_DB map
│   ├── credit-engine.ts              # getLoanSummary (moved from simulation-engine), LOAN_HEALTH_CONFIG, getLoanHealthFromCapacity
│   ├── credit-types.ts               # Loan types (LOAN_TYPES, LOAN_STATUSES, LOAN_FORMULA_LABELS), parsers, parseLoan
│   ├── loan-engine.ts                # generateAmortizationSchedule, calculateRemainingBalance, getProjectedPayoffDate, getDaysOverdue
│   ├── loan-fees.ts                  # getFeeIcon (Lucide picker), calculateTotalMonthlyFees, calculateTotalUpfrontFees
│   ├── timeline-types.ts             # TimelineEvent discriminated union, Zod schemas, labels, buildEventId
│   ├── utils.ts                      # cn() — clsx + tailwind-merge
│   └── ai/                           # AI module (8 files)
│       ├── groq-client.ts            # callGroqChat with retry + 5 typed errors
│       ├── schemas.ts                # AdvisorAnalysisSchema, InsightsResponseSchema + aliases for loans
│       ├── prompts.ts                # SIM_ADVISOR_SYSTEM, SIM_INSIGHTS_SYSTEM, builders
│       ├── loan-prompts.ts           # LOAN_ADVISOR_SYSTEM, LOAN_INSIGHTS_SYSTEM, builders
│       ├── simulation-advisor.ts     # generateSimulationAdvisorAnalysis — DB cache 24h
│       ├── simulation-insights.ts    # generateSimulationInsights — memory cache 1h
│       ├── loan-advisor.ts           # generateLoanAdvisorAnalysis — memory cache 24h
│       └── loan-insights.ts          # generateLoanInsights — memory cache 1h
│
├── server/
│   ├── actions/                      # 8 server actions
│   │   ├── budget-actions.ts
│   │   ├── category-actions.ts
│   │   ├── transaction-actions.ts
│   │   ├── simulation-actions.ts
│   │   ├── loan-actions.ts
│   │   ├── snapshot-actions.ts
│   │   ├── timeline-actions.ts
│   │   └── ai-actions.ts
│   └── queries/                      # 5 query files
│       ├── budget-queries.ts
│       ├── transaction-queries.ts
│       ├── simulation-queries.ts
│       ├── loan-queries.ts
│       └── timeline-queries.ts
│
├── hooks/
│   ├── use-budget.ts                 # legacy/scaffolding
│   └── use-simulation.ts             # legacy/scaffolding
│
├── types/
│   └── index.ts                      # Domain types mirroring Prisma (User, Budget, Category, Transaction, Simulation, MonthlySnapshot, Loan, LoanPayment, LoanExtraPayment, TimelineEvent, FeeItem, etc.)
│
├── prisma/
│   └── schema.prisma                 # 9 models
│
├── tests/
│   ├── unit/                         # 9 test files, 119 tests
│   │   ├── currency.test.ts
│   │   ├── simulation-engine.test.ts
│   │   ├── loan-engine.test.ts
│   │   ├── timeline-queries.test.ts  # 19 tests (added in Phase 9 refactor)
│   │   ├── ai-prompt-builder.test.ts
│   │   ├── groq-client.test.ts
│   │   ├── loan-prompts.test.ts
│   │   ├── loan-advisor.test.ts
│   │   └── loan-insights.test.ts
│   └── stubs/
│       └── server-only.ts            # Empty export stub for vitest
│
├── scripts/                          # Manual + seed scripts
│   ├── seed-timeline-demo.ts         # Idempotent seed (upsert) for /history demo data
│   ├── test-ai-prompt.ts             # Smoke test for simulation AI prompts
│   └── test-loan-ai.ts               # Smoke test for loan AI prompts
│
├── public/
│   ├── manifest.json                 # PWA manifest (legacy, not registered)
│   └── icons/                        # PWA icons (legacy)
│
├── doc/                              # This folder
│   ├── README.md                     # Doc index
│   ├── project-context.md            # Product spec
│   ├── architecture.md               # This file
│   ├── setup-plan.md                 # Dev onboarding guide
│   └── module-reference.md           # Per-module reference
│
├── generated/prisma/                 # Auto-generated by `npx prisma generate` (gitignored)
│
├── .env                              # DB + Auth + GROQ secrets (gitignored)
├── AGENTS.md                         # Quickstart (auto-loaded by opencode)
├── CLAUDE.md                         # @AGENTS.md (symlink for Claude)
├── README.md                         # GitHub landing
├── components.json                   # shadcn config (style: base-nova)
├── eslint.config.mjs                 # Flat ESLint config
├── next.config.ts                    # { turbopack: {} } only — PWA not wired
├── next-env.d.ts                     # Next.js generated
├── next-pwa.d.ts                     # next-pwa type defs
├── package.json
├── package-lock.json
├── postcss.config.mjs                # @tailwindcss/postcss
├── prisma.config.ts                  # dotenv/config + prisma/config
├── proxy.ts                          # Next.js 16 auth wrapper (renamed from middleware.ts)
├── tsconfig.json                     # strict + @/* alias
├── tsconfig.tsbuildinfo              # tsc cache
└── vitest.config.ts                  # jsdom, globals, server-only alias, next-auth inline
```

**Note on empty directories**: `components/budget/` and `components/charts/` (mentioned in the original architecture proposal) were never populated. The corresponding components live in module-specific folders (`components/dashboard/`, `components/credits/`, etc.).

## 6. Architecture Goals

1. **Visual-first**: Dashboards render fast with KPIs, big numbers, animations. No lag.
2. **Time-to-value < 5 min**: 4-step onboarding creates a budget in <2 min. The dashboard loads the budget directly via Server Component (no client fetch).
3. **Growth without rewrite**: Adding a new module (e.g. savings goals) is a new route + server actions + components. The framework doesn't impose limits.
4. **Decimal precision**: `Decimal` in Prisma, `string` in JSON, `number` only after explicit conversion. Verified in `lib/credit-engine.ts`, `lib/dashboard-helpers.ts`, `lib/simulation-engine.ts`.
5. **Type safety end-to-end**: Prisma types + Zod parsers (`parseSimulationInputs`, `parseSimulationResult`, `parseLoan`, `parseLoanInputs`, `parseLoanResult`) defensive against malformed JSON in DB.
6. **No client store needed**: The state model is **URL → Server Component → render** for reads, **Server Action → `revalidatePath` → re-render** for writes. No global client state.
7. **AI without latency**: GROQ calls return in 1-3s. Cache 2-level (DB 24h for advisors, memory 1h for insights) keeps repeat views instant.

## 7. Hybrid Pattern: Server Components + Client Islands + Server Actions

### Server Components (default)

Every page in `app/(dashboard)/*/page.tsx` is a Server Component that:
1. Calls `auth()` to get the user.
2. Calls `prisma.find*` (or a query helper from `server/queries/`).
3. Computes derived data (KPIs, health, donut data).
4. Passes plain serializable props to a Client Component orchestrator.

Example (`app/(dashboard)/dashboard/page.tsx`):
- Fetches `prisma.budget.findFirst({ include: { categories: { include: { transactions } } } })`.
- Computes `income`, `expenses`, `available`, `healthStatus`, `donutData`, `categoriesBreakdown`.
- Passes them to `<DashboardContent />` (a Client Component that orchestrates layout).

### Client Islands

- **Form components**: `SimulatorForm`, `LoanForm`, `AddExpenseModal`, `CategoryManager` — interactive, use `useState` + `useTransition`.
- **Charts**: Recharts requires client. All 4 chart components are `"use client"`.
- **Filters / Tabs**: `CreditsFilters`, `SimulationsFilters`, `TimelineFilters`, `Tabs` (multiple variants) — URL sync via `useRouter` + `useSearchParams`.
- **Theme toggle**: `ThemeToggle`, `ThemeSelector` — `useTheme` from `next-themes`.
- **AI cards**: `AIAdvisorCard`, `AIInsightsBanner`, `AILoanAdvisorCard`, `AILoanInsightsBanner` — call server actions, manage `useTransition` + `useEffect`.

### Mutations: Server Actions + revalidatePath

The canonical pattern:
```typescript
// server/actions/loan-actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createLoan(input: CreateLoanInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  // ... zod parse + business logic + prisma.loan.create
  revalidatePath("/credits");
  revalidatePath(`/credits/${loan.id}`);
}
```

`loan-actions.ts` also calls `invalidateLoanAdvisorCache(userId, loanId)` on every mutation (create/update/delete loan, record/delete payment, record/delete extra) to ensure AI responses reflect fresh data.

### No TanStack Query in production

TanStack Query is configured in `app/providers.tsx` for future use, but no production page calls `useQuery` today. The dashboard, expenses, simulations, rules, credits, and history all use **Server Component → props → Client Component**. The queryClient has `staleTime: 60_000` + `refetchOnWindowFocus: false` as defaults.

## 8. Feature Organization

The app has 8 main user-facing modules. Each one is described in detail in `module-reference.md`. Summary:

| Module | Route | Status | AI? |
|--------|-------|--------|-----|
| Auth | `/login` | Hardcoded demo user | No |
| Onboarding | `/onboarding` | 4-step wizard | No |
| Dashboard | `/dashboard` | KPIs + donut + health + breakdown | No |
| Gastos (Expenses) | `/expenses` | CRUD + filters + recurrence | No |
| Reglas (Rules) | `/reglas` | 3 tabs: Income, Rule, Categories | No |
| Simulaciones | `/simulations` | 4 types + advisor + insights | Yes |
| Créditos (Loans) | `/credits` | Loan tracker + amortization + advisor | Yes |
| Historial (History) | `/history` | Decision timeline (5 event types) | No |
| Configuración (Settings) | `/settings` | Theme + account | No |

## 9. Data & API Integration

### Prisma Schema (current)

9 models. All use `Decimal(15, 2)` for money, `String` for enums (Prisma enums not used), `Json` for flexible payloads (`inputs`, `result`, `aiAnalysis`, `fees`, `rule`, `categoryBreakdown`).

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  budgets     Budget[]
  simulations Simulation[]
  loans       Loan[]
  createdAt   DateTime @default(now())
}

model Budget {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  name       String
  income     Decimal  @db.Decimal(15, 2)
  currency   String   @default("COP")
  rule       Json     // { needs: 50, wants: 30, savings: 20 }
  categories Category[]
  snapshots  MonthlySnapshot[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Category {
  id           String   @id @default(cuid())
  budgetId     String
  budget       Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  name         String
  type         String   // NEEDS, WANTS, SAVINGS, DEBT
  color        String
  transactions Transaction[]
}

model Transaction {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  amount      Decimal  @db.Decimal(15, 2)
  description String?
  date        DateTime @default(now())
  recurrence  String   @default("MONTHLY") // MONTHLY | BIWEEKLY | ONE_TIME
  createdAt   DateTime @default(now())
}

model Simulation {
  id                    String    @id @default(cuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id])
  type                  String    // VEHICLE, HOUSING, PERSONAL, OTHER
  title                 String
  inputs                Json      // { price, downPayment, term, rate, formula }
  result                Json      // { monthlyPayment, verdict, availableAfter, totalInterest, totalCost }
  aiAnalysis            String?   // JSON: { verdict_explanation, recommendations, risks, alternative_suggestion }
  aiAnalysisGeneratedAt DateTime?
  createdAt             DateTime  @default(now())
}

model MonthlySnapshot {
  id                String   @id @default(cuid())
  budgetId          String
  budget            Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  month             Int
  year              Int
  income            Decimal  @db.Decimal(15, 2)
  totalExpenses     Decimal  @db.Decimal(15, 2)
  totalSavings      Decimal  @db.Decimal(15, 2)
  categoryBreakdown Json
  createdAt         DateTime @default(now())
  @@unique([budgetId, month, year])
}

model Loan {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  simulationId     String?
  title            String
  type             String   // VEHICLE, PERSONAL, HOUSING, OTHER
  principal        Decimal  @db.Decimal(15, 2)
  downPayment      Decimal  @db.Decimal(15, 2) @default(0)
  annualRate       Decimal  @db.Decimal(10, 6)
  termMonths       Int
  formula          String   // french_ea | nominal_monthly
  monthlyPayment   Decimal  @db.Decimal(15, 2)
  startDate        DateTime @default(now())
  status            String   @default("ACTIVE") // ACTIVE | PAID_OFF | DEFAULTED
  paidInstallments  Int      @default(0)
  totalInterest     Decimal  @db.Decimal(15, 2)
  totalCost         Decimal  @db.Decimal(15, 2)
  currency          String   @default("COP")
  fees              Json     @default("[]") // [{ id, name, amount, type: "monthly" | "upfront" }]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  payments          LoanPayment[]
  extraPayments     LoanExtraPayment[]
}

model LoanPayment {
  id            String   @id @default(cuid())
  loanId        String
  loan          Loan     @relation(fields: [loanId], references: [id], onDelete: Cascade)
  amount        Decimal  @db.Decimal(15, 2)
  principalPaid Decimal  @db.Decimal(15, 2)
  interestPaid  Decimal  @db.Decimal(15, 2)
  paidDate      DateTime
  createdAt     DateTime @default(now())
}

model LoanExtraPayment {
  id        String   @id @default(cuid())
  loanId    String
  loan      Loan     @relation(fields: [loanId], references: [id], onDelete: Cascade)
  amount    Decimal  @db.Decimal(15, 2)
  date      DateTime
  note      String?
  createdAt DateTime @default(now())
}
```

### Prisma Singleton + Neon Adapter

`lib/prisma.ts` uses `PrismaNeon` from `@prisma/adapter-neon` (Prisma 7 requires the adapter for serverless Postgres). Connection string from `process.env.DATABASE_URL` with `sslmode=require`. Client is generated to `generated/prisma/` (not the default `node_modules/.prisma/client`).

```typescript
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ... });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### `prisma.config.ts`

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env["DATABASE_URL"] },
});
```

After any schema change: `npx prisma generate` then `npx prisma db push`.

### Pattern: Defensive Parsing

Because `Simulation.inputs` / `Simulation.result` / `Loan.fees` are stored as `Json` (and may be malformed from old data or migrations), every loader has a `parse*` function with safe defaults:

- `parseSimulationInputs(raw)` → `SimulationInputRow` (price, downPayment, term, rate, formula)
- `parseSimulationResult(raw)` → `SimulationResultRow` (monthlyPayment, verdict, availableAfter, totalInterest, totalCost)
- `parseLoanInputs(raw)` → `LoanInputRow`
- `parseLoanResult(raw)` → `LoanResultRow`
- `parseLoan(loan)` → ensures `fees: FeeItem[]` (never undefined)

The `ENGINE_TO_DB` and `DB_TO_ENGINE` maps in `simulation-types.ts` translate between the engine's `Verdict` ("SAFE" | "TIGHT" | "RISKY" | "NOT_RECOMMENDED") and the DB enum `DbVerdict` ("APPROVED" | "WARNING" | "REJECTED").

## 10. UI & Styling

### Visual System

- **Base**: Tailwind v4 with CSS-based config (`@theme inline` in `globals.css`).
- **shadcn/ui**: 13 components in `components/ui/`. Style: `base-nova`. Configured in `components.json`.
- **Cards (SaaS pattern)**: `bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6`. Used everywhere.
- **Container**: `max-w-360 mx-auto p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8`. With optional inner `max-w-3xl space-y-6 md:space-y-8` for forms.

### Dark Mode

Complete. `next-themes` with `attribute="class"` + `storageKey="walta-theme"` + `disableTransitionOnChange`. **CRITICAL**: `app/globals.css` must contain `@custom-variant dark (&:is(.dark, .dark *));` immediately after `@import "tailwindcss"` and before `@theme inline`. Without it, `dark:` doesn't respond to the toggle (Tailwind v4 defaults to `prefers-color-scheme`).

- **Color tokens**: `:root` and `.dark` define `--background`, `--card`, `--border`, `--primary`, etc. Light = stone-50/100 family, dark = slate-900/800 family.
- **Color tints for badges/pills**: `bg-{color}-100 dark:bg-{color}-950/40 text-{color}-800 dark:text-{color}-400 border-{color}-200 dark:border-{color}-900` (emerald, amber, blue, red, rose, purple, orange). Slate uses `bg-slate-100 dark:bg-slate-800`.
- **Row tints**: `bg-{color}-50/50 dark:bg-{color}-950/20` for status rows.
- **Hydration-safe components**: `ThemeToggle` and `ThemeSelector` use `useSyncExternalStore` to avoid `react-hooks/set-state-in-effect` ESLint error.

### Recharts (Wrapper Pattern)

Recharts `ResponsiveContainer` requires a sized parent to avoid the `width(-1) and height(-1)` warning (race condition with SSR + `motion.div` + `useTheme()` re-render). **Always wrap in a sized div**:

```tsx
<div className="h-[340px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>...</PieChart>
  </ResponsiveContainer>
</div>
```

Verified parent dimensions: 748×340 in the hero donut. The warning may appear once per chart on initial mount, but charts render correctly.

**Dark mode in Recharts**: Use `useTheme()` from `next-themes`. Set:
- `stroke={isDark ? "#0f172a" : "#ffffff"}` for separators
- `tick={{ fill: isDark ? "#f8fafc" : "#1c1917" }}` for axis labels
- `cursor={{ fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}` for hover

### Charts Inventory

| Location | Component | Size |
|----------|-----------|------|
| `components/dashboard/CategoryDonutChart.tsx` | Donut (hero + default) | h-[340px] |
| `components/dashboard/CategoryLimitsBarChart.tsx` | Bar | h-[320px] md:h-[360px] |
| `components/credits/CreditCharts.tsx` | 2 charts (balance + cumulative interest) | h-[250px] each |
| `components/history/HistoryChart.tsx` | Bar (legacy, snapshots tab) | h-80 |

### Recharts outline reset

`globals.css` has `.recharts-wrapper * { outline: none !important; }` to disable Recharts' default focus rings.

## 11. State Management

### Server State

- **Source of truth**: Neon Postgres via Prisma.
- **Reads**: Server Component → `prisma.find*` directly (via `server/queries/*` helpers for complex cases).
- **Writes**: Server Actions → `prisma.upsert`/`create`/`update`/`delete` → `revalidatePath`.

### Client State

- **Local UI state**: `useState` + `useTransition` in Client Components.
- **Form state**: `useForm` from React Hook Form (Zod resolver).
- **Theme state**: `next-themes` (`useTheme`).
- **URL state**: `useSearchParams` + `useRouter` for tabs, filters, pagination.
- **No global store**: No Zustand, no Redux, no Context beyond `DashboardContext` (which is just a small wrapper for the "Add Expense" modal).

### TanStack Query (configured, unused)

`app/providers.tsx` configures a `QueryClient` with `staleTime: 60_000` + `refetchOnWindowFocus: false`. It's there for future use (e.g. if we need cross-route invalidation patterns). Currently no production page uses `useQuery`.

### Why no Zustand?

The original architecture proposed Zustand for UI state (modals, draft forms, sidebar). In practice:
- Modals live close to their trigger → no cross-page state needed.
- Form drafts live in RHF.
- Sidebar collapse state lives in CSS + `group` (no JS state).

The Zustand dependency is a candidate for removal in a future cleanup.

## 12. Error, Loading, Empty States

### Loading

- **Per-route**: `loading.tsx` shows skeletons with `animate-pulse`.
- **Per-server-action**: `isPending` from `useTransition` shows a `Loader2` icon button.
- **KPIs**: `KPICard` uses Framer Motion `motion.div` with `initial={{ opacity: 0, y: 8 }}` + `animate={{ opacity: 1, y: 0 }}` for entry.

### Error

- **Per-route**: `error.tsx` is a Client Component that renders an `<Alert variant="destructive">` with a retry button.
- **Server action errors**: Caught in the action, returned to the client. The client uses Sonner to show `toast.error()`.
- **AI errors**: `AIAdvisorCard` and `AILoanAdvisorCard` catch `GroqError` subclasses and show a friendly retry message. Never crash the page.

### Empty States

Each module has a dedicated empty state with a contextual CTA:
- **Dashboard (no budget)**: Redirects to `/onboarding`.
- **Gastos (no transactions)**: CTA "Agrega tu primer gasto" → opens modal.
- **Simulaciones (none)**: CTA "Simula tu primera decisión" → `/simulations/new`.
- **Créditos (none)**: CTA "Registra tu primer crédito" → `/credits/new` (requires budget).
- **Historial (no events)**: CTA contextual based on `hasBudget` → `/simulations/new` or `/credits/new`, else `/onboarding`.
- **Reglas (no budget)**: Inline message "Completa el onboarding primero".

## 13. Testing & Validation

### Unit Tests (Vitest)

**119 tests across 9 files.** All pure functions. `jsdom` environment, globals enabled.

| File | Tests | Covers |
|------|------:|--------|
| `tests/unit/currency.test.ts` | (multiple) | Dinero.js wrappers, `formatCOP`, `addMoney`, `subtractMoney` |
| `tests/unit/simulation-engine.test.ts` | (multiple) | `calculateFrenchEA`, `calculateNominalMonthly`, `getVerdict`, edge cases (rate 0, term 0, principal 0) |
| `tests/unit/loan-engine.test.ts` | (multiple) | `generateAmortizationSchedule` (with extra payments), `calculateRemainingBalance`, `getProjectedPayoffDate`, status detection |
| `tests/unit/timeline-queries.test.ts` | **19** | `buildTimelineEvents` (event type derivation, malformed JSON), `sortAndPaginateEvents` (cursor pagination, sort order) |
| `tests/unit/ai-prompt-builder.test.ts` | (multiple) | Prompt content (system + user), no leakage of PII |
| `tests/unit/groq-client.test.ts` | (multiple) | HTTP error classification (401/403/429/5xx), retry logic, JSON extraction, timeout |
| `tests/unit/loan-prompts.test.ts` | (multiple) | Loan-specific prompts |
| `tests/unit/loan-advisor.test.ts` | (multiple) | `generateLoanAdvisorAnalysis` cache behavior, invalidation |
| `tests/unit/loan-insights.test.ts` | (multiple) | `generateLoanInsights` cache behavior, invalidation |

### Vitest Configuration

`vitest.config.ts`:
- `environment: "jsdom"` (so React imports don't fail).
- `globals: true` (no need to import `describe`/`it`/`expect`).
- `server.deps.inline: ["next-auth", "@auth/core"]` — required because `next-auth/lib/env.js` imports `next/server` which doesn't resolve in vitest.
- `resolve.alias.server-only` → `tests/stubs/server-only.ts` (empty export). Required because `lib/timeline-types.ts` is importable from client (no `import "server-only"`) and would otherwise fail vitest.

### E2E Tests (Playwright)

**Installed but no specs.** Used for ad-hoc smoke tests via `playwright_browser_navigate` + `playwright_browser_take_screenshot`. The CI pipeline does not run E2E.

### Validation Checklist (pre-commit)

1. `npm run build` passes.
2. `npx tsc --noEmit` passes.
3. `npm run lint` passes.
4. `npx vitest` passes (119/119).
5. If Prisma schema changed: `npx prisma generate` + `npx prisma db push`.

## 14. Risks & Tradeoffs

| Risk | Impact | Mitigation |
|------|--------|------------|
| **PWA disabled** | Users can't install app offline. | `/offline` static page works as fallback. Future: migrate to `serwist` (Next 16-compatible). |
| **Recharts `width(-1)` warning** on initial mount | Cosmetic. 1 per chart. | Charts render correctly. Resolved if we switch to a `dynamic({ ssr: false })` wrapper, but cost is more JS shipped. |
| **Zustand + next-pwa in `package.json` but unused** | Bundle bloat (~50KB). | Candidate for removal. Low priority. |
| **Hardcoded demo user in Auth.js** | Not multi-tenant. | Intentional for MVP. Real auth is a Phase 13 candidate (Google OAuth + email magic link). |
| **GROQ API key in `.env`** | Risk of leakage. | `.env` is gitignored. Key rotation is manual. |
| **In-memory AI cache per process** | In serverless deployments, cache is per-instance. | Acceptable. Cache TTL is short (1-24h) so worst case is a few extra GROQ calls. |
| **`Decimal` serialized as string in JSON** | Risk of `parseFloat` on UI side without precision. | Mitigated by `formatCOP(amount)` that accepts `number | string`. |
| **`alert-dialog` can't be `disabled`** | No way to prevent close during pending state. | Use `useTransition` for the action; show `Loader2` in button. |
| **Sonner toast `description` can be long** | UX noise. | Keep descriptions to <80 chars. |

## 15. Implementation History (Condensed)

The original proposal had 9 phases. The actual implementation had 12.

| # | Phase | Result |
|---|-------|--------|
| 1 | Foundations (Next 16, Prisma 7, Auth.js v5, Tailwind v4) | Greenfield setup. PWA attempted, abandoned. |
| 2 | Data model + Onboarding | 4-step wizard. First user flow. |
| 3 | Dashboard v1 | Basic KPIs, table. |
| 4 | Dashboard Visual v2 | Hero donut, health cards, breakdown, Framer Motion. |
| 5 | Expenses + recurrence | `Transaction.recurrence` (MONTHLY/BIWEEKLY/ONE_TIME). Renamed to "Gastos" in UI. |
| 6 | Rules + Settings | 3-tab reglas, 2-section settings, dark mode, theme toggle. |
| 7 | Simulations + AI | 4 types, AI advisor (DB 24h cache) + insights (memory 1h cache). |
| 8 | Credits + AI | Full loan tracker, amortization, fees, payments, extras, advisor + insights. |
| 9 | History refactor | "Cierre contable" → "Decision timeline". 5 event types derived on-the-fly. |
| 10 | Auth refactor | Demo user hardcoded, OAuth path documented for future. |
| 11 | AI consolidation | Loan advisor + insights, 2-level cache, GROQ client with retries. |
| 12 | Dev cleanup | Tremor removed. Recharts wrapper audited. Sidebar collapse. |

**Roadmap (NOT yet done):**
- Real multi-tenant auth (Google OAuth + email magic link).
- Savings goals module.
- Multiple budget templates.
- Currency switcher.
- Account deletion (danger zone).
- i18n (currently es-CO only).
- Move AI cache to DB-backed (instead of in-memory).
- PWA via `serwist`.
- E2E specs.

## 16. AI Module (Detailed)

The AI module is the most complex non-UI part of the system. It is a thin wrapper over GROQ's `llama-3.3-70b-versatile` model with strict Zod validation and a 2-level cache.

### Components

```
lib/ai/
├── groq-client.ts        # HTTP wrapper with retry + 5 typed errors
├── schemas.ts            # Zod schemas (shared shapes, aliases for loans)
├── prompts.ts            # Simulation advisor + insights prompts
├── loan-prompts.ts       # Loan advisor + insights prompts
├── simulation-advisor.ts # Verdict explanation + recommendations
├── simulation-insights.ts # 1-2 sentence insight for sim list
├── loan-advisor.ts       # Same shape as sim advisor, loan context
└── loan-insights.ts      # Same shape as sim insights, loan portfolio context
```

### Features

1. **Simulation Advisor** (`/simulations/[id]`)
   - Input: simulation result + user budget context
   - Output: `{ verdict_explanation, recommendations[1-3], risks[1-3], alternative_suggestion? }`
   - Cache: DB column `Simulation.aiAnalysis` + `aiAnalysisGeneratedAt`. TTL 24h.
   - Trigger: button "Generar análisis" in `AIAdvisorCard`. Refresh invalidates the DB field.

2. **Simulation Insights** (`/simulations`)
   - Input: full user simulations list
   - Output: `{ insight: "1-2 frases" }` (max 450 chars)
   - Cache: in-memory `Map` per process. TTL 1h.
   - Trigger: on page load if cache miss. Shown in `AIInsightsBanner`.

3. **Loan Advisor** (`/credits/[id]`)
   - Input: loan details + amortization + user budget
   - Output: same shape as simulation advisor
   - Cache: in-memory `Map<userId:loanId, …>`. TTL 24h.
   - Trigger: button "Generar análisis" in `AILoanAdvisorCard`.
   - Invalidation: every mutation in `loan-actions.ts` (create, update, delete, record payment, delete payment, record extra, delete extra) calls `invalidateLoanAdvisorCache(userId, loanId)`.

4. **Loan Insights** (`/credits`)
   - Input: full user loans list
   - Output: `{ insight: "1-2 frases" }`
   - Cache: in-memory `Map<userId, …>`. TTL 1h.
   - Trigger: on page load if cache miss. Shown in `AILoanInsightsBanner`.
   - Invalidation: same as Loan Advisor.

### GROQ Client

`groq-client.ts` exports `callGroqChat(options)` with:
- **Default model**: `llama-3.3-70b-versatile`
- **Default temperature**: 0.4 (advisor) / 0.5 (insights) — set per call.
- **Default maxTokens**: 1500
- **Default timeout**: 30s
- **Retries**: 2 with exponential backoff (500ms × 2^attempt)
- **JSON mode**: `response_format: { type: "json_object" }` when caller wants Zod validation.
- **Typed errors**: `GroqError` (base), `GroqAuthError` (401/403), `GroqRateLimitError` (429), `GroqServiceError` (5xx), `GroqTimeoutError` (AbortError), `GroqParseError` (JSON parse fail).

### Disclaimer (UI)

Every AI card includes the disclaimer at the bottom:
> "Análisis generado por IA. No constituye asesoría financiera profesional."

Followed by a cache timestamp: "Cache · {date}" or "Nuevo · {date}" depending on whether the response came from cache.

### Tests

- `tests/unit/groq-client.test.ts`: HTTP error classification, retry logic, JSON extraction.
- `tests/unit/ai-prompt-builder.test.ts`: Prompt content + no PII.
- `tests/unit/loan-prompts.test.ts`: Loan prompts.
- `tests/unit/loan-advisor.test.ts`: `generateLoanAdvisorAnalysis` cache + invalidation.
- `tests/unit/loan-insights.test.ts`: `generateLoanInsights` cache + invalidation.

## 17. Agent Handoff

**Specialist agent**: `frontend-react-next`

**For new work in this codebase:**

1. **Stack is fixed.** Next.js 16.2.6, React 19.2.4, Tailwind v4, Prisma 7.8.0 + Neon. Don't propose alternatives.
2. **State model is fixed.** No new global stores. Use Server Components + Server Actions + URL state.
3. **Visual system is fixed.** Cards: SaaS pattern (see §10). Dark mode: complete. Don't add new theme tokens without updating `globals.css` + `AGENTS.md`.
4. **AI is GROQ-only.** Don't add new providers. New AI features go in `lib/ai/` with the existing pattern.
5. **Money is Decimal → string → number.** Use `parseFloat` only at UI boundaries. Use `formatCOP` for display.
6. **Tests are required.** Pure functions in `lib/` must have Vitest coverage. The 119-test count is the floor.
7. **Validation before commit** (see §13): tsc + lint + build + vitest.
8. **Don't use `--force` for npm.** If a peer dep fails, the dependency is wrong. Remove it.
9. **`proxy.ts` is the auth wrapper.** Don't recreate `middleware.ts`.
10. **PWA is disabled.** Don't try to re-enable `next-pwa` with Next 16 + Turbopack. Use `/offline` fallback.
11. **Module boundaries** are described in `module-reference.md`. New modules follow the same pattern (route group + server actions + client components + tests).
