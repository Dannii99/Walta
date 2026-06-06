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
- **shadcn/ui** (style: base-nova) + Recharts + Framer Motion

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
  - `app/(dashboard)/` — Protected routes (`dashboard/`, `expenses/`, `simulations/`, `reglas/`, `credits/`, `history/`, `settings/`)
  - `app/onboarding/page.tsx` — Top-level 4-step wizard (NOT in dashboard group)
  - `app/offline/page.tsx` — Static PWA fallback
  - `app/api/auth/[...nextauth]/route.ts` — Auth.js API endpoint
- **Proxy** (`proxy.ts`): renamed from `middleware.ts` per Next.js 16 deprecation. Redirects unauthenticated users from `/` and `/dashboard/*` to `/login`; redirects logged-in users away from `/login`.
- **Prisma singleton** at `lib/prisma.ts` (prevents multiple instances in dev) using `PrismaNeon` adapter.
- **Auth config** at `lib/auth.ts` — hardcoded demo user `demo@example.com` / `demo123`. JWT strategy. 66 lines.
- **Providers** in `app/providers.tsx`: `SessionProvider` + `ThemeProvider` (next-themes, attribute="class", storageKey="walta-theme", disableTransitionOnChange) + `QueryClientProvider` (TanStack Query). `Toaster` (sonner) DENTRO de `<QueryClientProvider>`.
- **Documentación canónica en `doc/`** (5 archivos): `README.md` (índice), `architecture.md` (~600 líneas, comprehensive), `module-reference.md` (~700 líneas, tour módulo-por-módulo), `project-context.md` (~250 líneas, producto), `setup-plan.md` (~150 líneas, dev setup).

## Stack Reality Check

Versions exactas en `package.json`:
- **next@16.2.6** (App Router, **Turbopack default**, NO webpack)
- **react@19.2.4** + react-dom@19.2.4
- **typescript@5.x** (strict)
- **prisma@7.8.0** (cliente generado en `generated/prisma/`, NO `node_modules/.prisma/client`)
- **@prisma/adapter-neon** + **@neondatabase/serverless@1.1.x** (Prisma 7 requiere adapter)
- **tailwindcss@4.x** (CSS-based config en `app/globals.css` vía `@theme inline`. **No `tailwind.config.ts`**)
- **shadcn/ui** style `base-nova` — 15 componentes en `components/ui/` (incluye `switch.tsx` para cuota inicial toggle)
- **recharts@3.8.1**, **framer-motion@12.40.0**, **lucide-react**
- **next-themes@0.4.6**, **sonner@2.0.7**
- **react-hook-form@7.76.1** + **@hookform/resolvers@5.4.0** + **zod@4.4.3**
- **next-auth@5.0.0-beta.31** (Auth.js v5)
- **dinero.js@2.0.2** (solo en `lib/currency.ts` para math; UI usa `Intl.NumberFormat("es-CO", ...)` vía `formatCOP`)
- **vitest@4.1.7** + **@playwright/test@1.60.0**
- **eslint@9.x** (flat config en `eslint.config.mjs`)

**Instalados pero NO usados (candidatos a remover):**
- `zustand@5.0.14` — 0 imports en source. Legacy de scaffolding inicial.
- `next-pwa@5.6.0` — **incompatible con Next 16 + Turbopack**. En `package.json` pero **NO** en `next.config.ts`. Ver "PWA Status" abajo.
- `@tanstack/react-query@5.100.14` — configurado en `app/providers.tsx` para futuro, pero 0 `useQuery` en producción. Data flow real: Server Component → `prisma.find*` → render. Mutaciones: Server Actions + `revalidatePath`.

**Removidos en dev cleanup:**
- `@tremor/react` — desinstalado, 0 imports. `node_modules/@tremor` no existe. `npm install` regenerado a 843 paquetes sin `ERESOLVE`.

## Financial Precision Rules (Critical)

- **Never use raw `number` for money**. Use `Decimal` in Prisma DB, `string` in JSON/API, and **Dinero.js** on the client.
- All currency helpers are in `lib/currency.ts`: `createMoney`, `formatMoney`, `addMoney`, `subtractMoney`, etc.
- Default currency is **COP** (Colombian Peso) formatted as `$ 1.234.567` (no decimals, since Colombia does not use centavos). All currency helpers use `minimumFractionDigits: 0, maximumFractionDigits: 0`.
- Business constants in `lib/constants.ts`: default budget rule 50/30/20, reference interest rates, health thresholds.

## Database & Prisma

- Schema at `prisma/schema.prisma`. Models: `User`, `Budget`, `Category`, `Transaction`, `Simulation`, `MonthlySnapshot`.
- Neon connection uses pooled URL with SSL (`sslmode=require`).
- After any schema change: run `npx prisma generate` then `npx prisma db push`.

## Testing

- **Vitest** config: `vitest.config.ts` (jsdom environment, globals enabled, `@/` alias mapped).
- **119 unit tests** passing: `tests/unit/simulation-engine.test.ts`, `tests/unit/currency.test.ts`, `tests/unit/timeline-queries.test.ts` (19), and `tests/unit/loan-*.test.ts` (incl. AI prompts + Groq client + loan advisor + loan insights).
- Vitest `test.server.deps.inline: ["next-auth", "@auth/core"]` porque `next-auth/lib/env.js` requiere `next/server`. Alias `server-only` → `tests/stubs/server-only.ts` (export vacío) — necesario para `lib/timeline-types.ts` (sin `"server-only"` para import desde client).
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
- **Recharts `ResponsiveContainer` wrapper pattern**: SIEMPRE envolver el chart en un div con altura explícita (Tailwind `h-[Npx]` o inline `style={{ height: N }}`) y usar `width="100%" height="100%"`. NO usar `width="100%" height={N}` directamente sobre `ResponsiveContainer`. Esto reduce el warning `width(-1) and height(-1)` de Recharts (race condition con SSR + `motion.div` + `useTheme()` re-render). El warning puede aparecer UNA vez por chart en el primer mount, pero los charts renderizan correctamente. Verificado con Playwright que parents tienen dimensiones finales correctas (ej. 748×340).
  - `components/credits/CreditCharts.tsx` — 2 charts, ambos envueltos en `<div className="h-[200px] w-full">`.
  - `components/dashboard/CategoryDonutChart.tsx` — envuelto en `<div className="h-[340px] w-full">`.
  - `components/dashboard/CategoryLimitsBarChart.tsx` — ya tenía `<div className="h-[320px] md:h-[360px]">`.
  - `components/history/HistoryChart.tsx` — ya tenía `<div className="h-80">`.
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
- `app/offline/page.tsx` es un fallback static con `Card` + `WifiOff` icon. Se renderiza si la red falla, pero **no hay service worker** que la sirva.
- Si en el futuro se re-implementa PWA, usar `serwist` o esperar soporte oficial de `next-pwa` para Next.js 16.

## Sidebar / Mobile Nav

- `components/shared/Sidebar.tsx` — sidebar desktop colapsable. `w-[68px]` por defecto, `hover:w-64` con `group` class en `<aside>`. Active route con border-left + bg. Links: Dashboard, Gastos, Simulaciones, Reglas, Créditos, Historial, Configuración.
- `components/shared/MobileBottomNav.tsx` — bottom nav en mobile (`<md`). 4 items: Dashboard, Gastos, Simulaciones, Créditos. Reglas/Historial/Configuración accesibles desde el sidebar.
- Layout en `app/(dashboard)/layout.tsx` envuelve children con `<DashboardProvider>`. Content area con `pb-16 md:pb-0` para el bottom nav.

## Auth & Environment

- `.env` contiene `DATABASE_URL` (Neon Postgres pooled URL con `sslmode=require`), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, y un **`GROQ_API_KEY`** (para features de IA).
- `.env` está en `.gitignore` — NUNCA commitearlo. El repo tiene un Neon DB URL hardcodeado y secrets que DEBEN rotarse para producción.
- NextAuth v5 `auth()` se llama en cada Server Component protegido. Si `session?.user?.id` falta, redirige a `/login` (manejado en `proxy.ts` para rutas completas y en cada page para casos puntuales).

## Current State

- Root `app/page.tsx` redirects unauthenticated users to `/login` and authenticated users to `/dashboard`.
- **Módulo "Historial" (`/history`):**
  - `app/(dashboard)/history/page.tsx` — Server Component con 2 tabs vía `?tab=timeline|snapshots` (default `timeline`). `Promise.all` sobre `getUserBudgets` + `getTimelineEvents`.
  - `app/(dashboard)/history/loading.tsx` — Skeleton con header + tabs + 6 cards.
  - `app/(dashboard)/history/error.tsx` — Error boundary con `Alert` destructive.
  - **NO es cierre contable manual** — es **línea de tiempo de decisiones financieras** (simulaciones, créditos, pagos, abonos). Coherente con `doc/project-context.md:30` "asistente financiero visual" (no contable).
  - **Eventos derivados on-the-fly** desde `Simulation` + `Loan` + `LoanPayment` + `LoanExtraPayment`. **NO existe tabla `Event`** — `getTimelineEvents` computa 5 tipos en cada request.
  - 5 tipos de eventos:
    - `SIMULATION_CREATED` — incluye `verdict` (APPROVED/REJECTED/INCONCLUSIVE) + `monthlyPayment`/`principal`/`type`/`title`.
    - `LOAN_CREATED` — incluye `loanType`, `principal`, `termMonths`, `monthlyPayment`.
    - `LOAN_PAYMENT` — incluye `installmentNumber` (1-based, ASC), `amount`, `interest`, `principal`.
    - `LOAN_EXTRA_PAYMENT` — incluye `amount`, `reason` (opcional).
    - `LOAN_PAID_OFF` (sintético) — emitido cuando `paidInstallments >= termMonths`. `occurredAt` = `lastPayment.paidDate ?? loan.updatedAt`.
  - `lib/timeline-types.ts` — discriminated union + Zod schemas + labels + `buildEventId` helper. **Sin `import "server-only"`** (debe ser importable desde client).
  - `server/queries/timeline-queries.ts` — `getTimelineEvents(userId, opts)` (consulta DB) + `buildTimelineEvents(raw, types)` (puro testeable) + `sortAndPaginateEvents(events, limit, cursor)` (puro testeable). Cursor = `{ occurredAt: ISOString, id: string }` (objeto, no base64).
  - `server/actions/timeline-actions.ts` — `loadMoreTimelineAction({ cursor, types, limit? })` con `auth()` + `timelineEventTypesSchema.parse`. `pageSize` default 30, max 100, min 1. **NO revalida path** porque la query es derivada on-the-fly.
  - **Server actions de sim/préstamo NO necesitan `revalidatePath('/history')`** — la página es siempre re-derivada en cada request.
  - `components/history/Tabs.tsx` — Custom tabs con ARIA (`role="tablist"`, `aria-selected`, `aria-controls`) + URL sync via `useRouter` + `useSearchParams`. Keyboard nav ArrowLeft/Right con wrap.
  - `components/history/Timeline.tsx` — Orchestrator client con `useTransition` + `useMemo` (filteredEvents + grouped by month via `groupTimelineByMonth`) + `loadMoreTimelineAction`. Empty state si `initialTotal === 0 && events.length === 0`.
  - `components/history/TimelineEvent.tsx` — Single event con discriminated union switch + `motion.li` stagger (`initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, duration: 0.25`). Verdict badge inline.
  - `components/history/TimelineFilters.tsx` — Multi-select chips con `data-active` + `aria-pressed` + count display (patrón `CreditsFilters.tsx`).
  - `components/history/EventIcon.tsx` — Mapa `EVENT_VISUAL` con icon Lucide + `dotClass`/`ringClass`/`iconBgClass`/`iconFgClass` + label. 5 tipos.
  - `components/history/TimelineEmpty.tsx` — Empty state con CTAs contextuales (`/simulations/new` o `/credits/new` si tiene budget, sino `/onboarding`).
  - `components/history/TimelineSkeleton.tsx` — 6 cards con `animate-pulse`.
  - `components/history/SnapshotsLegacy.tsx` — Wrapper con `Alert warning` + `HistoryChart` + `MonthlySnapshotCard` grid. Mantiene snapshots manuales visibles pero separados.
  - `components/history/HistoryChart.tsx` — Intacto (Recharts wrapper auditado).
  - `components/history/MonthlySnapshotCard.tsx` — Intacto (uso legacy).
  - `components/history/CloseMonthButton.tsx` — **ELIMINADO** (no se puede crear snapshots manuales).
  - `components/ui/alert.tsx` — **NUEVO** UI component con 5 variants (`default`/`info`/`warning`/`success`/`destructive`) + `icon` Lucide prop + `AlertTitle` + `AlertDescription`. Usado en `error.tsx` y `SnapshotsLegacy.tsx`.
  - Cursor pagination correctness: en orden DESC, "después del cursor" = `eTime < cursorTime || (eTime === cursorTime && e.id < cursor.id)`. `localeCompare` con signo INVERTIDO vs búsqueda original.
  - Container pattern: `max-w-[1440px] mx-auto p-4 md:px-6 lg:px-10 py-6 md:py-8` + inner `max-w-3xl space-y-6 md:space-y-8`.
  - `scripts/seed-timeline-demo.ts` — Script idempotente con `upsert` (IDs deterministas `seed-*`). Crea 2 sims (`VEHICLE` aprobado, `HOUSING` rechazado) + 1 loan con 8 payments (interés+capital computados) + 2 extras. Cargar con `npx tsx scripts/seed-timeline-demo.ts` (requiere `.env` con `DATABASE_URL`).
  - Schema: **sin cambios** (datos derivados on-the-fly). Futuro: `MonthlySnapshot.triggerEvent String?` para snapshots automáticos.
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
- **Módulo "Créditos" (`/credits`):**
  - `app/(dashboard)/credits/page.tsx` — Server Component minimal. Carga `getUserLoans` + `getActiveLoanCapacity`, renderiza `<CreditsClient />` con `<AILoanInsightsBanner />` arriba.
  - `app/(dashboard)/credits/new/page.tsx` — Server Component. 2-col grid con `<AvailableCreditCard />` + `<LoanForm mode="new" />`.
  - `app/(dashboard)/credits/[id]/page.tsx` — Server Component. `notFound()` si loan no existe. Renderiza `<CreditDetailClient />` con `<AILoanAdvisorCard />` integrado.
  - `app/(dashboard)/credits/[id]/edit/page.tsx` — Reutiliza `<LoanForm mode="edit" />` con data precargada.
  - `components/credits/CreditsClient.tsx` — Orchestrator list con `<AILoanInsightsBanner />` + filtros + grid.
  - `components/credits/CreditCard.tsx` — Single loan card. Status badge + progress bar + monthly payment. KPI "Cuota mensual" muestra `getEffectiveMonthlyPayment(loan)` con sub-línea muted `Banco $X + Cargos $Y` cuando `calculateTotalMonthlyFees(loan.fees) > 0`.
  - `components/credits/CreditsFilters.tsx` — Multi-select chips con `data-active` + `aria-pressed`.
  - `components/credits/EmptyCreditsState.tsx` — Empty state con CTA.
  - `components/credits/NewCreditButton.tsx` — **Custom dropdown** (NO Radix) con `useState` + `useRef` + click outside + ESC.
  - `components/credits/LoanForm.tsx` — **3-step wizard** (Datos → Condiciones → En curso). Step 1: nombre + tipo (Radix Select) + precio + **2 switches simétricos** — ¿Tienes cuota inicial? (monto) y ¿Ya hiciste un abono a capital? (monto + fecha con `max={hoy}`). Step 2: plazo (Años/Meses) + tasa (Radix Select %EA default) + fórmula (Radix Select con `SelectGroup` "Recomendado" + Sparkles) + fecha + cargos. **Stack vertical** (`space-y-6`), NO 2-col grid. Botones nav responsive (`flex-col-reverse sm:flex-row`). Si hay "abono a capital previo", Tab 2 usa `generateAmortizationSchedule` en `useMemo` con un fake loan + fake extras para recalcular `totalInterestAdjusted` (monthlyPayment NO cambia — la cuota fija del banco se mantiene). Step 3 (solo ongoing/edit con meses transcurridos): sincronización de cuotas pasadas (PAID/PENDING/DEFAULTED) + opciones avanzadas. Ya no contiene el campo "abono a capital ya realizado" — vive en Tab 1.
  - `components/credits/LoanPreviewCard.tsx` — Live preview del engine. Nueva prop opcional `previousExtraPayment?: { amount: number; date: Date } | null`. Si está presente y `amount > 0`, renderiza bloque emerald-tinted "Abono a capital previo" con: fecha corta, monto, "Saldo después de abonos" (principal - amount) y "Total restante a pagar" (totalCostAdjusted - amount). `monthlyPayment`/`totalInterest`/`totalCost` ya vienen ajustados desde el padre.
  - `components/credits/FeeForm.tsx` + `FeeCard.tsx` + `FeesSection.tsx` — SaaS-style fee CRUD. **FeeForm**: 2 visual RadioCards (Cobro mensual con border-primary / Pago único con border-amber) + label dinámico "Valor anual" / "Valor único" + hint `÷ 12 → $X/mes` con `Info` icon. **FeeCard** monthly: `formatCOP(amount/12)/mes` + "Anual: $X" subtitle. **FeesSection** empty state: card con `Receipt` icon + "¿Tienes cargos extra en tu extracto?" + subtext + Button "Agregar cargo".
  - `components/credits/CreditSummary.tsx` — 4 KPIs del préstamo. KPI "Cuota mensual" muestra `getEffectiveMonthlyPayment(loan)` con sub-line `+ $X cargos · N/M cuotas` cuando `monthlyFees > 0`. `Saldo actual` (de `calculateRemainingBalance`), `Total pagado` (sum payments) y `Próximo pago` (de `getNextPaymentDate`) intactos. Refactorizado a DRY usando `getEffectiveMonthlyPayment` (no suma fees manualmente).
  - `components/credits/CreditDetailClient.tsx` — Detail orchestrator. **Layout v6 (Layout v5 + Acciones+Simulador full-width)**: Header (con botón "Acciones" + Dialog controlado que abre `CapitalContributionForm` en modo controlado) + Tabs → Summary 4 KPIs full-width → ProgressBar full-width → `CapitalImpactSimulator` full-width (entre ProgressBar y tab content, disponible en todas las tabs) → tab content full-width → CreditCharts full-width (h-[200px] c/u) → AILoanAdvisorCard full-width. En el tab Amortización el contenido usa `AmortizationTab` que es solo `CreditAmortizationTable` (sin side panel — AccionesCard eliminado, Simulador se movió al layout principal). Removido `handleRecordPayment` (no usado tras eliminar AccionesCard). `recordPayment` import se mantiene (usado por `handleMarkPaid`).
  - `components/credits/AmortizationTab.tsx` — 18 líneas. Wrapper mínimo: `{ loan, schedule, onMarkPaid }`. Renderiza solo `<CreditAmortizationTable schedule={schedule} onMarkPaid={onMarkPaid} />` (full-width, sin grid, sin side panel).
  - `components/credits/CreditAmortizationTable.tsx` — Tabla de amortización con `min-w-[1100px]`. Columnas: Mes, Fecha, Cuota, **Cargos (condicional)**, Interés, Capital, Abono, Saldo, Estado, Días, [Acción]. La columna "Cargos" se renderiza **condicionalmente** (`hasFees = schedule.some(r => r.monthlyFee > 0)`). La columna "Cuota" muestra `formatCOP(row.totalPayment)` como número principal con sub-línea muted `Banco $X · Cargos $Y` cuando `row.monthlyFee > 0`.
  - `components/credits/AccionesCard.tsx` — **ELIMINADO** en Layout v6. Acciones+Simulador se reorganizaron: acciones rápidas → header button + Dialog controlado; simulador → sección full-width propia.
  - `components/credits/CapitalContributionForm.tsx` — Soporta **modo controlado** con props opcionales `open?: boolean`, `onOpenChange?: (open: boolean) => void`, `hideTrigger?: boolean`, `description?: React.ReactNode`. Si `open` se pasa, usa externo; si no, `useState(false)` interno. Trigger se oculta con `hideTrigger`. Descripción se renderiza arriba del form cuando se pasa. Backward compatible con uso en `CapitalImpactSimulator.tsx` (modo interno).
  - `components/credits/CreditDetailHeader.tsx` — Header card. Nueva prop opcional `onOpenActions?: () => void` que renderiza botón "Acciones" (Zap icon, h-9 px-3, rounded-full, `aria-label="Abrir acciones rápidas"`) entre área vacía y "Editar". KPI "Cuota" muestra `getEffectiveMonthlyPayment(loan)` con sub-línea `Banco $X + Cargos $Y` cuando `cargosMonthly > 0`.
  - `components/credits/CreditCharts.tsx` — 2 Recharts charts (capital over time + interest vs principal). Ambos envueltos en `<div className="h-[200px] w-full">`.
  - `components/credits/CreditExtrasList.tsx` — List of `LoanExtraPayment` (capital contributions). Cada item expone icon buttons `Pencil` (editar) + `Trash2` (eliminar) cuando se pasan las props opcionales `onEdit` + `onDelete`. Botones con `aria-label` dinámico (monto del extra). Estado de los dialogs se eleva al padre (`CreditDetailClient`).
  - `components/credits/EditExtraPaymentDialog.tsx` — Dialog con form RHF + Zod para editar un `LoanExtraPayment`. Solo editable: `amount` (CurrencyInput) + `date` (Input type=date). `note` se preserva inmutable. Reusa `formatDateForInput` de `lib/recurrence.ts` para prefill. Toast success al guardar.
  - `components/credits/DeleteExtraPaymentDialog.tsx` — AlertDialog con resumen del extra (fecha, monto, nota) + warning "Esta acción no se puede deshacer". Patrón `DeleteExpenseDialog`. `AlertDialogAction` con `disabled` + `Loader2` spinner.
  - `components/credits/DeleteCreditDialog.tsx` — AlertDialog con cascade warning.
  - `components/credits/AvailableCreditCard.tsx` — 3 estados (good/medium/over) según `getActiveLoanCapacity`. Ratio tiers: < 30% emerald, 30-50% amber, > 50% rose.
  - `components/credits/AILoanAdvisorCard.tsx` — Per-loan AI (24h memory cache).
  - `components/credits/AILoanInsightsBanner.tsx` — Cross-loan insights (1h memory cache).
  - `components/credits/CreateFromSimulationButton.tsx` — "Convertir simulación a crédito" CTA.
  - `lib/credit-engine.ts` — `getLoanSummary` (movido desde `simulation-engine.ts`), `LOAN_HEALTH_CONFIG`, `getLoanHealthFromCapacity`, `HEALTH_THRESHOLDS`.
  - `lib/credit-types.ts` — `LOAN_TYPES`, `LOAN_STATUSES`, `LOAN_FORMULA_LABELS`, `parseLoan`, parsers defensivos.
  - `lib/loan-engine.ts` — `generateAmortizationSchedule` calcula `monthlyFee` 1 vez al inicio + emite `monthlyFee` + `totalPayment` en cada row. `calculateRemainingBalance`, `getProjectedPayoffDate`, `getDaysOverdue`.
  - `lib/loan-fees.ts` — `calculateTotalMonthlyFees`, `calculateTotalUpfrontFees`, `getFeeIcon` (Lucide picker), **`getEffectiveMonthlyPayment(carrier)` HELPER REUTILIZABLE** que retorna `parseFloat(monthlyPayment) + sum(monthly fees)/12`. Acepta `MonthlyPaymentCarrier` interface (Permissive typing: `number | string | Decimal | { toString() }`). Solo cuenta `type === "monthly"`. **Modelo annual: DB almacena valor ANUAL para `type="monthly"`; motor divide entre `ANNUAL_TO_MONTHLY=12` para obtener cuota mensual.** Análogo a `BIWEEKLY` en `/expenses`.
  - **`model LoanFee` relacional** (`prisma/schema.prisma`): `id, loanId FK Loan cascade, name, amount: Decimal(15,2), type: String ("monthly" | "upfront"), createdAt, updatedAt, @@index([loanId])`. **Migrado desde `Loan.fees Json`**: backup en `scripts/backup-loan-fees.json` + `scripts/migrate-fees-to-loan-fees.ts` (idempotente, dry-run + `--apply`). `Loan.fees` ahora es relación `LoanFee[]`.
  - `lib/ai/loan-advisor.ts` — `generateLoanAdvisorAnalysis` con cache 24h in-memory + `invalidateLoanAdvisorCache(userId, loanId)`.
  - `lib/ai/loan-insights.ts` — `generateLoanInsights` con cache 1h in-memory + `clearLoanInsightsCache(userId)`.
  - `lib/ai/loan-prompts.ts` — `LOAN_ADVISOR_SYSTEM` + `LOAN_INSIGHTS_SYSTEM` + builders.
  - `server/actions/loan-actions.ts` — 7 funciones: `createLoanAction`, `updateLoanAction`, `deleteLoanAction`, `recordPaymentAction`, `deletePaymentAction`, `recordExtraPaymentAction`, `updateExtraPaymentAction` (edita monto+fecha), `deleteExtraPaymentAction`. **TODAS invalidan AI cache** + `revalidateCreditPaths(loanId?)`. Edit/Delete de extras opera SOLO en el tab Abonos (`CreditExtrasList`); la tabla de amortización no se ve afectada.
  - **`createLoan` y `updateLoan` gestionan `fees` via la tabla relacional `LoanFee`**: `createLoan` hace `prisma.loanFee.createMany` post-create con `parsed.fees`. `updateLoan` delega al helper `syncLoanFees(loanId, fees)` (diff 3-way: update existing, create new, delete removed). Ninguno escribe a `Loan.fees` Json (ya no existe). El `return` de ambos consulta `prisma.loanFee.findMany` para devolver el estado actual.
  - **`initialExtraPayment`** en `createLoan`/`updateLoan` toma shape `{ amount: number, date: Date | string }` (no `number` aislado). El server action crea un `LoanExtraPayment` con `note = "Abono a capital previo al registro"` (constante `PREV_EXTRA_NOTE`). `updateLoan` también acepta `initialExtraPayment: { amount, date } | { amount: 0, date }` y delega al helper `syncInitialExtraPayment(loanId, input)`: `undefined` = no tocar, `amount<=0` = delete por note, `amount>0` = upsert (update existing o create new). Server valida `date <= hoy` via Zod `.refine()`.
  - `server/queries/loan-queries.ts` — `getUserLoans`, `getLoanById`, `getLoanStats`, `getActiveLoansForAI`, `getActiveLoanCapacity`.
  - **Naming convention**: `Credit*` = UI components (Spanish) / `Loan*` = domain types + Prisma model (English). Cuando en duda, el nombre del archivo refleja la capa.
  - **Moratory detection** = `loan.status === "DEFAULTED"`, NO en `LoanPayment`.
- **Capa IA (`lib/ai/` + GROQ):**
  - **Model**: `llama-3.3-70b-versatile` vía fetch directo a GROQ. **NO SDK**.
  - **4 features** activas: sim advisor, sim insights, loan advisor, loan insights.
  - **`lib/ai/groq-client.ts`** — `callGroqChat(messages, options)`. Retries 2 con backoff exponencial. **5 typed errors**: `GroqError` (base), `GroqAuthError` (401/403), `GroqRateLimitError` (429), `GroqServiceError` (5xx), `GroqTimeoutError` (AbortError), `GroqParseError` (JSON parse fail).
  - **`lib/ai/schemas.ts`** — `AdvisorAnalysisSchema`, `InsightsResponseSchema`, `LoanAdvisorSchema` (alias), `LoanInsightsSchema` (alias). Zod validation en cada response de GROQ.
  - **`lib/ai/prompts.ts`** — `SIM_ADVISOR_SYSTEM` + `SIM_INSIGHTS_SYSTEM` + builders.
  - **`lib/ai/loan-prompts.ts`** — `LOAN_ADVISOR_SYSTEM` + `LOAN_INSIGHTS_SYSTEM` + builders.
  - **`lib/ai/simulation-advisor.ts`** — `generateSimulationAdvisorAnalysis`. **DB cache 24h** en `Simulation.aiAnalysis` + `aiAnalysisGeneratedAt`.
  - **`lib/ai/simulation-insights.ts`** — `generateSimulationInsights`. **Memory cache 1h** (per process).
  - **`lib/ai/loan-advisor.ts`** — `generateLoanAdvisorAnalysis`. **Memory cache 24h** + invalidation en TODAS las mutations de loans.
  - **`lib/ai/loan-insights.ts`** — `generateLoanInsights`. **Memory cache 1h** + invalidation en TODAS las mutations.
  - **Server actions** en `server/actions/ai-actions.ts`: `generateSimulationAdvisorAction(simulationId)`, `generateSimulationInsightsAction()`, `generateLoanAdvisorAction(loanId)`, `generateLoanInsightsAction()`. Todos con `auth()` primero.
  - **Temperatures**: 0.4 advisor / 0.5 insights. Default `maxTokens: 1500`. Default `timeout: 30s`.
  - **Disclaimer UI obligatorio** en cada card: "Análisis generado por IA. No constituye asesoría financiera profesional." + cache timestamp ("Cache · 4 jun, 19:42" o "Nuevo · 4 jun, 19:42").
  - **GOTCHA: en serverless, in-memory cache es per-instance**. Aceptable porque TTL es 1-24h. Para multi-instance, migrar a DB-backed.
- **Recurrence helpers (`lib/recurrence.ts`):**
  - **Stored amount model**: `Transaction.amount` guarda el **equivalente mensual** (BIWEEKLY ×2, MONTHLY ×1, ONE_TIME ×1 raw). Para BIWEEKLY, el "monto por pago" = `amount / 2`. La migración in-place `scripts/migrate-biweekly.ts` (idempotente con backup JSON, dry-run default + `--apply`) multiplicó por 2 todas las BIWEEKLY existentes.
  - `getPerPaymentAmount(storedAmount, recurrence)` — display: BIWEEKLY `÷2`, resto `×1`. Usado en cards/lists/dialogs para mostrar "Por pago: $X" cuando aplica.
  - `toStoredAmount(displayAmount, recurrence)` — input form: BIWEEKLY `×2`, resto `×1`. Usado por `transaction-actions.ts` create/update.
  - `getNextOccurrence(date, recurrence)` — próxima fecha de ocurrencia.
  - `formatDateForInput(date)` — formato YYYY-MM-DD para `<input type="date">`.
  - `formatNextOccurrenceLabel(date, recurrence)` — etiqueta amigable para "Próxima fecha".
  - `BIWEEKLY_FACTOR = 2` constante.
  - `RECURRENCE_LABELS` + `RECURRENCE_DESCRIPTIONS`. Sin `RECURRENCE_MULTIPLIER` ni `getMonthlyEquivalent` (obsoleto).
  - **AddExpenseModal/EditExpenseModal** muestran label dinámico: "Monto (por pago)" (BIWEEKLY), "Monto total" (ONE_TIME), "Monto mensual" (MONTHLY) + hint con `Info` icon explicando el factor.
  - **EditExpenseModal** reconvierte on-the-fly: `useRef<Recurrence>` trackea last loaded; al cambiar recurrence, `toStoredAmount(current, last) → getPerPaymentAmount(stored, next) → setValue("amount", next, { shouldDirty: true })`.
  - Display consumers (ExpenseList, ExpenseCard, DeleteExpenseDialog) muestran `amount` directo + "Por pago: $ X" solo si BIWEEKLY.
- **Simulations engine** (`lib/simulation-engine.ts` + `lib/simulation-types.ts`):
  - `calculateFrenchEA(nominalMonthly)` — convierte nominal mensual a EA: `(1 + n)^12 - 1`.
  - `calculateNominalMonthly(ea)` — inverso.
  - `getVerdict(capacityRatio)` — engine `Verdict` (SAFE/TIGHT/RISKY/NOT_RECOMMENDED).
  - `ENGINE_TO_DB` + `DB_TO_ENGINE` maps: `SAFE`↔`APPROVED`, `TIGHT`↔`WARNING`, `RISKY`↔`REJECTED`.
  - `VERDICT_CONFIG` + `VERDICT_LABELS` + `VERDICT_PILL` para UI.
  - `parseSimulationInputs(raw)` + `parseSimulationResult(raw)` — defensive parsers con safe defaults.
  - `labelOr(value, map)` — forma estándar para labels de enums en UI.
  - `TYPE_LABELS` + `TYPE_ICON_BG` — config visual por tipo de simulación.
- **Scripts (`scripts/`):**
  - `scripts/seed-timeline-demo.ts` — Idempotente con `upsert` (IDs `seed-*`). Crea 2 sims (VEHICLE aprobado + HOUSING rechazado) + 1 loan con 8 payments (interés+capital computados) + 2 extras. Cargar con `npx tsx scripts/seed-timeline-demo.ts` (requiere `.env` con `DATABASE_URL`). **Usa `PrismaNeon` adapter** (igual que `lib/prisma.ts`).
  - `scripts/test-ai-prompt.ts` — Smoke test para sim AI. Genera `scripts/test-ai-output.md` (gitignored).
  - `scripts/test-loan-ai.ts` — Smoke test para loan AI. Genera `scripts/test-loan-ai-output.md` (gitignored).
  - `scripts/migrate-fees-annual.ts` — Idempotente con backup JSON. Multiplica por 12 los cargos `type="monthly"` para migrar al modelo anual. Dry-run default + `--apply`. Backup en `scripts/migrate-fees-annual.backup.json` con shape `{ createdAt, fees: Record<loanId, Record<feeId, originalAmount>> }`. Heurística: `Math.abs(currentAmount - original) < 0.5` = needs migration. Group by loan (1 update per loan). **Usa `PrismaNeon` adapter**.
  - **Recharts `ResponsiveContainer` GOTCHA**: si el seed script importa Prisma, DEBE usar `PrismaNeon` adapter. Prisma 7 strict rechaza `new PrismaClient()` directo sin adapter.

## Validation Before Commit

1. `npm run build` must pass.
2. `npx tsc --noEmit` must pass.
3. `npm run lint` must pass.
4. If Prisma schema changed: `npx prisma generate` + `npx prisma db push`.
