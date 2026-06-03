<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Walta — Agent Quickstart

## Stack & Versions

- **Next.js 16.2.6** (App Router) + **React 19.2.4**
- **TailwindCSS v4** — CSS-based config via `app/globals.css` (`@import "tailwindcss"`, `@theme inline`). **No `tailwind.config.js`**.
- **Prisma 7.8.0** + **Neon Postgres** (`@neondatabase/serverless`)
- **Auth.js v5** (NextAuth) with hardcoded CredentialsProvider (OAuth not wired yet)
- **Vitest** (unit) + **Playwright** (E2E)
- **shadcn/ui** (style: base-nova) + Tremor + Recharts + Framer Motion

## Developer Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3000) |
| Production build | `npm run build` |
| Lint | `npm run lint` (uses flat config `eslint.config.mjs`) |
| Type check | `npx tsc --noEmit` |
| Unit tests | `npx vitest` |
| E2E tests | `npx playwright test` |
| Prisma generate | `npm run db:generate` |
| Prisma push schema | `npm run db:push` |
| Prisma Studio | `npm run db:studio` |

## Architecture & Entrypoints

- **App Router** with route groups:
  - `app/(auth)/login/page.tsx` — Login page (public)
  - `app/(dashboard)/` — Protected routes (`page.tsx`, `transactions/`, `simulations/`, `history/`, `settings/`)
  - `app/api/auth/[...nextauth]/route.ts` — Auth.js API endpoint
- **Middleware** (`middleware.ts`): redirects unauthenticated users from `/` and `/dashboard/*` to `/login`; redirects logged-in users away from `/login`.
- **Prisma singleton** at `lib/prisma.ts` (prevents multiple instances in dev).
- **Auth config** at `lib/auth.ts` — hardcoded demo user `demo@example.com` / `demo123`. JWT strategy.
- **Providers** in `app/providers.tsx`: `SessionProvider` + `QueryClientProvider` (TanStack Query).

## Financial Precision Rules (Critical)

- **Never use raw `number` for money**. Use `Decimal` in Prisma DB, `string` in JSON/API, and **Dinero.js** on the client.
- All currency helpers are in `lib/currency.ts`: `createMoney`, `formatMoney`, `addMoney`, `subtractMoney`, etc.
- Default currency is **COP** (Colombian Peso) formatted as `$ 1.234.567,89`.
- Business constants in `lib/constants.ts`: default budget rule 50/30/20, reference interest rates, health thresholds.

## Database & Prisma

- Schema at `prisma/schema.prisma`. Models: `User`, `Budget`, `Category`, `Transaction`, `Simulation`, `MonthlySnapshot`.
- Neon connection uses pooled URL with SSL (`sslmode=require`).
- After any schema change: run `npx prisma generate` then `npx prisma db push`.

## Testing

- **Vitest** config: `vitest.config.ts` (jsdom environment, globals enabled, `@/` alias mapped).
- **27 unit tests** passing: `tests/unit/simulation-engine.test.ts` and `tests/unit/currency.test.ts`.
- Playwright is installed but no E2E specs written yet.

## Styling & UI

- Tailwind v4 config lives entirely in `app/globals.css` via `@theme inline`. Custom CSS variables for shadcn theme.
- `components.json` defines shadcn aliases (`@/components/ui`, `@/lib/utils`).
- Dark mode classes are prepared in `globals.css` but no toggle is implemented.

## PWA Status

- **DESACTIVADO TEMPORALMENTE.** `next-pwa` es incompatible con Next.js 16 + Turbopack.
- `public/manifest.json` and icons exist but the service worker no se genera.
- Si en el futuro se re-implementa PWA, usar `serwist` o esperar soporte oficial de `next-pwa` para Next.js 16.

## Auth & Environment

- `.env` contains `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and a **GROQ_API_KEY** (for AI features).
- `.env` is gitignored — never commit it. The repo contains a hardcoded Neon DB URL and secrets that must be rotated for production.

## Current State

- Root `app/page.tsx` redirects unauthenticated users to `/login` and authenticated users to `/dashboard`.
- **Módulo "Reglas" (`/reglas`):**
  - `app/(dashboard)/reglas/page.tsx` — Server Component con metadata. Contiene `RuleEditor` (regla 50/30/20) y `CategoryManager` (CRUD con reasignación).
  - `components/reglas/RuleEditor.tsx` y `components/reglas/CategoryManager.tsx` — Componentes del módulo.
  - `app/(dashboard)/reglas/loading.tsx` — Skeleton de carga.
  - Server actions revalidan `/reglas` en `budget-actions.ts` y `category-actions.ts`.
- **Módulo "Configuración" (`/settings`):**
  - `app/(dashboard)/settings/page.tsx` — Placeholder. Próximamente: tema light/dark como primera config administrable.
- **Fase 4 (Dashboard Visual) implemented:**
  - `app/(dashboard)/dashboard/page.tsx` — Server Component fetching budget + transactions, calculating KPIs, health indicators, donut chart data, and category breakdown. Passes all data as plain props to client components.
  - `components/dashboard/DashboardContent.tsx` — Orchestrates layout (Header → Hero Donut → KPIs → Health Cards → Category Breakdown) and manages Add expense modal.
  - `components/dashboard/KPICard.tsx` — Animated KPI cards (Framer Motion counters) for Income, Expenses, Available.
  - `components/dashboard/CategoryDonutChart.tsx` — Recharts donut chart with two variants: `default` (compact) and `hero` (full-width, larger, with total amount in center). Used as the hero element of the dashboard.
  - `components/dashboard/HealthCards.tsx` — 3 separate cards for Needs/Wants/Savings with emoji traffic-light faces (😊/😐/😟), color-tinted backgrounds, left border accents, and progress bars using user's `budget.rule`.
  - `components/dashboard/CategoryBreakdown.tsx` — Detailed breakdown of spending per category with bars, % of total, and individual limits. Replaces the old `RecentTransactions` widget.
  - `components/dashboard/DashboardContext.tsx` — Provides `openAddModal` state and `triggerRefresh` callback across dashboard layout.
  - `app/(dashboard)/layout.tsx` — Wraps children with `DashboardProvider`. Sidebar includes Dashboard, Gastos, Simulaciones, Reglas, Créditos, Historial, Configuración.
  - New UI components: `components/ui/alert-dialog.tsx`, `components/ui/progress.tsx`.
- **Módulo "Gastos" (`/expenses`):**
  - `app/(dashboard)/expenses/page.tsx` — Server Component with metadata, totals-by-type cards, filters and full table.
  - `components/expenses/AddExpenseModal.tsx` — Modal con `CurrencyInput` (máscara de miles) + select de recurrencia (Mensual/Quincenal/Única).
  - `components/expenses/EditExpenseModal.tsx` — Mismo formulario precargado.
  - `components/expenses/ExpenseList.tsx` — Tabla con orden por fecha, badges de tipo y recurrencia, acciones Edit/Delete.
  - `components/expenses/ExpenseFilters.tsx` — Filtros por búsqueda, categoría, tipo, rango de fechas.
  - `components/expenses/ExpensesClient.tsx` — Orquesta el cliente del módulo.
  - Nota: el modelo Prisma se llama `Transaction` (dominio); sólo la UI/ruta/componentes se renombraron a "Gastos".
- **Fase 3 (Onboarding) implemented:** 4-step wizard (`/onboarding`) with animated welcome, template selection, income input, and category review. Redirects from dashboard if no budget exists.
- `server/actions/`, `server/queries/`, `hooks/`, and `components/` directories are fully populated.
- `types/index.ts` defines domain types mirroring Prisma schema.

## Validation Before Commit

1. `npm run build` must pass.
2. `npx tsc --noEmit` must pass.
3. `npm run lint` must pass.
4. If Prisma schema changed: `npx prisma generate` + `npx prisma db push`.
