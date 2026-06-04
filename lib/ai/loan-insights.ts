import {
  LOAN_INSIGHTS_SYSTEM,
  buildLoanInsightsUserPrompt,
  type LoanInsightsContext,
} from "./loan-prompts";
import { callGroqChat, extractJsonContent, GroqParseError } from "./groq-client";
import { InsightsResponseSchema, type InsightsResponse } from "./schemas";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  text: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(userId: string): string | null {
  const entry = cache.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(userId);
    return null;
  }
  return entry.text;
}

function setCached(userId: string, text: string): void {
  cache.set(userId, {
    text,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function clearLoanInsightsCache(userId: string): void {
  cache.delete(userId);
}

export function clearAllLoanInsightsCache(): void {
  cache.clear();
}

export function _getLoanInsightsCacheSizeForTests(): number {
  return cache.size;
}

/**
 * Generate a 1-2 sentence insight about the user's credit portfolio.
 * Uses in-memory cache (1h TTL) keyed by userId.
 */
export async function generateLoanInsights(
  context: LoanInsightsContext,
  userId: string
): Promise<string> {
  const cached = getCached(userId);
  if (cached) return cached;

  if (context.loans.length === 0) {
    const emptyMessage =
      "Aún no tienes créditos registrados. Cuando agregues uno, verás aquí un análisis de tu portafolio.";
    setCached(userId, emptyMessage);
    return emptyMessage;
  }

  const system = LOAN_INSIGHTS_SYSTEM;
  const user = buildLoanInsightsUserPrompt(context);

  const response = await callGroqChat({
    system,
    user,
    jsonMode: true,
    temperature: 0.5,
    maxTokens: 400,
  });

  let parsedJson: unknown;
  try {
    parsedJson = extractJsonContent(response.content);
  } catch (err) {
    if (err instanceof GroqParseError) throw err;
    throw new GroqParseError("Failed to parse GROQ loan insights response", err);
  }

  const validated: InsightsResponse = InsightsResponseSchema.parse(parsedJson);

  setCached(userId, validated.insight);
  return validated.insight;
}
