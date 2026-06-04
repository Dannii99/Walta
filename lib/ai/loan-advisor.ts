import {
  LOAN_ADVISOR_SYSTEM,
  buildLoanAdvisorUserPrompt,
  type LoanAdvisorContext,
} from "./loan-prompts";
import { callGroqChat, extractJsonContent, GroqParseError } from "./groq-client";
import { AdvisorAnalysisSchema, type AdvisorAnalysis } from "./schemas";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  analysis: AdvisorAnalysis;
  expiresAt: number;
  generatedAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): CacheEntry | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry;
}

function setCached(key: string, analysis: AdvisorAnalysis): CacheEntry {
  const entry: CacheEntry = {
    analysis,
    expiresAt: Date.now() + CACHE_TTL_MS,
    generatedAt: Date.now(),
  };
  cache.set(key, entry);
  return entry;
}

export function invalidateLoanAdvisorCache(userId: string, loanId: string): void {
  cache.delete(`${userId}:${loanId}`);
}

export function clearAllLoanAdvisorCache(): void {
  cache.clear();
}

export function _getLoanAdvisorCacheSizeForTests(): number {
  return cache.size;
}

/**
 * Generate a structured advisor analysis for a single credit.
 * Uses in-memory cache (24h TTL) keyed by `userId:loanId`.
 */
export async function generateLoanAdvisorAnalysis(
  context: LoanAdvisorContext,
  userId: string,
  loanId: string
): Promise<{ analysis: AdvisorAnalysis; cached: boolean; generatedAt: Date }> {
  const key = `${userId}:${loanId}`;
  const cached = getCached(key);
  if (cached) {
    return {
      analysis: cached.analysis,
      cached: true,
      generatedAt: new Date(cached.generatedAt),
    };
  }

  const system = LOAN_ADVISOR_SYSTEM;
  const user = buildLoanAdvisorUserPrompt(context);

  const response = await callGroqChat({
    system,
    user,
    jsonMode: true,
    temperature: 0.4,
    maxTokens: 1500,
  });

  let parsedJson: unknown;
  try {
    parsedJson = extractJsonContent(response.content);
  } catch (err) {
    if (err instanceof GroqParseError) throw err;
    throw new GroqParseError("Failed to parse GROQ loan advisor response", err);
  }

  const validated = AdvisorAnalysisSchema.safeParse(parsedJson);
  if (!validated.success) {
    throw new GroqParseError(
      `Loan advisor response failed schema validation: ${validated.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }

  const entry = setCached(key, validated.data);
  return {
    analysis: validated.data,
    cached: false,
    generatedAt: new Date(entry.generatedAt),
  };
}
