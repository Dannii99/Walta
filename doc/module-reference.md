# Module Reference

A module-by-module tour of the **shipped MVP**. For each of the 9 product modules + cross-cutting concerns, this document describes:

- **Purpose** — what the module does and why it exists
- **Routes** — the URL the user sees
- **Key files** — page entry, components, queries, actions
- **Data flow** — Server Component → Prisma → render + Client Islands
- **States** — empty / loading / error patterns
- **AI integration** — when applicable, the GROQ feature wired to it
- **Key decisions** — non-obvious choices made for this module

For the architectural *why* (hybrid Server/Client, Recharts wrapper, dark mode, etc.), see [`architecture.md`](./architecture.md). For *what the product is*, see [`project-context.md`](./project-context.md).

---

## 1. Auth — `/login`

### Purpose

Hardcoded single-user auth. There is exactly one user (`demo@example.com` / `demo123`). The login page exists to (a) gate the dashboard, (b) preserve a forward-looking skeleton (OAuth button disabled with "Próximamente") so the eventual multi-tenant auth is a drop-in.

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/login` | `app/(auth)/login/page.tsx` | Public | Login form |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | — | NextAuth handler (re-exports `GET` and `POST` from `lib/auth.ts`) |

### Key files

- `lib/auth.ts` — NextAuth v5 config. `CredentialsProvider` with hardcoded `authorize`. JWT strategy. `session.strategy = "jwt"`. 66 lines.
- `proxy.ts` (renamed from `middleware.ts` per Next 16 deprecation) — wraps `auth((req) => ...)`. Redirects unauthenticated users from `/` and `/dashboard/*` to `/login`. Redirects logged-in users away from `/login` to `/dashboard`.
- `app/api/auth/[...nextauth]/route.ts` — two lines: `export { GET, POST } from "@/lib/auth"`.
- `components/auth/LoginForm.tsx` — client component. Uses `signIn("credentials", { ... })` with `redirect: false`. Shows error inline.
- `components/auth/LoginHero.tsx`, `OAuthButton.tsx`, `FeaturePill.tsx`, `TrustChip.tsx` — visual + forward-looking OAuth slot.

### Data flow

```
/login (Server Component)
  → renders <LoginForm /> (Client)
  → user submits
  → signIn("credentials", { ..., redirect: false })
  → success → router.push("/dashboard")
  → failure → setError(...)
```

### States

- **Loading**: form is disabled while `signIn` is in flight (button shows `Loader2`).
- **Error**: inline `Alert destructive` above the form.
- **Empty**: not applicable (form is always present).

### Key decisions

- **`redirect: false`** instead of `redirect: true` to control the redirect client-side (avoids the Server Action + `redirect()` variable capture issue).
- **OAuth button is visible but disabled** with "Próximamente" — signals the product direction without dead-ending the design.
- **Single forward-looking backend, not a fake one**: the OAuth button is wired to a `signIn("google")` call that would 400 if clicked, but the UI label makes it clear it is not active.

---

## 2. Onboarding — `/onboarding`

### Purpose

First-run wizard. 4 steps: **Welcome → Template → Income → Review**. The user must complete it before they get a budget. After completion, the dashboard becomes available. If the user has no budget, the dashboard redirects here.

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/onboarding` | `app/onboarding/page.tsx` | Required | 4-step wizard. Top-level (not in `(dashboard)` group) because it has its own visual style. |

### Key files

- `app/onboarding/page.tsx` — Server Component. Calls `getUserBudgets`. If a budget exists, **redirects to `/dashboard`**. Otherwise renders `<OnboardingFlow />`.
- `components/onboarding/OnboardingFlow.tsx` — Client orchestrator. Manages `currentStep` state + `direction` for `AnimatePresence`.
- `components/onboarding/WelcomeStep.tsx` — animated welcome card with brand + value prop.
- `components/onboarding/TemplateStep.tsx` — 3 budget templates (Equilibrado 50/30/20, Conservador 60/20/20, Agresivo 40/30/30). Selecting one seeds categories.
- `components/onboarding/IncomeStep.tsx` — `CurrencyInput` for monthly income.
- `components/onboarding/ReviewStep.tsx` — summary + "Crear presupuesto" CTA.
- `components/onboarding/StepIndicator.tsx` — visual progress (1/4, 2/4, 3/4, 4/4).
- `server/actions/budget-actions.ts` — `createBudgetAction(formData)` is the final submit handler. Seeds 27 `PREDEFINED_CATEGORIES` + `Budget.rule = DEFAULT_BUDGET_RULE`.

### Data flow

```
/onboarding (Server)
  → getUserBudgets()
  → if budget exists → redirect /dashboard
  → else render <OnboardingFlow />

<OnboardingFlow> (Client)
  → 4 steps with local useState
  → final step → createBudgetAction(formData)
  → revalidatePath("/dashboard")
  → router.push("/dashboard")
```

### States

- **Loading**: button shows `Loader2` while `createBudgetAction` is pending.
- **Error**: Sonner toast on validation error.
- **Empty**: not applicable (always renders the wizard).

### Key decisions

- **Top-level route** (not in `(dashboard)` group) — onboarding has its own visual style with no sidebar, so the dashboard layout would have added noise.
- **27 predefined categories seeded** from `lib/categories.ts` (e.g. `Vivienda`, `Alimentación`, `Transporte`, `Salud`, `Entretenimiento`, `Ahorro`, etc.). Categories are split into 3 buckets matching the budget rule.
- **Template choice is just a starting `Budget.rule`** — categories are the same. Future: per-template category customization.
- **`AnimatePresence` with `mode="wait"`** so each step's exit animation completes before the next enters.

---

## 3. Dashboard — `/dashboard`

### Purpose

The "home" of the product. A single page that shows the user's financial health at a glance: **KPIs** (income, expenses, available), a **hero donut** of spending distribution, **3 health cards** (Needs/Wants/Savings) with traffic-light faces, and a **category breakdown** with per-category bars.

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Required | Main dashboard |
| `/` (root) | `app/page.tsx` | Required | Redirects to `/dashboard` if logged in |
| `/` (placeholder) | `app/(dashboard)/page.tsx` | Required | **DEPRECATED** — placeholder showing "Dashboard" + parseFloat income. Real dashboard is at `/dashboard`. |

### Key files

- `app/(dashboard)/dashboard/page.tsx` — Server Component. 207 lines. Loads `Budget` + `categories` + `transactions` via Prisma `include`. Computes KPIs server-side, then passes plain props to client components.
- `app/(dashboard)/dashboard/loading.tsx` — Skeleton (header + 3 KPI cards + hero + breakdown).
- `app/(dashboard)/dashboard/error.tsx` — Error boundary with `Alert destructive` + retry.
- `components/dashboard/DashboardContent.tsx` — orchestrator. Wraps everything in `DashboardProvider` for modal state.
- `components/dashboard/KPICard.tsx` — animated counter (Framer Motion `useMotionValue` + `animate`).
- `components/dashboard/CategoryDonutChart.tsx` — Recharts donut with 2 variants: `default` (compact) and `hero` (full-width, with total in center).
- `components/dashboard/HealthCards.tsx` — 3 cards with emoji traffic-light faces (😊/😐/😟), tinted backgrounds, left border accents, progress bars.
- `components/dashboard/CategoryBreakdown.tsx` — per-category rows with bars, % of total, individual limits.
- `components/dashboard/DashboardContext.tsx` — provides `openAddModal` + `triggerRefresh` across the layout.
- `components/dashboard/DashboardEmptyState.tsx`, `DashboardEmptyClient.tsx` — shown when no transactions yet.

### Data flow

```
/dashboard (Server)
  → prisma.budget.findFirst({ include: { categories: { include: { transactions } } } })
  → compute KPIs (income, expenses, available)
  → compute health status per bucket
  → serialize to plain props
  → render <DashboardContent /> with plain JSON-like data

<DashboardContent> (Client)
  → renders header, hero donut, KPIs, health cards, breakdown
  → Add Expense button opens <AddExpenseModal /> (shared with /expenses)
  → on submit → calls transaction action → revalidates /dashboard
```

### States

- **Loading**: skeleton with `animate-pulse` (header + 3 KPI placeholders + hero + breakdown).
- **Error**: error boundary shows `Alert destructive` with retry button.
- **Empty** (no transactions): "Agrega tu primer gasto" CTA + add modal.
- **Empty** (no budget): redirect to `/onboarding`.

### Key decisions

- **Server-side KPI computation** — no `useEffect` for fetching. The data is fetched in the Server Component, serialized, and passed as props. This is the **fastest possible first paint**.
- **Health thresholds** (`HEALTH_THRESHOLDS` in `lib/constants.ts`): spending ≤ 50% of bucket = good (😊), 50–80% = warn (😐), > 80% = bad (😟).
- **Hero donut total in center** — `text-3xl font-bold tabular-nums` showing the total spent + the period.
- **`DashboardProvider` for modal state** — avoids prop drilling `openAddModal` through 4 components.
- **Recurring expenses counted at monthly equivalent** — `Transaction.amount` stores the **monthly equivalent** (BIWEEKLY ×2, MONTHLY ×1, ONE_TIME ÷12). `lib/recurrence.ts` exports `toStoredAmount` (input → stored) and `getPerPaymentAmount` (stored → display). Forms apply `toStoredAmount` server-side; display shows `amount` directly + "Por pago: $X" subtitle when BIWEEKLY.

---

## 4. Gastos — `/expenses`

### Purpose

Full CRUD for expenses (the domain model is `Transaction`, but the UI/routes/components are named "Gastos"). Includes filters, totals-by-type cards, and a full table with edit/delete.

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/expenses` | `app/(dashboard)/expenses/page.tsx` | Required | Main expenses list |

### Key files

- `app/(dashboard)/expenses/page.tsx` — Server Component. Loads `getActiveBudgetWithTransactions` (budget + categories + all transactions in period).
- `components/expenses/ExpensesClient.tsx` — Client orchestrator. Holds filter state, computes filtered totals.
- `components/expenses/AddExpenseModal.tsx` — `CurrencyInput` (thousands mask) + recurrence select (Mensual/Quincenal/Única) + category select.
- `components/expenses/EditExpenseModal.tsx` — same form, preloaded.
- `components/expenses/ExpenseList.tsx` — table sorted by date desc, badges for type (Fijo/Variable) and recurrence, edit/delete actions.
- `components/expenses/ExpenseFilters.tsx` — search by description, category, type, recurrence.
- `components/expenses/ExpenseTypeCards.tsx` — 3 cards at the top showing totals for Fijos / Variables / Únicos.
- `components/expenses/ExpenseSummary.tsx` — monthly equivalent total.
- `components/expenses/DeleteExpenseDialog.tsx` — `AlertDialog` confirm.
- `components/expenses/ExpenseCard.tsx` — mobile-card variant of the row.
- `server/actions/transaction-actions.ts` — `createTransactionAction`, `updateTransactionAction`, `deleteTransactionAction`. All call `revalidatePath("/expenses")` + `revalidatePath("/dashboard")`.

### Data flow

```
/expenses (Server)
  → getActiveBudgetWithTransactions()
  → serialize to plain props
  → render <ExpensesClient />

<ExpensesClient> (Client)
  → holds filter state (search, category, type, recurrence)
  → useMemo to derive filteredTransactions + totals
  → renders <ExpenseTypeCards /> + <ExpenseList />
  → "Add expense" → <AddExpenseModal />
  → on submit → createTransactionAction()
  → revalidate /expenses + /dashboard
  → modal closes, list refreshes
```

### States

- **Loading**: skeleton (header + 3 totals + table).
- **Error**: error boundary with retry.
- **Empty**: "No tienes gastos aún. Agrega tu primer gasto." + add modal CTA.
- **Filtered empty**: "No hay gastos que coincidan con tus filtros." + "Limpiar filtros" button.

### Key decisions

- **Domain model is `Transaction`** (Prisma), UI is "Gastos" — kept the existing table name to avoid a migration but renamed the entire UI surface to the user-friendly Spanish term.
- **`recurrence` field on `Transaction`** — defaults to `"MONTHLY"`. Values: `"MONTHLY"`, `"BIWEEKLY"`, `"ONE_TIME"`. `Transaction.amount` stores the **monthly equivalent**; `server/actions/transaction-actions.ts` applies `toStoredAmount` (BIWEEKLY ×2, ONE_TIME ÷12) before persisting. `scripts/migrate-biweekly.ts` migró los registros existentes in-place.
- **No date-range filter** — the date filter is implicit (current month). A `RECURRENCE` filter is more actionable for budgeting.
- **Filter state in `useState`, not URL** — `useSearchParams` would survive page refresh but adds complexity. Filters reset on navigation, which is acceptable for a single-session workflow.

---

## 5. Reglas — `/reglas`

### Purpose

Edit the 3 inputs that drive all derived calculations: **income**, the **50/30/20 rule percentages**, and the **list of categories** (CRUD). This is the "control panel" of the budget.

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/reglas` | `app/(dashboard)/reglas/page.tsx` | Required | 3 tabs: Ingreso, Regla, Categorías |

### Key files

- `app/(dashboard)/reglas/page.tsx` — Server Component. Loads `getUserBudgets` (budget + categories), renders `<ReglasClient />`.
- `app/(dashboard)/reglas/loading.tsx` — skeleton.
- `components/reglas/ReglasClient.tsx` — orchestrator with custom `<Tabs />` + `AnimatePresence`.
- `components/reglas/Tabs.tsx` — custom tabs with ARIA (role="tablist", aria-selected, aria-controls) + keyboard nav (ArrowLeft/Right, wrap).
- `components/reglas/IncomeEditor.tsx` — hero card + inline form. `CurrencyInput` for monthly income.
- `components/reglas/RuleEditor.tsx` — 3 percentage inputs (Necesidades / Deseos / Ahorro) with progress bars + sum check (must = 100%).
- `components/reglas/CategoryManager.tsx` — list of categories with edit/delete + add new. Uses `AlertDialog` for delete confirm.
- `server/actions/budget-actions.ts` — `updateIncomeAction`, `updateRuleAction`.
- `server/actions/category-actions.ts` — `createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction`.

### Data flow

```
/reglas (Server)
  → getUserBudgets()
  → render <ReglasClient />

<ReglasClient> (Client)
  → tab state via useState
  → <IncomeEditor> → updateIncomeAction()
  → <RuleEditor> → updateRuleAction()
  → <CategoryManager> → CRUD actions
  → revalidatePath("/reglas") on each
  → also revalidatePath("/dashboard") (income change affects KPIs)
```

### States

- **Loading**: skeleton.
- **Error**: error boundary with retry.
- **Empty**: not applicable (always has a budget once onboarding is complete).
- **No budget**: redirect to `/onboarding`.

### Key decisions

- **Rule sum must be 100%** — the form shows a warning if `needsPct + wantsPct + savingsPct !== 100`. The save button is disabled until it is valid.
- **`AlertDialog` for delete category** — `AlertDialogDescription` renders a `<div>`, so we use a child `<p>` if paragraph styling is needed. The `AlertDialogAction` button **does not support `disabled`**, so we conditionally render it as a `<Button variant="ghost">` close action.
- **3 tabs but no URL sync** — tabs are local state. Future: `?tab=rule` to make links shareable.

---

## 6. Simulaciones — `/simulations`

### Purpose

Evaluate if a major financial decision is **viable against the user's real budget**. Types: **VEHICLE**, **HOUSING_ARRIENDO**, **HOUSING_COMPRA**, **PERSONAL**, **EDUCATION**, **OTHER**. The user enters price, down payment, term, rate, formula. The engine computes the monthly payment, available money after, verdict (APPROVED/WARNING/REJECTED), and total interest.

This module also integrates the AI layer: **AI Advisor** (deep one-shot analysis on a saved sim) and **AI Insights** (banner with the top 3 strategic findings across all sims).

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/simulations` | `app/(dashboard)/simulations/page.tsx` | Required | List + AI Insights Banner |
| `/simulations/new` | `app/(dashboard)/simulations/new/page.tsx` | Required | Simulator form + Available money card |
| `/simulations/[id]` | `app/(dashboard)/simulations/[id]/page.tsx` | Required | Detail + AI Advisor + Delete |

### Key files

- `app/(dashboard)/simulations/page.tsx` — Server Component. Calls `getUserSimulations` + `getSimulationStats`. Renders `<SimulationsClient />`.
- `app/(dashboard)/simulations/new/page.tsx` — Server Component. 2-col grid: `<SimulatorForm />` + `<AvailableMoneyCard />`.
- `app/(dashboard)/simulations/[id]/page.tsx` — Server Component with `generateMetadata` + `params: Promise<{id}>`. Loads sim + renders detail with `<DeleteSimulationDialog />` + `<AIAdvisorCard />`.
- `components/simulations/SimulationsClient.tsx` — orchestrator with filter + grid.
- `components/simulations/SimulatorForm.tsx` — the form. Client-side preview before submit. RHF + Zod.
- `components/simulations/AIAdvisorCard.tsx` — Client component. `useTransition` + `useEffect` mount trigger to call `generateSimulationAdvisorAction(loanId)`. Shows disclaimer.
- `components/simulations/AIInsightsBanner.tsx` — banner at the top of the list. Calls `generateSimulationInsightsAction()`.
- `components/simulations/AvailableMoneyCard.tsx` — shows the user's available monthly money (after current expenses + active loans).
- `components/simulations/DeleteSimulationDialog.tsx` — `AlertDialog` confirm.
- `lib/simulation-engine.ts` — `calculateFrenchEA`, `calculateNominalMonthly`, `getVerdict`, `VERDICT_CONFIG`. Re-exports `getLoanSummary` for back-compat.
- `lib/simulation-types.ts` — `SimulationInputRow`, `SimulationResultRow`, `Verdict` (engine) vs `DbVerdict` (DB), `ENGINE_TO_DB` / `DB_TO_ENGINE` maps, parsers, labels.
- `lib/ai/simulation-advisor.ts` — `generateSimulationAdvisorAnalysis`. **DB cache 24h** (writes to `Simulation.aiAnalysis` + `aiAnalysisGeneratedAt`).
- `lib/ai/simulation-insights.ts` — `generateSimulationInsights`. **Memory cache 1h** (per process).
- `lib/ai/prompts.ts` — `SIM_ADVISOR_SYSTEM` + `SIM_INSIGHTS_SYSTEM` + builders.
- `lib/ai/schemas.ts` — `AdvisorAnalysisSchema` + `InsightsResponseSchema` (Zod).
- `server/actions/simulation-actions.ts` — `createSimulationAction`, `deleteSimulationAction`. Invalidate `/simulations` + `/dashboard`.
- `server/actions/ai-actions.ts` — `generateSimulationAdvisorAction`, `generateSimulationInsightsAction`.

### Data flow

```
/simulations (Server)
  → getUserSimulations() + getSimulationStats()
  → render <SimulationsClient />
  → inside: <AIInsightsBanner /> triggers AI on mount

/simulations/new (Server)
  → getActiveBudget + compute available money
  → render <SimulatorForm /> (Client)
  → on submit → createSimulationAction()
  → engine computes in same call (pure math, no AI)
  → revalidate /simulations

/simulations/[id] (Server)
  → getSimulationById
  → if not found → notFound()
  → render <SimulationDetail> with <AIAdvisorCard />
  → <AIAdvisorCard> on mount → generateSimulationAdvisorAction()
  → reads Simulation.aiAnalysis (DB cache) OR calls GROQ
  → Zod validation → render
```

### States

- **Loading**: skeleton (header + 4 sim cards).
- **Error**: error boundary with retry.
- **Empty**: "Aún no tienes simulaciones. Crea tu primera simulación." + CTA to `/simulations/new`.
- **AI loading**: `Loader2` spinner with "Analizando con IA..." + a 2-line placeholder for the response.
- **AI error**: red `Alert` with retry button. Cache may be stale; the action invalidates on each call.

### AI integration

- **AI Advisor** (per-sim deep analysis): 24h DB cache. Stored in `Simulation.aiAnalysis` as JSON. On mount, the client calls the action; if cache is fresh, no GROQ call. Otherwise GROQ `llama-3.3-70b-versatile` is called with `temperature: 0.4` and the user's budget context. Zod-validated.
- **AI Insights** (cross-sim strategic banner): 1h in-memory cache. Generated from all sims + budget context. Temperature 0.5.

### Key decisions

- **Engine vs DB verdict mapping** — the engine returns `Verdict` ("SAFE" | "TIGHT" | "RISKY" | "NOT_RECOMMENDED") with hardcoded thresholds. The DB stores `DbVerdict` ("APPROVED" | "WARNING" | "REJECTED"). `ENGINE_TO_DB` / `DB_TO_ENGINE` keep the layers clean.
- **`calculateFrenchEA` is the canonical calculator** — converts nominal monthly to effective annual via `(1 + nominal)^12 - 1`. Used for both sims and loans.
- **Available money card** shows the user what they can actually afford — `income - current expenses - active loan payments`. This is the "viable monthly" number.
- **Verdict badge** uses `bg-{emerald/amber/rose}-100 dark:bg-{color}-950/40` + `border-{color}-200 dark:border-{color}-900` + `text-{color}-800 dark:text-{color}-400`.
- **`AlertDialogAction` does not support `disabled`** — for the delete confirm, the form must be valid before the user can click the action. We disable the trigger button instead.

---

## 7. Créditos — `/credits`

### Purpose

Track active and historical loans. Each loan has: type (VEHICLE/HOUSING/PERSONAL/etc.), principal, term, rate, formula, fees, and a full **amortization table**. The user can **record payments** (with interest/principal split computed automatically) and **extra payments** (capital contributions). Like `/simulations`, this module has **AI Advisor** (per-loan deep analysis) and **AI Insights** (cross-loan strategic banner).

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/credits` | `app/(dashboard)/credits/page.tsx` | Required | List + AI Insights Banner + Available credit card |
| `/credits/new` | `app/(dashboard)/credits/new/page.tsx` | Required | 3-step LoanForm wizard |
| `/credits/[id]` | `app/(dashboard)/credits/[id]/page.tsx` | Required | Detail: header + summary + payments + extras + amortization + AI Advisor |
| `/credits/[id]/edit` | `app/(dashboard)/credits/[id]/edit/page.tsx` | Required | Reuse LoanForm in edit mode |

### Key files

- `app/(dashboard)/credits/page.tsx` — Server Component. Loads `getUserLoans` + `getActiveLoanCapacity`. Renders `<CreditsClient />`.
- `app/(dashboard)/credits/new/page.tsx` — Server Component with `<AvailableCreditCard />` + 2-col grid (form + preview).
- `app/(dashboard)/credits/[id]/page.tsx` — Server Component with null pattern + `notFound()`. Renders `<CreditDetailClient />`.
- `app/(dashboard)/credits/[id]/edit/page.tsx` — 89 lines. Loads loan, renders `<LoanForm mode="edit" />` with preloaded data.
- `components/credits/CreditsClient.tsx` — list orchestrator + `<AILoanInsightsBanner />`.
- `components/credits/CreditCard.tsx` — single loan card in the list. Shows type, principal, term, monthly payment, progress, status.
- `components/credits/CreditsFilters.tsx` — multi-select chips (status, type) with `data-active` + `aria-pressed`.
- `components/credits/EmptyCreditsState.tsx` — empty state with CTA to `/credits/new`.
- `components/credits/NewCreditButton.tsx` — **custom dropdown** (not Radix) with `useState` + `useRef` + click outside + ESC. Avoids the Radix menu layout cost.
- `components/credits/LoanForm.tsx` — **3-step wizard** (Datos → Cuotas → Confirmar). 748 lines. RHF + Zod. Steps:
  1. **Datos**: type, principal, term, rate, formula, down payment.
  2. **Cuotas**: fees (add/remove — admin/insurance/other).
  3. **Confirmar**: review + submit.
- `components/credits/LoanPreviewCard.tsx` — live preview using the same engine.
- `components/credits/FeeForm.tsx`, `FeeCard.tsx`, `FeesSection.tsx` — SaaS-style fee CRUD.
- `components/credits/CreditDetailClient.tsx` — detail orchestrator.
- `components/credits/CreditDetailHeader.tsx` — title + status badge + actions (Edit, Delete, Record Payment).
- `components/credits/CreditSummary.tsx` — 4 KPI cards (principal, paid, remaining, next payment).
- `components/credits/CreditProgressBar.tsx` — paid/remaining visual.
- `components/credits/CreditPaymentsList.tsx` — list of `LoanPayment` with sort + badges.
- `components/credits/CreditExtrasList.tsx` — list of `LoanExtraPayment` (capital contributions).
- `components/credits/CreditAmortizationTable.tsx` — full amortization with paid/pending highlighting.
- `components/credits/CreditCharts.tsx` — 2 Recharts charts (capital over time, interest vs principal). Each wrapped in `<div className="h-[250px] w-full">`.
- `components/credits/DeleteCreditDialog.tsx` — `AlertDialog` confirm with cascade warning (deletes payments + extras).
- `components/credits/AvailableCreditCard.tsx` — 3 states (good/medium/over) based on `getActiveLoanCapacity`. Ratio tiers: < 30% emerald, 30-50% amber, > 50% rose.
- `components/credits/AILoanAdvisorCard.tsx` — per-loan AI analysis (24h memory cache).
- `components/credits/AILoanInsightsBanner.tsx` — cross-loan insights (1h memory cache).
- `components/credits/CreateFromSimulationButton.tsx` — CTA on sim detail to "Convertir a crédito" (copies inputs to LoanForm).
- `lib/credit-engine.ts` — `getLoanSummary` (moved from `simulation-engine.ts`), `LOAN_HEALTH_CONFIG`, `getLoanHealthFromCapacity`, `HEALTH_THRESHOLDS`.
- `lib/credit-types.ts` — `LOAN_TYPES`, `LOAN_STATUSES`, `LOAN_FORMULA_LABELS`, `parseLoan`, parsers.
- `lib/loan-engine.ts` — `generateAmortizationSchedule`, `calculateRemainingBalance`, `getProjectedPayoffDate`, `getDaysOverdue`, status detection.
- `lib/loan-fees.ts` — `calculateTotalMonthlyFees`, `calculateTotalUpfrontFees`, `getFeeIcon` (Lucide picker).
- `lib/ai/loan-advisor.ts` — `generateLoanAdvisorAnalysis` (24h memory cache + `invalidateLoanAdvisorCache(userId, loanId)`).
- `lib/ai/loan-insights.ts` — `generateLoanInsights` (1h memory cache + `clearLoanInsightsCache(userId)`).
- `lib/ai/loan-prompts.ts` — `LOAN_ADVISOR_SYSTEM` + `LOAN_INSIGHTS_SYSTEM` + builders.
- `server/actions/loan-actions.ts` — 6 functions: `createLoanAction`, `updateLoanAction`, `deleteLoanAction`, `recordPaymentAction`, `deletePaymentAction`, `recordExtraPaymentAction`, `deleteExtraPaymentAction`. **All invalidate AI cache** + `revalidateCreditPaths(loanId?)`.

### Data flow

```
/credits (Server)
  → getUserLoans() + getActiveLoanCapacity()
  → render <CreditsClient />
  → <AILoanInsightsBanner /> triggers AI on mount

/credits/new (Server)
  → getActiveLoanCapacity()
  → render <AvailableCreditCard /> + <LoanForm mode="new" />

/credits/[id] (Server)
  → getLoanById()
  → if null → notFound()
  → render <CreditDetailClient />
  → <AILoanAdvisorCard /> on mount → generateLoanAdvisorAction()
  → memory cache OR GROQ → Zod → render
```

### States

- **Loading**: skeleton.
- **Error**: error boundary with retry.
- **Empty**: "No tienes créditos activos. Crea tu primer crédito." + CTA.
- **AI loading**: `Loader2` with "Analizando con IA..." placeholder.
- **Overdue (moratory)**: row tinted `bg-rose-50/50 dark:bg-rose-950/20` + red badge.

### AI integration

- **AI Loan Advisor** (per-loan deep analysis): 24h in-memory cache. Invalidated on any loan mutation.
- **AI Loan Insights** (cross-loan banner): 1h in-memory cache. Invalidated on any loan mutation.
- **All AI calls include the user's budget context** — income, expenses, rule, current loans. This is what makes the advice personal.

### Key decisions

- **`Credit*` (UI) vs `Loan*` (domain)** naming convention — UI is in Spanish ("Crédito"), domain is in English ("Loan"). When in doubt, the file name reflects the layer.
- **Custom dropdown, not Radix Menu** — `NewCreditButton` has 2 items (New, From Simulation). Radix Menu added ~10KB for a 2-item picker. A custom `useState` + `useRef` + click outside + ESC keyboard handler is ~30 lines and zero dependencies.
- **3-step wizard for the loan form** — Datos → Cuotas → Confirmar. The form is 748 lines, so splitting by step is essential for readability.
- **AI cache invalidation on EVERY mutation** — even a payment recording affects the advisor's "next payment" analysis, so we invalidate.
- **Moratory detection** = `loan.status === "DEFAULTED"`, NOT on `LoanPayment`. A loan becomes DEFAULTED when it has overdue payments.
- **`getActiveLoanCapacity` vs `getLoanStats`** — `getLoanStats` includes all loans (active + paid off + defaulted). `getActiveLoanCapacity` only includes ACTIVE loans. The Available Credit Card uses the latter.
- **Recharts in `CreditCharts.tsx`** — 2 charts, both wrapped in `<div className="h-[250px] w-full">`. Pattern is enforced in `architecture.md §10`.

---

## 8. Historial — `/history`

### Purpose

A **decisions timeline**, not a monthly closing. Shows the user's financial decisions chronologically: simulations created, loans created, loan payments recorded, extra payments (capital contributions), and a synthetic "loan paid off" event. Data is **derived on-the-fly** from `Simulation` + `Loan` + `LoanPayment` + `LoanExtraPayment` — no `Event` table.

Two tabs:
- **Timeline** (default) — the cronological event list with filters and "Cargar más" pagination.
- **Snapshots** (legacy) — manual `MonthlySnapshot` cards from before the refactor. Visible for backwards compatibility.

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/history` | `app/(dashboard)/history/page.tsx` | Required | Timeline tab (default) |
| `/history?tab=snapshots` | same | Required | Snapshots tab (legacy) |

### Key files

- `app/(dashboard)/history/page.tsx` — Server Component. 95 lines. `searchParams: Promise<{tab?}>`. `Promise.all([getUserBudgets, getTimelineEvents])`. Tab is local state on the client (`<Tabs />`).
- `app/(dashboard)/history/loading.tsx` — skeleton (header + tabs + 6 cards).
- `app/(dashboard)/history/error.tsx` — error boundary with `<Alert destructive />` + retry.
- `components/history/Tabs.tsx` — custom 2-tab control with ARIA + URL sync via `useRouter` + `useSearchParams`.
- `components/history/Timeline.tsx` — Client orchestrator. `useTransition` + `useMemo` for filtered + grouped events. Calls `loadMoreTimelineAction()` for pagination.
- `components/history/TimelineEvent.tsx` — single event card with discriminated union switch + `motion.li` stagger (`initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, duration: 0.25`). Verdict badge inline.
- `components/history/EventIcon.tsx` — `EVENT_VISUAL` map with Lucide icon, `dotClass`/`ringClass`/`iconBgClass`/`iconFgClass`. 5 types.
- `components/history/TimelineFilters.tsx` — multi-select chips with `data-active` + `aria-pressed` + count.
- `components/history/TimelineEmpty.tsx` — empty state with CTAs (to `/simulations/new` or `/credits/new` if has budget, else `/onboarding`).
- `components/history/TimelineSkeleton.tsx` — 6 cards with `animate-pulse`.
- `components/history/SnapshotsLegacy.tsx` — wrapper with `<Alert warning />` + `<HistoryChart />` + `<MonthlySnapshotCard />` grid.
- `components/history/HistoryChart.tsx` — Recharts wrapper, audited. `<div className="h-80">` parent.
- `components/history/MonthlySnapshotCard.tsx` — single snapshot card. Savings rate badge.
- `lib/timeline-types.ts` — discriminated union + Zod schemas + labels + `buildEventId` helper. **No `import "server-only"`** (must be importable from client).
- `server/queries/timeline-queries.ts` — `getTimelineEvents(userId, opts)` (Prisma) + `buildTimelineEvents(raw, types)` (pure) + `sortAndPaginateEvents(events, limit, cursor)` (pure).
- `server/actions/timeline-actions.ts` — `loadMoreTimelineAction({ cursor, types, limit? })` with `auth()` + `timelineEventTypesSchema.parse`. `pageSize` default 30, max 100, min 1.
- `scripts/seed-timeline-demo.ts` — idempotent seed (IDs `seed-*`) for testing. 2 sims + 1 loan with 8 payments + 2 extras.

### Data flow

```
/history?tab=timeline (Server)
  → getUserBudgets() + getTimelineEvents() [parallel]
  → render <Timeline initialEvents={...} initialTotal={...} />

<Timeline> (Client)
  → holds events in useState
  → useMemo: filter by selected types → group by month
  → renders month headers + <TimelineEvent /> per event
  → "Cargar más" button → loadMoreTimelineAction({ cursor, types, limit: 30 })
  → response appended to events
  → end-of-list: motion.p fade-in "Has llegado al final de tu línea de tiempo."
```

### Event types

| Type | Source | Derived from | Display |
|------|--------|-------------|---------|
| `SIMULATION_CREATED` | `Simulation.createdAt` | row existence | verdict badge + monthly payment |
| `LOAN_CREATED` | `Loan.createdAt` | row existence | loanType + principal + term |
| `LOAN_PAYMENT` | `LoanPayment.paidDate` | each row | installment # + capital/interest split |
| `LOAN_EXTRA_PAYMENT` | `LoanExtraPayment.date` | each row | amount + note |
| `LOAN_PAID_OFF` (synthetic) | derived | `paidInstallments >= termMonths` | "Pagado" badge |

### States

- **Loading**: skeleton.
- **Error**: error boundary with retry.
- **Empty (no events)**: `<TimelineEmpty />` with CTAs based on `hasBudget`.
- **Filtered empty**: "No hay eventos de este tipo." with "Limpiar filtros" button.
- **End of list**: "Has llegado al final de tu línea de tiempo." with motion fade-in.

### Key decisions

- **No `Event` table** — events are derived on-the-fly from the source tables. Trade-off: more query complexity in the page, but no migration and no risk of stale events.
- **Cursor pagination** — cursor is `{ occurredAt: ISOString, id: string }` (object, not base64). In DESC order, "after cursor" = `eTime < cursorTime || (eTime === cursorTime && e.id < cursor.id)`. `localeCompare` with INVERTED sign.
- **`pageSize` default 30, max 100** — 30 fits the screen (6-8 events visible), 100 is the safety cap.
- **`lib/timeline-types.ts` has no `import "server-only"`** — must be importable from client (for `TimelineFilters`, `TimelineEvent`).
- **`vitest` config** — `test.server.deps.inline: ["next-auth", "@auth/core"]` (because `auth()` imports `next-auth/lib/env.js` → `next/server`). Alias `server-only` → `tests/stubs/server-only.ts`.
- **2 tabs but legacy snapshots are NOT deleted** — backwards compatibility. The `<Alert warning />` makes it clear the timeline is the new way.

---

## 9. Configuración — `/settings`

### Purpose

Account-level settings. Currently: **theme** (light/dark/system) and **account info** (avatar, email, sign out). No danger zone, no delete account, no currency switcher (all those are future).

### Routes

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/settings` | `app/(dashboard)/settings/page.tsx` | Required | Theme + account |

### Key files

- `app/(dashboard)/settings/page.tsx` — Server Component. 2 sections: `<ThemeSelector />` + `<AccountSection />`.
- `app/(dashboard)/settings/loading.tsx` — skeleton.
- `components/settings/ThemeSelector.tsx` — 3 cards (Light/Dark/System) in a grid with Framer Motion checkmark. Uses `useTheme()` from next-themes.
- `components/settings/AccountSection.tsx` — `useSession()`, avatar, email, sign-out button.
- `components/shared/ThemeToggle.tsx` — compact Sun/Moon button in the sidebar footer. Uses `useTheme()` + `useSyncExternalStore` for hydration safety.

### Data flow

```
/settings (Server)
  → render <ThemeSelector /> + <AccountSection />

<ThemeSelector> (Client)
  → useTheme() to read current
  → click → setTheme(...)
  → next-themes writes to localStorage + applies class to <html>

<AccountSection> (Client)
  → useSession() to read user
  → sign-out button → signOut() → redirect /login
```

### States

- **Loading**: skeleton (theme grid + account card).
- **Error**: error boundary with retry.
- **Empty**: not applicable.

### Key decisions

- **Theme uses `useSyncExternalStore`** to avoid `react-hooks/set-state-in-effect` ESLint rule. Server snapshot returns `false`, client snapshot returns `true`. The pattern is documented in `architecture.md §10`.
- **No delete account** — would need cascade delete (budgets, categories, transactions, simulations, loans, payments, snapshots, extras). Deferred to a future iteration.
- **No currency switcher** — single currency (COP) in the MVP. The `DEFAULT_CURRENCY` constant in `lib/constants.ts` is the only source of truth.

---

## 10. Cross-cutting Concerns

These don't belong to one module but cut across all of them.

### 10.1 Sidebar + Mobile Navigation

- `components/shared/Sidebar.tsx` — desktop sidebar, **collapsible**. Width `w-[68px]` by default, `hover:w-64` on hover (group-based). Active route highlighted with left border + bg.
- `components/shared/MobileBottomNav.tsx` — bottom tab bar on mobile (`<md`). 4 items: Dashboard, Gastos, Simulaciones, Créditos. Reglas / Historial / Configuración are accessible via the sidebar drawer.
- The sidebar lives in `app/(dashboard)/layout.tsx`. The mobile bottom nav is rendered after the main content with `pb-16 md:pb-0` on the content area.
- **Active state** is computed from `usePathname()` against the link's `href.startsWith(path)`.

### 10.2 Auth + Redirects

- `proxy.ts` (renamed from `middleware.ts` per Next 16 deprecation) — wraps `auth((req) => ...)`. Redirects unauthenticated users from `/`, `/dashboard/*` to `/login`. Redirects logged-in users from `/login` to `/dashboard`.
- Every Server Component calls `await auth()` to read the session. If `session?.user?.id` is missing, it redirects.
- The `auth()` function is `next-auth` v5. It imports `next-auth/lib/env.js` which requires `next/server`. This is why `vitest.config.ts` has `test.server.deps.inline: ["next-auth", "@auth/core"]`.

### 10.3 Theme (Light / Dark / System)

- `app/providers.tsx` wraps with `<ThemeProvider attribute="class" storageKey="walta-theme" disableTransitionOnChange>`.
- `app/layout.tsx` adds `suppressHydrationWarning` to `<html>` to prevent the next-themes flash warning.
- `app/globals.css` must contain `@custom-variant dark (&:is(.dark, .dark *));` immediately after `@import "tailwindcss"`. Without it, `dark:` doesn't respond to the toggle.
- The theme applies by adding `.dark` to `<html>`. Tailwind v4 reads the class via the custom variant.

### 10.4 AI Layer

- **Provider**: GROQ via `fetch`. Model: `llama-3.3-70b-versatile`. Configured in `lib/ai/groq-client.ts`.
- **Wrapper**: `callGroqChat(messages, options)` with retries (2) + exponential backoff + 5 typed errors: `GroqError`, `GroqAuthError`, `GroqRateLimitError`, `GroqServiceError`, `GroqTimeoutError`, `GroqParseError`.
- **Schemas** (Zod): `AdvisorAnalysisSchema`, `InsightsResponseSchema`, plus loan aliases. Validation runs on every GROQ response.
- **Cache strategy**:
  - **DB-backed (24h)**: `Simulation.aiAnalysis` + `aiAnalysisGeneratedAt`. Used for sim advisor.
  - **In-memory (24h)**: per-process Map. Used for loan advisor. Invalidated on any loan mutation.
  - **In-memory (1h)**: per-process Map. Used for sim insights + loan insights. Invalidated on any mutation.
- **Actions**: `generateSimulationAdvisorAction(simulationId)`, `generateSimulationInsightsAction()`, `generateLoanAdvisorAction(loanId)`, `generateLoanInsightsAction()`. All call `auth()` first.
- **Disclaimer UI**: every AI card shows "Análisis generado por IA. No constituye asesoría financiera profesional." plus the cache timestamp ("Cache · 4 jun, 19:42" or "Nuevo · 4 jun, 19:42").

### 10.5 Error / Loading / Empty States

A consistent pattern is used across modules:

- **Loading**: a sibling `loading.tsx` with `animate-pulse` skeleton matching the page structure. Group default in `app/(dashboard)/loading.tsx`.
- **Error**: a sibling `error.tsx` (Client Component) with `Alert destructive` + retry button. Group default in `app/(dashboard)/error.tsx`.
- **Empty**: an inline empty state with a contextual CTA. Examples:
  - Dashboard: "Agrega tu primer gasto" + add modal.
  - Gastos: "Crea tu primer gasto" + modal CTA.
  - Simulaciones: CTA to `/simulations/new`.
  - Créditos: CTA to `/credits/new`.
  - Historial: CTA to `/simulations/new` or `/credits/new` based on `hasBudget`, else `/onboarding`.
  - Reglas: not applicable (budget must exist).
- **No-budget redirect**: dashboard, reglas, expenses, simulations, credits, history all redirect to `/onboarding` if no budget.

### 10.6 Toasts

- `<Toaster position="top-right" richColors />` in `app/providers.tsx` (sonner).
- Pattern: `toast.success("Gasto creado", { description: "..." })` after successful server action. `toast.error("...")` on validation failure.
- `Loading` toasts are rare; the `useTransition` pattern provides inline feedback instead.

### 10.7 Money Display

- `formatCOP(amount)` in `lib/currency.ts` uses `Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 })`. Output: `$ 1.234.567` (no decimals, since Colombia does not use centavos).
- `tabular-nums` is added to all monetary values in tables and cards (prevents layout shift when values change).
- **NO `number` for money in business logic** — `Decimal` in Prisma, `string` in JSON/API, Dinero.js in `lib/currency.ts`. The rule is enforced by code review, not lints.

### 10.8 Validation Pipeline

- **Server actions**: every action validates input with Zod before touching Prisma. The schema lives in the same file as the action.
- **Client forms**: React Hook Form + Zod resolver. The same schema is shared between client and server when possible (e.g. `loanFormSchema` in `lib/credit-types.ts`).
- **AI responses**: Zod validation. If validation fails, the action throws `GroqParseError` and the UI shows a retry button.

### 10.9 Scripts

- `scripts/seed-timeline-demo.ts` — `npx tsx scripts/seed-timeline-demo.ts`. Seeds 2 sims + 1 loan + 8 payments + 2 extras. Idempotent (uses `upsert` with deterministic IDs).
- `scripts/test-ai-prompt.ts` — smoke test for sim AI. Outputs `scripts/test-ai-output.md` (gitignored).
- `scripts/test-loan-ai.ts` — smoke test for loan AI. Outputs `scripts/test-loan-ai-output.md` (gitignored).

### 10.10 Testing

- **Vitest** (unit): 119 tests across 9 files. All pure functions. jsdom environment. `@/` alias mapped.
- **Playwright** (E2E): installed, no specs. Used ad-hoc for smoke tests (e.g. `/history` timeline screenshots).
- **Type check**: `npx tsc --noEmit` (must be 0 errors before commit).
- **Lint**: `npm run lint` (flat config, must be 0 warnings before commit).
- **Build**: `npm run build` (17 routes, must pass before commit).

### 10.11 Container Pattern

All pages use:

```tsx
<main className="max-w-[1440px] mx-auto p-4 md:px-6 lg:px-10 py-6 md:py-8">
  <div className="space-y-6 md:space-y-8">
    {/* content */}
  </div>
</main>
```

Forms add an inner `max-w-3xl` for readability.

### 10.12 SaaS Card Pattern

All cards use:

```tsx
<Card className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6">
```

Plus `CardHeader`, `CardTitle`, `CardContent` as needed.

### 10.13 Recharts Wrapper Pattern

All Recharts containers:

```tsx
<div className="h-[Npx] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <Chart>...</Chart>
  </ResponsiveContainer>
</div>
```

`h-[Npx]` values used: 250 (credits), 320/360 (limits), 340 (donut), `h-80` (history).

---

## See Also

- [`architecture.md`](./architecture.md) — the architectural *why*. Hybrid pattern, Recharts wrapper, dark mode tokens, AI module, Prisma schema, 12 implementation phases.
- [`project-context.md`](./project-context.md) — the product *what* and *why*. Vision, users, MVP scope, success metrics, what's next.
- [`setup-plan.md`](./setup-plan.md) — the developer *how to start*. Stack, dependencies, first run, validation.
- [`../AGENTS.md`](../AGENTS.md) — the agent *quickstart*. Stack, dev commands, architecture entrypoints, current state, validation before commit.
