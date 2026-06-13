import { z } from "zod";

/**
 * Schema for creating a loan.
 *
 * `paidInstallments` is NOT part of the input — it's computed server-side
 * from `pastPaymentsSync.filter(PAID).length`. This keeps the DB and the UI
 * aligned: the field is always the count of toggled PAID months, never a
 * user-typed number that can be out of range.
 *
 * `startDate` is optional but, when provided, must not be more than 1 day in
 * the future (tolerance for timezone differences).
 */
export const createLoanSchema = z.object({
  userId: z.string().min(1),
  simulationId: z.string().optional(),
  title: z.string().min(1).max(200),
  type: z.enum(["VEHICLE", "PERSONAL", "HOUSING", "OTHER"] as const),
  principal: z.number().positive(),
  downPayment: z.number().nonnegative().default(0),
  annualRate: z.number().min(0).max(2),
  termMonths: z.number().int().min(1).max(120),
  formula: z.enum(["french_ea", "nominal_monthly"] as const),
  monthlyPayment: z.number().positive(),
  startDate: z
    .union([z.date(), z.string().datetime()])
    .optional()
    .refine(
      (d) => {
        if (!d) return true;
        const date = new Date(d);
        const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000;
        return date.getTime() <= oneDayFromNow;
      },
      {
        message:
          "La fecha de inicio no puede estar más de 1 día en el futuro.",
      }
    ),
  totalInterest: z.number().nonnegative(),
  totalCost: z.number().positive(),
  fees: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number().nonnegative(),
        type: z.enum(["monthly", "upfront"]),
      })
    )
    .default([]),
  initialExtraPayment: z
    .object({
      amount: z.number().nonnegative(),
      date: z
        .union([z.date(), z.string()])
        .transform((d) => new Date(d))
        .refine(
          (d) => !isNaN(d.getTime()) && d.getTime() <= Date.now() + 24 * 60 * 60 * 1000,
          { message: "La fecha del abono no puede ser futura." }
        ),
    })
    .optional(),
  pastPaymentsSync: z
    .array(
      z.object({
        month: z.number().int().min(0).max(11),
        year: z.number().int(),
        status: z.enum(["PAID", "PENDING", "DEFAULTED"] as const),
      })
    )
    .default([]),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;

/**
 * Computes `paidInstallments` from the pastPaymentsSync array.
 * Returns the count of entries with status === "PAID".
 *
 * This is the single source of truth for the `Loan.paidInstallments` DB column
 * when a loan is created or updated via the form. The value is never typed by
 * the user; it's always derived from the toggles in the Sincronizar cuotas
 * pasadas section.
 */
export function computePaidInstallments(
  pastPaymentsSync: ReadonlyArray<{ status: "PAID" | "PENDING" | "DEFAULTED" }>
): number {
  return pastPaymentsSync.filter((p) => p.status === "PAID").length;
}

/**
 * Zod schema for the recalculation mode of a LoanExtraPayment.
 *
 * - `REDUCE_TERM` (default histórico): same cuota, lower plazo.
 * - `REDUCE_PAYMENT`: recalcula la cuota con la fórmula francesa sobre
 *   `newTermMonths` usando el saldo pendiente post-abono.
 */
export const recalculationModeSchema = z.enum([
  "REDUCE_TERM",
  "REDUCE_PAYMENT",
] as const);

/**
 * Validates the `(recalculationMode, newTermMonths)` pair.
 *
 * Rules:
 * - `REDUCE_TERM` does NOT require `newTermMonths`.
 * - `REDUCE_PAYMENT` REQUIRES `newTermMonths >= 1`.
 */
export const extraRecalcFieldsSchema = z
  .object({
    recalculationMode: recalculationModeSchema.optional(),
    newTermMonths: z.number().int().min(1).max(360).nullable().optional(),
  })
  .refine(
    (d) =>
      d.recalculationMode !== "REDUCE_PAYMENT" ||
      (d.newTermMonths != null && d.newTermMonths >= 1),
    {
      message: "newTermMonths es requerido cuando el modo es REDUCE_PAYMENT",
      path: ["newTermMonths"],
    }
  );
