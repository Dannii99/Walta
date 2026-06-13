import {
  SIMULATION_INSIGHTS_SYSTEM,
  buildInsightsUserPrompt,
  type InsightsContext,
} from "./prompts";
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

/**
 * Generate a 1-2 sentence insight about the user's simulation portfolio.
 * Uses in-memory cache (1h TTL) keyed by userId.
 */
export async function generateInsights(
  context: InsightsContext,
  userId: string
): Promise<string> {
  const cached = getCached(userId);
  if (cached) return cached;

  if (context.simulations.length === 0) {
    const emptyMessage =
      "Aún no tienes simulaciones. Crea tu primera para ver un análisis de tu portafolio aquí.";
    setCached(userId, emptyMessage);
    return emptyMessage;
  }

  const system = SIMULATION_INSIGHTS_SYSTEM;
  const user = buildInsightsUserPrompt(context);

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
    throw new GroqParseError("Failed to parse GROQ insights response", err);
  }

  const validated: InsightsResponse = InsightsResponseSchema.parse(parsedJson);

  setCached(userId, validated.insight);
  return validated.insight;
}

export function clearInsightsCache(userId: string): void {
  cache.delete(userId);
}

export function clearAllInsightsCache(): void {
  cache.clear();
}

export function _getCacheSizeForTests(): number {
  return cache.size;
}

/**
 * Peek at the cache without calling the API.
 * Returns the cached text if valid, null otherwise.
 * Useful for stale-while-revalidate patterns.
 */
export function peekCache(userId: string): string | null {
  return getCached(userId);
}
