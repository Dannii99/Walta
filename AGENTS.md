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
- **Providers** in `app/providers.tsx`: `SessionProvider` + `ThemeProvider` (next-themes, attribute="class", storageKey="walta-theme", disableTransitionOnChange) + `QueryClientProvider` (TanStack Query). `Toaster` (sonner) queda fuera intencionalmente.

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
- **49 unit tests** passing: `tests/unit/simulation-engine.test.ts`, `tests/unit/currency.test.ts`, and `tests/unit/loan-*.test.ts`.
- Playwright is installed but no E2E specs written yet.

## Styling & UI

- Tailwind v4 config lives entirely in `app/globals.css` via `@theme inline`. Custom CSS variables for shadcn theme.
- `components.json` defines shadcn aliases (`@/components/ui`, `@/lib/utils`).
- **Dark mode COMPLETO** con `next-themes` (class-based). `ThemeProvider` en `app/providers.tsx`. `storageKey="walta-theme"`. `disableTransitionOnChange`.
- **REQUERIDO en `app/globals.css`**: `@custom-variant dark (&:is(.dark, .dark *));` después de `@import "tailwindcss"` y antes de `@theme inline`. Sin esto, `dark:` no responde al toggle de next-themes (Tailwind v4 default es `prefers-color-scheme` media query).
- **Dark mode color tokens** en `globals.css`: `.dark` con `--background: #0f172a` (slate-900), `--card: #1e293b` (slate-800), `--border: #334155` (slate-700), `--primary: #3b82f6` (blue-500).
- **Dark mode color tints** para badges/pills: `bg-{color}-100 dark:bg-{color}-950/40 text-{color}-800 dark:text-{color}-400 border-{color}-200 dark:border-{color}-900` (emerald/amber/blue/red/rose/purple). Slate usa `bg-slate-100 dark:bg-slate-800`.
- **Dark mode row tints**: `bg-{color}-50/50 dark:bg-{color}-950/20` para status rows.
- **Dark mode Recharts**: usar `useTheme()` de next-themes y `const isDark = resolvedTheme === "dark"`. Recharts no renderiza en SSR, así que no requiere `mounted` guard. `stroke={isDark ? "#0f172a" : "#ffffff"}` para separadores, `tick={{ fill: isDark ? "#f8fafc" : "#1c1917" }}`, `cursor={{ fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}`.
- **Dark mode `useSyncExternalStore` pattern** para evitar hydration mismatch sin `setState` en `useEffect` (prohibido por `react-hooks/set-state-in-effect`):
  ```ts
  const emptySubscribe = () => () => {};
  const getHydrated = () => true;
  const getServerSnapshot = () => false;
  function useHydrated() {
    return useSyncExternalStore(emptySubscribe, getHydrated, getServerSnapshot);
  }
  ```
  Aplicado en `components/shared/ThemeToggle.tsx` y `components/settings/ThemeSelector.tsx`.

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
  - `app/(dashboard)/reglas/page.tsx` — Server Component con metadata. 3 tabs custom (Ingreso, Regla, Categorías) con `AnimatePresence`.
  - `components/reglas/ReglasClient.tsx` — Orquestador con Tabs y motion.
  - `components/reglas/Tabs.tsx` — Primitiva custom con ARIA + keyboard nav (ArrowLeft/Right, wrap, role="tablist"/"tab", aria-selected, aria-controls, tabIndex).
  - `components/reglas/IncomeEditor.tsx` — Hero card + form inline con Zod.
  - `components/reglas/RuleEditor.tsx` — 3 inputs + progress bars + preview.
  - `components/reglas/CategoryManager.tsx` — CRUD con AlertDialogs.
  - Container pattern: `max-w-[1440px] mx-auto p-4 md:px-6 lg:px-10 py-6 md:py-8` + inner `max-w-3xl space-y-6 md:space-y-8`.
  - `app/(dashboard)/reglas/loading.tsx` — Skeleton de carga.
  - Server actions revalidan `/reglas` en `budget-actions.ts` y `category-actions.ts`.
- **Módulo "Configuración" (`/settings`):**
  - `app/(dashboard)/settings/page.tsx` — Server Component con 2 sections: Apariencia (ThemeSelector) + Cuenta (AccountSection).
  - `components/settings/ThemeSelector.tsx` — 3 cards grid (Light/Dark/System) con Framer Motion checkmark.
  - `components/settings/AccountSection.tsx` — `useSession()`, avatar, signOut.
  - `components/shared/ThemeToggle.tsx` — Compact Sun/Moon button en sidebar footer.
  - **Sin "Eliminar cuenta" en este fase**. Próximas iteraciones: currency switcher, danger zone.
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
