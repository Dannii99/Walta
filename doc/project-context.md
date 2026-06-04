# Project Context

The "what" and "why" of **Walta — Tu dinero, más claro**. This document describes the product vision, target users, MVP scope, and success criteria. It is intentionally **product-focused**, not implementation-focused.

For how the product is *built* today, see [`architecture.md`](./architecture.md). For module-by-module implementation details, see [`module-reference.md`](./module-reference.md). For developer setup, see [`setup-plan.md`](./setup-plan.md). For the agent quickstart, see [`../AGENTS.md`](../AGENTS.md).

## 1. Project Summary

A web app for personal budget control that **replaces spreadsheets with a visual, interactive, decision-oriented experience**. Users create budgets, register income and categorized expenses, see their financial health via graphs and color indicators, evaluate if they follow healthy financial rules (e.g. 50/30/20 distribution), and simulate major decisions (vehicle, housing, savings goals) to understand if they are viable against their real budget capacity.

The product is **web-only**, single-currency (COP), with a hardcoded demo user in the MVP. The product speaks Spanish.

## 2. Problem Statement

Most people control their personal finances in Excel or do not control them in a structured way. This generates three main problems:

- **Lack of visual clarity**: Numbers in a table do not let you see immediately if the financial situation is healthy, if you are overspending, or how much money is actually available.
- **Difficulty applying financial rules**: Concepts like "spend at most 50% on needs" or "save 20%" are hard to monitor manually without errors.
- **Uncertainty in big decisions**: When a person wants to know if they can buy a car, a house, or invest, they turn to isolated calculators or assumptions without integrating their real budget. There is no tool that connects daily financial situation with the viability of important decisions.

## 3. Target Users

### Primary User

- **Adults aged 25 to 45** with fixed or variable income who want to organize their personal finances without complexity.
- Users who have tried using Excel but abandoned it for lack of time or because it did not give them insights.
- People who are considering important purchases (vehicle, housing) and need to validate if they can take them on.

### Secondary User

- **Couples or families** who want to visualize a joint budget (in future iterations).
- **Young professionals** who are starting to live independently and want to create their first budget with guidance.

## 4. Value Proposition

"Understand your money at a glance and make big decisions with confidence."

Instead of being a passive table, the product is a **visual financial assistant** that:

- Shows if your budget is healthy with colors and clear signals (traffic-light style).
- Tells you exactly how much you can allocate to each category according to proven financial rules.
- Simulates important decisions using your real budget, not loose estimates.
- Feels modern, fast and motivating, not like a bookkeeping chore.

## 5. MVP Objective

Ship a working web app that lets a user:

1. Create a personal budget in under 5 minutes.
2. Visualize their current financial state immediately and attractively.
3. Know if they are complying with an income distribution rule.
4. Simulate whether a major purchase (vehicle, housing) is viable according to their real monthly payment capacity.
5. Track active credits and see AI-assisted insights on their financial decisions.
6. See a chronological history of financial decisions (simulations, credits, payments).

The MVP demonstrates that the visual + simulation experience is superior to Excel for this purpose.

## 6. MVP Scope

### Must Have (Shipped)

- **Budget creation**: Initial flow with predefined templates (50/30/20, 60/20/20, 40/30/30). User picks a template, enters income, reviews 27 predefined categories split by bucket. Stores in Postgres (Neon).
- **Income and expense registration**: Forms to add/edit/delete expenses. Categories, amount, description, type (FIXED/VARIABLE), and recurrence (MONTHLY/BIWEEKLY/ONE_TIME).
- **Visual dashboard**: Main screen showing:
  - Total income, total expenses, available money.
  - Donut chart of expense distribution.
  - 3 health cards (Needs/Wants/Savings) with traffic-light faces and progress bars.
  - Per-category breakdown with bars and percentages.
- **Configurable financial rule**: 50% needs, 30% wants, 20% savings as default. User can edit any rule; system validates sum = 100%. Visual alert when a bucket exceeds its percentage.
- **Multiple simulators**: Vehicle, housing (rent or buy), personal, education, other. Each computes monthly payment, available money after, verdict (APPROVED/WARNING/REJECTED), and total interest.
- **Server-side persistence**: All data stored in Postgres via Prisma. **No localStorage**. Auth required (hardcoded demo user for now).
- **AI advisor per simulation**: On-demand deep analysis from GROQ (`llama-3.3-70b-versatile`). 24h DB cache. Includes disclaimer.
- **AI insights banner**: Cross-simulation strategic findings. 1h in-memory cache.
- **Credit tracking**: Full loan tracker with amortization, fees, payment recording, extra payments, moratory detection. AI advisor + AI insights.
- **Decision timeline**: Chronological view of all financial decisions (simulations created, credits created, payments recorded, extras). Derived on-the-fly. Cursor pagination. Filters.
- **Settings**: Theme (light/dark/system) + account info + sign out.
- **Dark mode complete**: All modules support light/dark with next-themes class-based toggle.
- **Mobile responsive**: Sidebar collapses to bottom nav on mobile.

### Should Have (Shipped)

- Multiple budget templates (3 currently).
- Customizable rules (free percentages that must sum to 100%).
- Housing simulator (arriendo + compra).
- Monthly snapshots (legacy, visible in `/history?tab=snapshots`).
- Color-coded health indicators (semáforo).
- Editable categories (CRUD in `/reglas`).
- AI-assisted advice (4 features: sim advisor, sim insights, loan advisor, loan insights).

### Could Have (Future)

- Savings goals module.
- Investment simulator.
- Brand/model comparison for vehicle simulation.
- Export to PDF or image.
- Interactive onboarding with tooltips.
- i18n (English version of the UI).
- Currency switcher (COP, USD, EUR).
- Real-time collaboration (multi-user).

### Out of Scope (Confirmed)

- Bank integrations or financial APIs.
- Real investment management or portfolios.
- Business/freelance accounting.
- Native mobile app (web responsive only).
- Real-time multi-user collaboration.
- Multi-tenant authentication (the MVP has a hardcoded demo user).
- Email notifications or push notifications.
- Receipt OCR or auto-categorization.

## 7. Main User Flows

### Flow 1: First Budget (Onboarding)

1. The user logs in (demo@example.com / demo123 in the MVP).
2. Lands on `/dashboard`. Detected no budget → redirected to `/onboarding`.
3. Sees welcome screen with value proposition.
4. Picks a budget template (3 options).
5. Enters monthly income.
6. Reviews the 27 seeded categories.
7. Submits. Creates `Budget` + 27 `Category` rows. Redirects to `/dashboard`.

### Flow 2: Add Expense and See Updated Dashboard

1. From `/dashboard`, the user clicks "Agregar gasto".
2. Modal opens: amount (with thousands mask), description, category, type, recurrence, date.
3. Saves.
4. Dashboard re-renders server-side: KPIs update, donut adjusts, health colors shift.
5. `/expenses` list also updates.

### Flow 3: Review Financial Health

1. The user is on `/dashboard`.
2. Sees 3 health cards (Necesidades / Deseos / Ahorro).
3. Each card shows a face (😊/😐/😟), the current %, the budget %, and a progress bar.
4. Example: Necesidades 48% (😊 on target), Deseos 35% (😟 exceeded), Ahorro 12% (😐 below target).
5. Dynamic message under the donut explains the situation in plain language.

### Flow 4: Simulate a Vehicle Purchase

1. The user navigates to `/simulations/new`.
2. Sees "Available money" card (income - current expenses - active loan payments).
3. Fills the form: type (VEHICLE), price, down payment, term, rate, formula.
4. Sees a live preview of monthly payment + verdict.
5. Submits. Saved to DB. Verdict (APPROVED/WARNING/REJECTED) is stored.
6. Lands on `/simulations` with the new card visible + AI Insights banner at the top.
7. Clicks the new sim → detail page with `AI Advisor` card that calls GROQ on mount.

### Flow 5: Track a Credit

1. The user navigates to `/credits/new`.
2. 3-step wizard: Datos (type, principal, term, rate, formula) → Cuotas (fees) → Confirmar.
3. Submits. Credit is created with status `ACTIVE`.
4. Lands on `/credits` list. The new credit appears with an "Available credit" card at the top.
5. Clicks the credit → detail page with: summary, progress bar, payment recording, amortization table, charts, AI Advisor.
6. Records a payment: principal + interest split is computed automatically, stored as `LoanPayment`.
7. Records an extra payment (capital contribution): stored as `LoanExtraPayment`. Amortization updates.

### Flow 6: Review Decision Timeline

1. The user navigates to `/history` (default tab).
2. Sees all events in reverse chronological order, grouped by month.
3. Filters by type: simulations, credits, payments, extras.
4. Scrolls to the bottom. Clicks "Cargar más". Next 30 events load.
5. Clicks an event → goes to the detail page (sim or credit).

### Flow 7: Adjust Rule

1. The user navigates to `/reglas`.
2. Sees 3 tabs: Ingreso, Regla, Categorías.
3. Edits the rule percentages. Sum must = 100% (save disabled otherwise).
4. Submits. Dashboard re-renders with new rule applied to all KPIs.

## 8. Functional Requirements

1. The system must allow creating a budget with at least 3 main category buckets (needs, wants, savings/debt). 27 predefined categories are seeded.
2. The system must allow entering a total monthly income.
3. The system must allow adding, editing, and deleting individual expenses with category, amount, description, type, recurrence, and date.
4. The system must automatically compute the total spent per category and the available money (income - expenses - active loan payments).
5. The system must show a dashboard with a donut chart, KPI cards, and per-category breakdown.
6. The system must apply a percentage rule to income and show compliance visually (color indicators and progress bars).
7. The system must visually alert when a category exceeds its defined percentage.
8. The system must include a vehicle simulator that computes monthly payment from price, down payment, term, and rate.
9. The simulator must compare the monthly payment to the available money in the budget and show a qualitative verdict (APPROVED/WARNING/REJECTED).
10. The system must persist data between sessions (Postgres) and require authentication.
11. The system must allow creating a new budget from scratch (deletion is future).
12. The system must support multiple budget templates (3 currently).
13. The system must allow customizing the financial rule percentages.
14. The system must track active credits with amortization, payment recording, and capital contributions.
15. The system must show a chronological timeline of financial decisions.
16. The system must support light, dark, and system themes.
17. The system must provide AI-assisted analysis on demand for simulations and credits, with a visible disclaimer.
18. The system must be responsive on mobile (sidebar collapses to bottom nav).

## 9. Business Rules

1. **Rule percentages**: The sum of percentages assigned to the categories of a financial rule must be exactly 100%. The system must validate this.
2. **Available money calculation**: Available = Total income - Sum of all expenses - Sum of active loan payments. Can be negative; the system must show a deficit alert in that case.
3. **Simulator verdict** (based on capacity ratio = monthly payment / available money):
   - **APPROVED** (SAFE): ratio ≤ 30% of available.
   - **WARNING** (TIGHT): ratio 31-50%.
   - **REJECTED** (RISKY): ratio > 50% or available is negative.
4. **Payment calculation**: Use French amortization (fixed payment) with capital = price - down payment, monthly rate = annual rate / 12, number of payments = term in months. Effective annual rate via `(1 + monthly)^12 - 1`.
5. **Required categories**: Every budget must have at least one income and one expense category. The system seeds 27 predefined categories; the user can add more.
6. **Customizable templates**: When a user picks a template, the suggested `Budget.rule` percentages are stored, but the user can edit them on the Rule step.
7. **One active rule per budget**: The MVP supports one rule per budget at a time.
8. **Credit status detection**:
   - `ACTIVE` by default.
   - `DEFAULTED` if there is any overdue payment (moratory).
   - `PAID_OFF` when `paidInstallments >= termMonths`.
9. **Loan extra payments reduce principal** and adjust the projected payoff date.
10. **AI cache TTL**:
    - Sim/loan advisor: 24h. DB-backed for sims, in-memory for loans.
    - Sim/loan insights: 1h. In-memory.
    - Cache is invalidated on any mutation to the underlying data.

## 10. Content Requirements

### Fixed Text

- Product name: **Walta** — tagline: "Tu dinero, más claro."
- Welcome screen: 3 value phrases ("Toma el control de tu dinero", "Visualiza tu salud financiera", "Simula decisiones importantes").
- Dashboard labels: "Ingreso total", "Gastos totales", "Dinero disponible", "Ahorro acumulado".
- Default category names (27): Vivienda, Alimentación, Transporte, Salud, Servicios, Educación, Entretenimiento, Ropa, Restaurantes, etc.
- Simulator verdict messages: explanation text per verdict level.
- AI disclaimer: "Análisis generado por IA. No constituye asesoría financiera profesional."

### System-Generated Content

- Numeric values formatted in Colombian peso (COP) with `$ 1.234.567,89` format.
- Rule compliance percentages.
- Expense dates.
- Saved simulation titles and dates.
- Loan amortization tables.
- Timeline event descriptions.

### Simulation Fields

- "Precio del vehículo/vivienda", "Cuota inicial", "Plazo (meses/años)", "Tasa de interés anual (%)", "Cuota mensual estimada", "Tu dinero disponible", "Veredicto".
- Short legend explaining the calculation.

## 11. Success Criteria

1. A new user can create their first budget and see their dashboard in under 5 minutes without an external tutorial.
2. 80% of users who start onboarding complete it (retention metric).
3. Visual health indicators allow identifying at a glance if the budget is balanced (informal usability test).
4. The simulator generates a verdict that is coherent with the user's real budget (logical validation).
5. Data persists across browser sessions (Postgres).
6. The product is perceived as more useful and attractive than an Excel sheet for the same purpose (qualitative feedback from 5-10 test users).
7. The AI advisor produces advice that is consistent with the user's financial context (manual review of GROQ outputs in dev).

## 12. Assumptions

1. The primary user has income and expenses in a single currency (no multi-currency in MVP).
2. The MVP requires a login (hardcoded demo user) to keep the codebase ready for multi-tenant auth. In the future, Google OAuth + email magic link will replace the demo user.
3. French amortization (fixed payment) is adequate for the simulations and credit tracking.
4. Users understand basic concepts of percentages and monthly payments.
5. The product is used primarily on desktop, but must be usable on mobile (responsive).
6. The market values visual clarity and simulation more than detailed accounting.
7. AI-assisted advice is acceptable as a **complement** to the deterministic engine, not a replacement. The engine is always the source of truth for math; AI provides narrative interpretation.

## 13. Risks

1. **Perception risk**: Users may continue to see Excel as "good enough" and not perceive the value of visualization and simulation. *Mitigation*: the onboarding shows the visual verdict and a simulation immediately, not just tables.
2. **Financial accuracy risk**: If the interest rates used in simulations differ from the local market, the verdict may be misleading. *Mitigation*: use clear reference rates, indicate they are estimates, and let the user adjust.
3. **Simulator complexity risk**: Including too many parameters in the simulation can make it as complex as a financial calculator. *Mitigation*: keep the form to 5 fields (type, principal, down payment, term, rate).
4. **Early abandonment risk**: If onboarding is long or confusing, the user may abandon before seeing value. *Mitigation*: keep the wizard to 4 steps, with sensible defaults and one-click templates.
5. **AI hallucination risk**: GROQ may produce advice that is mathematically wrong or inconsistent with the user's real numbers. *Mitigation*: the engine computes the deterministic verdict; AI only adds narrative. The UI always shows both side by side. Zod validation catches malformed outputs.
6. **Data loss risk**: Postgres is the source of truth, but the demo user has no password recovery. *Mitigation*: acceptable for the demo deployment. Real auth (with email verification) is in the backlog.

## 14. Open Questions

1. ~~Which is the main currency?~~ **ANSWERED: COP (Colombian Peso)**. Future: currency switcher.
2. ~~Should the vehicle simulator suggest real brands/models?~~ **ANSWERED: no**, just generic price ranges. Future: optional catalog.
3. ~~Is there interest in sharing the budget with a partner or advisor?~~ **DEFERRED**: not in MVP scope. Future: opt-in sharing.
4. How detailed should expense registration be? Daily, weekly, or just monthly aggregated amounts? *Current MVP*: per-expense with date + recurrence.
5. ~~Should the product offer personalized financial advice or just data and alerts?~~ **ANSWERED**: both. The engine gives the deterministic verdict; the AI gives the narrative.
6. What is the target business model? (Free, freemium, subscription) *Deferred*: not decided. The MVP is single-user demo.

## 15. Handoff Notes for Engineering

### What to preserve

- **Visual-first experience**: The product's value is that a non-expert understands their financial situation without reading tables. The architecture must prioritize fast render of graphs, color indicators, and large numbers.
- **Short onboarding flow**: The first interaction must be as short as possible. 4 steps max.
- **Integrated simulator**: The simulator is not an isolated calculator; it reads the available money from the active budget. This implies that the budget state must be accessible globally (via Prisma query in the page's Server Component).
- **Deterministic engine is the truth**: The engine's verdict is the source of truth. AI is a complement that adds narrative. The UI must always show both.
- **No localStorage**: Persistence is server-side (Postgres). No offline-first behavior. (PWA is disabled because of Next 16 + Turbopack incompat.)

### What to clarify

- **Currency format and localization**: Currently hardcoded to `es-CO` with `Intl.NumberFormat`. `lib/currency.ts` uses Dinero.js for math and `formatCOP` for display.
- **Charts**: Pie/donut and bar are the only types needed. Recharts is the chosen library.
- **Global state**: No global client store. Server Component → Prisma → render. Mutations use Server Actions + `revalidatePath`.
- **Real-time validation**: When editing rule percentages, the form validates sum = 100% live via `useState`. When adding an expense, the dashboard re-renders on action success.

### Technical constraints to respect

- Next.js 16 + Turbopack is the chosen framework. Do not introduce pnpm or yarn; npm is the package manager.
- Do not introduce PWA libraries (next-pwa, serwist) until Next 16 + Turbopack compatibility is verified.
- Do not introduce multi-tenant auth in this phase; the hardcoded demo user is intentional.
- Do not introduce a global client state library (Zustand); use `useState` + `useTransition` + Server Actions.
- Money must never be a raw `number` in business logic. Use `Decimal` in Prisma, `string` in JSON, Dinero.js in `lib/currency.ts`.

### Key differentiator to protect

The combination of **visual budget + simulation verdict + AI-assisted narrative** is the core. The architecture must ensure that the transition between "see my money" and "test a purchase" is fluid, with the budget numbers always visible as context. The history timeline is the layer that connects past decisions to present state.
