import { z } from "zod";

export const AdvisorImpactSchema = z.enum(["positive", "neutral", "negative"]);

export const AdvisorRecommendationSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(400),
  impact: AdvisorImpactSchema,
});

export const AdvisorAnalysisSchema = z.object({
  verdict_explanation: z.string().min(20).max(600),
  recommendations: z
    .array(AdvisorRecommendationSchema)
    .min(1)
    .max(3),
  risks: z.array(z.string().min(10).max(250)).min(1).max(3),
  alternative_suggestion: z.string().min(20).max(400).optional(),
});

export type AdvisorImpact = z.infer<typeof AdvisorImpactSchema>;
export type AdvisorRecommendation = z.infer<typeof AdvisorRecommendationSchema>;
export type AdvisorAnalysis = z.infer<typeof AdvisorAnalysisSchema>;

export const InsightsResponseSchema = z.object({
  insight: z
    .string()
    .min(30)
    .max(450)
    .describe("1-2 frases en español colombiano, sin preámbulo ni disclaimers"),
});

export type InsightsResponse = z.infer<typeof InsightsResponseSchema>;

/**
 * Loan advisor uses the same shape as simulation advisor but with different prompts.
 * Reusing AdvisorAnalysisSchema keeps the UI components interchangeable.
 */
export const LoanAdvisorSchema = AdvisorAnalysisSchema;
export type LoanAdvisor = z.infer<typeof LoanAdvisorSchema>;

/**
 * Loan insights use the same shape as simulation insights.
 */
export const LoanInsightsSchema = InsightsResponseSchema;
export type LoanInsights = z.infer<typeof LoanInsightsSchema>;
