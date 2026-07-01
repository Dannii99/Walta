# Project Context

The "what" and "why" of **Walta — Tu dinero, más claro**. This document describes the product vision, target users, MVP scope, and success criteria. It is intentionally **product-focused**, not implementation-focused.

For how the product is *built* today, see [`architecture.md`](./architecture.md). For module-by-module implementation details, see [`module-reference.md`](./module-reference.md). For developer setup, see [`setup-plan.md`](./setup-plan.md). For the agent quickstart, see [`../AGENTS.md`](../AGENTS.md).

## 1. Project Summary

A web app for personal budget control that **replaces spreadsheets with a visual, interactive, decision-and-tracking-oriented experience**. Users create budgets, register income and categorized expenses, see their financial health via graphs and color indicators, evaluate if they follow healthy financial rules (e.g. 50/30/20 distribution), simulate major decisions (vehicle, housing, personal loans, etc.) to understand if they are viable against their real budget capacity, and — once a decision is made — track active credits with amortization, payment recording, extra payments, and bank-statement reconciliation.

The product is **web-only**, single-currency (COP), with a hardcoded demo user in the MVP. The product speaks Spanish. All currency amounts are formatted as `$ 1.234.567` (no decimals, since Colombia does not use centavos).

## 2. Problem Statement

Most people control their personal finances in Excel or do not control them in a structured way. This generates four main problems:

- **Lack of visual clarity**: Numbers in a table do not let you see immediately if the financial situation is healthy, if you are overspending, or how much money is actually available.
- **Difficulty applying financial rules**: Concepts like "spend at most 50% on needs" or "save 20%" are hard to monitor manually without errors.
- **Uncertainty in big decisions**: When a person wants to know if they can buy a car, a house, or invest, they turn to isolated calculators or assumptions without integrating their real budget. There is no tool that connects daily financial situation with the viability of important decisions.
- **No follow-through after the decision**: Once a person takes a loan, they are left alone. They have no easy way to track how much they've paid, how much is left, how much interest they're paying, what would happen if they made an extra payment, or whether the bank is charging what it should. The bank statement becomes the only source of truth, but it does not help you plan or optimize.

## 3. Target Users

### Primary User

- **Adults aged 25 to 45** with fixed or variable income who want to organize their personal finances without complexity.
- Users who have tried using Excel but abandoned it for lack of time or because it did not give them insights.
- People who are considering important purchases (vehicle, housing, personal loan) and need to validate if they can take them on.
- People who already have an active loan and want to track it, simulate extra payments, and reconcile with their bank statement.

### Secondary User

- **Couples or families** who want to visualize a joint budget (in future iterations).
- **Young professionals** who are starting to live independently and want to create their first budget with guidance.

## 4. Value Proposition

"Understand your money at a glance, make big decisions with confidence, and follow through after you decide."

Instead of being a passive table, the product is a **visual financial assistant** that:

- Shows if your budget is healthy with colors and clear signals (traffic-light style).
- Tells you exactly how much you can allocate to each category according to proven financial rules.
- Simulates important decisions using your real budget, not loose estimates.
- Tracks your active loans with amortization, payment history, extra payments, and bank-statement reconciliation.
- Feels modern, fast and motivating, not like a bookkeeping chore.

## 5. MVP Objective

Ship a working web app that lets a user:

1. Create a personal budget in under 5 minutes.
2. Visualize their current financial state immediately and attractively.
3. Know if they are complying with an income distribution rule.
4. Simulate whether a major purchase (vehicle, housing, personal loan) is viable according to their real monthly payment capacity.
5. Track active credits with amortization, payment recording, extra payments, and bank-statement reconciliation.
6. See AI-assisted insights on their financial decisions (simulations and credits).
7. See a chronological history of financial decisions (simulations, credits, payments, extras).
8. Simulate the impact of an extra capital payment on a loan (months saved, interest saved, new installment).

The MVP demonstrates that the visual + simulation experience is superior to Excel for this purpose.

## 6. MVP Scope

### Must Have (Shipped)

- **Budget creation**: Initial flow with 3 predefined templates (Equilibrada 50/30/20, Detallada 26 categories, En blanco). User picks a template, enters income, reviews categories split by bucket (Needs/Wants/Savings). Stores in Postgres.
- **Income and expense registration**: Forms to add/edit/delete expenses. Categories, amount, description, type (FIXED/VARIABLE), and recurrence (MONTHLY/BIWEEKLY/ONE_TIME). BIWEEKLY amounts are stored as monthly equivalent (×2) for budget consistency.
- **Visual dashboard**: Main screen showing:
  - Personalized greeting with time-of-day.
  - Hero bank-card with available money and status badge (Saludable/Ajustado/Riesgoso/Déficit).
  - Mini stats row (income, expenses %, savings capacity).
  - Donut chart of expense distribution + bar chart (spent vs limit per category) via tabs.
  - 3 health cards (Needs/Wants/Savings) with emoji traffic-light faces (😊/😐/😟), progress bars, and dynamic contextual message.
  - Simulator quick-access banner.
- **Configurable financial rule**: 50% needs, 30% wants, 20% savings as default. User can edit any rule; system validates sum = 100%. Visual alert when a bucket exceeds its percentage.
- **Multiple simulators**: Vehicle, housing (rent or buy), personal, education, other. Each computes monthly payment, available money after, verdict (APPROVED/WARNING/REJECTED), and total interest. Supports down payment, previous extra payment, and fees.
- **Credit tracking**: Full loan tracker with:
  - 3-step creation wizard (Datos → Condiciones → En curso).
  - Amortization table with interest/principal split per month.
  - Payment recording (interest+principal auto-computed).
  - Extra payments (capital contributions) with two modes: REDUCE_TERM (default, shortens duration) or REDUCE_PAYMENT (recalculates monthly installment).
  - Annual fee model: fees stored as annual amount, engine divides by 12 for monthly display.
  - Capital impact simulator: user enters amount, chooses mode, sees months saved, interest saved, and new installment before committing.
  - Bank statement reconciliation (Extract tab): user enters paid installments and actual monthly payment from bank statement; system compares vs calculated and shows MATCH/MINOR/MAJOR/UNKNOWN status.
  - AI advisor (per-loan, 24h memory cache) + AI insights (cross-loan, 1h memory cache).
- **AI advisor per simulation**: On-demand deep analysis from GROQ. 24h DB cache. Includes disclaimer.
- **AI insights banner**: Cross-simulation strategic findings. 1h in-memory cache.
- **Decision timeline**: Chronological view of 5 event types (simulation created, loan created, loan payment, extra payment, loan paid off). Derived on-the-fly from DB. Cursor pagination. Filters by type.
- **Settings**: Theme (light/dark/system) + account info + sign out.
- **Dark mode complete**: All modules, charts, tables, and AI cards support light/dark.
- **Mobile responsive**: Sidebar collapses to bottom nav on mobile; modals adapt; filter sheets for mobile.

### Should Have (Shipped)

- Customizable rules (free percentages that must sum to 100%).
- Housing simulator (arriendo + compra).
- Monthly snapshots (legacy, visible in `/history?tab=snapshots`).
- Color-coded health indicators (semáforo).
- Editable categories (CRUD in `/reglas`) with transaction reassignment on type change.
- AI-assisted advice (4 features: sim advisor, sim insights, loan advisor, loan insights).
- Extract/bank-statement reconciliation tab per credit.
- Capital impact simulator with REDUCE_TERM vs REDUCE_PAYMENT modes.
- Available credit capacity card (ratio of income committed to active loans).
- SimulatorQuickAccess banner on dashboard.

### Could Have (Future)

- Savings goals module.
- Investment simulator.
- Brand/model comparison for vehicle simulation.
- Export to PDF or image.
- Interactive onboarding with tooltips.
- i18n (English version of the UI).
- Currency switcher (COP, USD, EUR).
- Real-time collaboration (multi-user).
- Auto-import bank statements (CSV/Excel).
- Multiple budget management (switch between budgets).
- Danger zone (account deletion with cascade).

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
2. 3-step wizard: Datos (name, type, price, down payment, previous extra payment) → Condiciones (term, rate, formula, start date, fees) → En curso (past payments sync, advanced options, for ongoing loans).
3. Submits. Credit is created with status `ACTIVE`.
4. Lands on `/credits` list. The new credit appears with global KPIs (total, active, paid off, defaulted) and an "Available credit" card showing debt capacity ratio.
5. Clicks the credit → detail page with: header (title, status badge, actions button, edit), summary KPIs (balance, total paid, monthly payment, next payment), capital impact simulator (always visible), 4 tabs (Amortización, Pagos, Abonos, Extracto), charts, AI Advisor.
6. Records a payment: principal + interest split is computed automatically from the amortization schedule.
7. Records an extra payment (capital contribution): choose REDUCE_TERM (default, shortens duration) or REDUCE_PAYMENT (recalculates monthly installment with new term). Amortization updates.
8. Uses Extract tab to reconcile with bank statement: enters paid installments count and actual monthly payment; system shows MATCH/MINOR/MAJOR/UNKNOWN with diff breakdown.

### Flow 6: Review Decision Timeline

1. The user navigates to `/history` (default tab: timeline).
2. Sees all events in reverse chronological order, grouped by month.
3. Filters by type: simulations, credits, payments, extras, paid-off loans.
4. Scrolls to the bottom. Clicks "Cargar más". Next 30 events load via cursor pagination.
5. Clicks an event → goes to the detail page (sim or credit).
6. Can switch to "Snapshots" tab (legacy manual monthly snapshots) for backwards compatibility.

### Flow 7: Adjust Rule

1. The user navigates to `/reglas`.
2. Sees 3 summary cards (income, active rule, category count) and 3 tabs: Ingreso, Regla, Categorías.
3. Edits the rule percentages. Sum must = 100% (save disabled otherwise).
4. Submits. Dashboard re-renders with new rule applied to all KPIs.

### Flow 8: Simulate Capital Impact on a Loan

1. The user is on a credit detail page (`/credits/[id]`).
2. The Capital Impact Simulator is always visible between the summary and the tab content.
3. Enters an amount to pay extra.
4. Chooses mode: "Reducir plazo" (same installment, fewer months) or "Reducir cuota" (recalculate installment with new term).
5. If "Reducir cuota", enters new remaining term in months.
6. Sees animated results: months saved, interest saved, new monthly installment (if applicable).
7. Clicks "Aplicar abono" → opens the Capital Contribution form pre-filled with the simulated values.

### Flow 9: Reconcile with Bank Statement

1. The user is on a credit detail page, Extract tab.
2. Enters the number of paid installments according to their bank statement.
3. Clicks "Aplicar" → system marks those months as PAID in the amortization table.
4. Enters the actual monthly payment from the bank statement.
5. System compares calculated vs actual and shows status: MATCH (green, within tolerance), MINOR (yellow, small diff), MAJOR (red, significant diff), UNKNOWN (grey, no input yet).
6. If MINOR/MAJOR, system explains possible reasons (fees not contemplated, rate difference, etc.).

### Flow 10: Convert Simulation to Credit

1. The user is on a simulation detail page (`/simulations/[id]`).
2. Clicks "Convertir a crédito" button.
3. Redirected to `/credits/new?fromSimulation=id` with all simulation data pre-filled (title, type, price, down payment, rate, term, formula, fees).
4. Reviews and submits. The credit is created with a reference to the original simulation.

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
19. The system must allow creating a loan with a 3-step wizard including data, conditions, and past-payments sync for ongoing loans.
20. The system must compute a full amortization schedule using French amortization (fixed payment) with capital = price - down payment.
21. The system must allow recording loan payments with automatic interest/principal split computation.
22. The system must allow recording extra capital payments with two modes: REDUCE_TERM (shortens duration) or REDUCE_PAYMENT (recalculates monthly payment with new term).
23. The system must show a capital impact simulator that computes months saved, interest saved, and new installment before the user commits to an extra payment.
24. The system must allow reconciling the calculated amortization with the user's actual bank statement (paid installments count + actual monthly payment).
25. The system must show an available credit capacity card that computes the ratio of income committed to active loans.

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
9. **Loan extra payments reduce principal** and adjust either the projected payoff date (REDUCE_TERM) or the monthly installment (REDUCE_PAYMENT).
10. **Annual fee model**: Fees of type "monthly" are stored as annual amounts in the database. The engine divides by 12 to obtain the monthly fee. This matches how banks typically quote insurance and administration fees.
11. **Biweekly expense model**: `Transaction.amount` stores the monthly equivalent (BIWEEKLY × 2, MONTHLY × 1, ONE_TIME ÷ 12). For BIWEEKLY, the "per payment" display amount = stored ÷ 2.
12. **AI cache TTL**:
    - Sim/loan advisor: 24h. DB-backed for sims, in-memory for loans.
    - Sim/loan insights: 1h. In-memory.
    - Cache is invalidated on any mutation to the underlying data.
13. **Bank statement reconciliation calibration**:
    - `MATCH`: difference ≤ 1% (calculated vs actual monthly payment).
    - `MINOR`: difference 1–10% (likely fees not fully captured).
    - `MAJOR`: difference > 10% (review rate, term, or formula).
    - `UNKNOWN`: no actual payment entered yet.
14. **Available credit capacity ratio**:
    - < 30% of income committed to loans = good (emerald).
    - 30–50% = moderate (amber).
    - > 50% = over-committed (rose).

## 10. Content Requirements

### Fixed Text

- Product name: **Walta** — tagline: "Tu dinero, más claro."
- Welcome screen: 3 value phrases ("Toma el control de tu dinero", "Visualiza tu salud financiera", "Simula decisiones importantes").
- Dashboard labels: "Ingreso total", "Gastos totales", "Dinero disponible", "Ahorro acumulado".
- Default category names (27): Vivienda, Alimentación, Transporte, Salud, Servicios, Educación, Entretenimiento, Ropa, Restaurantes, etc.
- Simulator verdict messages: explanation text per verdict level.
- AI disclaimer: "Análisis generado por IA. No constituye asesoría financiera profesional."

### System-Generated Content

- Numeric values formatted in Colombian peso (COP) with `$ 1.234.567` format (no decimals, since Colombia does not use centavos).
- Rule compliance percentages.
- Expense dates.
- Saved simulation titles and dates.
- Loan amortization tables with interest/principal split.
- Capital impact simulator results (months saved, interest saved, new installment).
- Extract reconciliation status (MATCH/MINOR/MAJOR/UNKNOWN) with explanations.
- Available credit capacity ratio and recommendation.
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
8. A user can track a loan, record payments, simulate an extra payment, and reconcile with their bank statement without external help (informal usability test).
9. The capital impact simulator produces coherent savings estimates that match manual verification (logical validation).

## 12. Assumptions

1. The primary user has income and expenses in a single currency (no multi-currency in MVP).
2. The MVP requires a login (hardcoded demo user) to keep the codebase ready for multi-tenant auth. In the future, Google OAuth + email magic link will replace the demo user.
3. French amortization (fixed payment) is adequate for the simulations and credit tracking.
4. Users understand basic concepts of percentages and monthly payments.
5. The product is used primarily on desktop, but must be usable on mobile (responsive).
6. The market values visual clarity, simulation, and follow-through more than detailed accounting.
7. AI-assisted advice is acceptable as a **complement** to the deterministic engine, not a replacement. The engine is always the source of truth for math; AI provides narrative interpretation.
8. Users understand that the bank statement is the source of truth for actual payments; Walta's calculations are estimates for planning and reconciliation.
9. French amortization (fixed payment) is adequate for the simulations and credit tracking; users who have German amortization loans may see differences.

## 13. Risks

1. **Perception risk**: Users may continue to see Excel as "good enough" and not perceive the value of visualization and simulation. *Mitigation*: the onboarding shows the visual verdict and a simulation immediately, not just tables.
2. **Financial accuracy risk**: If the interest rates used in simulations differ from the local market, the verdict may be misleading. *Mitigation*: use clear reference rates, indicate they are estimates, and let the user adjust.
3. **Simulator complexity risk**: Including too many parameters in the simulation can make it as complex as a financial calculator. *Mitigation*: keep the form to essential fields; advanced options (fees, past payments sync) are in secondary tabs.
4. **Early abandonment risk**: If onboarding is long or confusing, the user may abandon before seeing value. *Mitigation*: keep the wizard to 4 steps, with sensible defaults and one-click templates.
5. **AI hallucination risk**: GROQ may produce advice that is mathematically wrong or inconsistent with the user's real numbers. *Mitigation*: the engine computes the deterministic verdict; AI only adds narrative. The UI always shows both side by side. Zod validation catches malformed outputs.
6. **Data loss risk**: Postgres is the source of truth, but the demo user has no password recovery. *Mitigation*: acceptable for the demo deployment. Real auth (with email verification) is in the backlog.
7. **Reconciliation mismatch risk**: The user may enter incorrect data from their bank statement, leading to a false MAJOR status. *Mitigation*: clear instructions, visual diff breakdown, and calibration tolerance thresholds.
8. **Recalculation confusion risk**: Users may not understand the difference between REDUCE_TERM and REDUCE_PAYMENT. *Mitigation*: plain-language labels, visual comparison in the simulator, and tooltip explanations.

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
