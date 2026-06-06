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
  rate: number; // EA (efectivo anual) o mensual seg├║n contexto
  formula?: string; // "french_ea" | "nominal_monthly"
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
  fees?: FeeItem[];
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
  payment: number;
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
