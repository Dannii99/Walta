export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  income: string; // Decimal como string para precisi├│n
  currency: string;
  rule: BudgetRule;
  categories: Category[];
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetRule {
  needs: number;
  wants: number;
  savings: number;
}

export type CategoryType = "NEEDS" | "WANTS" | "SAVINGS" | "DEBT";

export interface Category {
  id: string;
  budgetId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon?: string | null;
  description?: string | null;
  plannedAmount?: string | null;
  transactions: Transaction[];
}

export type Recurrence = "MONTHLY" | "BIWEEKLY" | "ONE_TIME";

export interface Transaction {
  id: string;
  categoryId: string;
  category?: Category;
  amount: string; // Decimal como string
  description?: string | null;
  date: Date;
  recurrence: Recurrence;
  createdAt: Date;
}

export type SimulationType = "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER";

export interface Simulation {
  id: string;
  userId: string;
  type: SimulationType;
  title: string;
  inputs: SimulationInputs;
  result: SimulationResult;
  createdAt: Date;
}

export interface SimulationInputs {
  price: number;
  downPayment: number;
  term: number; // meses
  rate: number; // EA (efectivo anual) o mensual según contexto
  formula?: string; // "french_ea" | "nominal_monthly"
  fees?: FeeItem[];
}

export interface SimulationResult {
  monthlyPayment: number;
  verdict: "APPROVED" | "WARNING" | "REJECTED";
  availableAfter: number;
  totalInterest: number;
  totalCost: number;
}

export interface MonthlySnapshot {
  id: string;
  budgetId: string;
  month: number;
  year: number;
  income: string;
  totalExpenses: string;
  totalSavings: string;
  categoryBreakdown: Record<string, string>;
  createdAt: Date;
}

export interface HealthStatus {
  category: CategoryType;
  limit: number;
  spent: number;
  percentage: number;
  status: "green" | "yellow" | "red";
}

export type LoanType = "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER";
export type LoanFormula = "french_ea" | "nominal_monthly";
export type LoanStatus = "ACTIVE" | "PAID_OFF" | "DEFAULTED";

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  type: "monthly" | "upfront";
}

export interface Loan {
  id: string;
  userId: string;
  simulationId?: string | null;
  title: string;
  type: LoanType;
  principal: string;
  downPayment: string;
  annualRate: string;
  termMonths: number;
  formula: LoanFormula;
  monthlyPayment: string;
  startDate: Date;
  status: LoanStatus;
  paidInstallments?: number;
  totalInterest: string;
  totalCost: string;
  currency: string;
  /**
   * Loan fees (insurance, administration, etc). The source of truth is the
   * `LoanFee` relational table. The type here is a permissive union to
   * match both the Prisma model (decimal-string amounts) and the old
   * `FeeItem` shape (number amounts) used in some tests/queries.
   *
   * Each entry must have:
   *   - `name: string`
   *   - `amount: number | string | { toString(): string }` (Decimal)
   *   - `type: "monthly" | "upfront"`
   *
   * Use `getEffectiveMonthlyPayment(loan)` to get the cuota real (bank +
   * deferred monthly fees). Do NOT sum fees manually in the UI/queries.
   */
  fees?: Array<{
    id?: string;
    name: string;
    amount: number | string | { toString(): string };
    type: "monthly" | "upfront";
  }>;
  createdAt: Date;
  updatedAt: Date;
  payments?: LoanPayment[];
  extraPayments?: LoanExtraPayment[];
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: string;
  principalPaid: string;
  interestPaid: string;
  paidDate: Date;
  createdAt: Date;
}

export interface LoanExtraPayment {
  id: string;
  loanId: string;
  amount: string;
  date: Date;
  note?: string | null;
  /**
   * Cómo afecta el abono a la amortización:
   * - `null` o `"REDUCE_TERM"` (default histórico): misma cuota, menor plazo.
   * - `"REDUCE_PAYMENT"`: recalcula la cuota con la fórmula francesa sobre
   *   `newTermMonths` usando el saldo pendiente post-abono.
   */
  recalculationMode?: "REDUCE_TERM" | "REDUCE_PAYMENT" | null;
  /**
   * Plazo TOTAL en meses del crédito después del recálculo. Solo aplica
   * cuando `recalculationMode === "REDUCE_PAYMENT"`.
   */
  newTermMonths?: number | null;
  createdAt: Date;
}

export interface PastPaymentSync {
  month: number;
  year: number;
  status: "PAID" | "PENDING" | "DEFAULTED";
}

export interface AmortizationRow {
  month: number;
  date: Date;
  /**
   * Bank cuota = capital + interest (the cuota the bank actually charges for
   * the loan itself, not including deferred monthly fees).
   */
  payment: number;
  /**
   * Deferred monthly fee contribution for this row. Same value across all
   * rows of a loan (constant for the lifetime of the loan). Sum of
   * `fees[i].amount / 12` for all fees with `type === "monthly"`.
   */
  monthlyFee: number;
  /**
   * The real cuota the user pays each month = `payment + monthlyFee`.
   * This is what gets debited from the account. It is the value shown in
   * the "Cuota" column of the amortization table (with `payment` and
   * `monthlyFee` broken out as a sub-line).
   */
  totalPayment: number;
  interest: number;
  principal: number;
  extraPayment: number;
  balance: number;
  status: "PAID" | "PAID_OFF" | "PENDING" | "DEFAULTED" | "UPCOMING";
  actualPayment?: LoanPayment | null;
  /**
   * True if this row is marked as paid because of `paidInstallments` set from
   * the bank statement (synthetic, not backed by a real LoanPayment record).
   * Used to distinguish "paid by extract" from "paid by manual record".
   */
  paidFromExtract?: boolean;
  /**
   * 1-based index of the "payment phase" this row belongs to. A new phase
   * starts whenever an extra with `recalculationMode === "REDUCE_PAYMENT"`
   * triggers a recalc; subsequent rows get a higher phase number. Useful
   * for the UI to show a tooltip indicating "this row uses the new cuota
   * after the recalc at month N".
   */
  paymentPhase?: number;
}

export type {
  TimelineEvent,
  TimelineEventType,
  TimelinePage,
  TimelineCursor,
  SimulationCreatedEvent,
  LoanCreatedEvent,
  LoanPaymentEvent,
  LoanExtraPaymentEvent,
  LoanPaidOffEvent,
} from "@/lib/timeline-types";
