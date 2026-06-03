/**
 * GROQ API client wrapper.
 *
 * Uses llama-3.3-70b-versatile for high-quality Spanish responses
 * appropriate for financial decision support.
 *
 * IMPORTANT: This module is server-only (uses GROQ_API_KEY from env).
 * Never import from client components.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;

export class GroqError extends Error {
  readonly status?: number;
  readonly retryable: boolean;

  constructor(message: string, options?: { status?: number; retryable?: boolean; cause?: unknown }) {
    super(message);
    this.name = "GroqError";
    this.status = options?.status;
    this.retryable = options?.retryable ?? false;
    if (options?.cause) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export class GroqRateLimitError extends GroqError {
  constructor(message = "GROQ rate limit exceeded") {
    super(message, { status: 429, retryable: true });
    this.name = "GroqRateLimitError";
  }
}

export class GroqServiceError extends GroqError {
  constructor(message = "GROQ service error", status?: number) {
    super(message, { status, retryable: true });
    this.name = "GroqServiceError";
  }
}

export class GroqTimeoutError extends GroqError {
  constructor(message = "GROQ request timed out") {
    super(message, { retryable: true });
    this.name = "GroqTimeoutError";
  }
}

export class GroqAuthError extends GroqError {
  constructor(message = "GROQ API key missing or invalid") {
    super(message, { status: 401, retryable: false });
    this.name = "GroqAuthError";
  }
}

export class GroqParseError extends GroqError {
  constructor(message = "Failed to parse GROQ response", cause?: unknown) {
    super(message, { retryable: false, cause });
    this.name = "GroqParseError";
  }
}

export interface CallGroqOptions {
  system: string;
  user: string;
  jsonMode?: boolean;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  timeoutMs?: number;
}

export interface CallGroqResult {
  content: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.length < 10) {
    throw new GroqAuthError();
  }
  return key;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function classifyHttpError(status: number, body: string): GroqError {
  if (status === 401 || status === 403) {
    return new GroqAuthError(`GROQ auth failed: ${body.slice(0, 200)}`);
  }
  if (status === 429) {
    return new GroqRateLimitError(`GROQ 429: ${body.slice(0, 200)}`);
  }
  if (isRetryableStatus(status)) {
    return new GroqServiceError(`GROQ ${status}: ${body.slice(0, 200)}`, status);
  }
  return new GroqError(`GROQ ${status}: ${body.slice(0, 200)}`, { status, retryable: false });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callGroqChat(options: CallGroqOptions): Promise<CallGroqResult> {
  const {
    system,
    user,
    jsonMode = false,
    temperature = 0.4,
    maxTokens = 1500,
    model = DEFAULT_MODEL,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const apiKey = getApiKey();

  const body = {
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature,
    max_tokens: maxTokens,
    ...(jsonMode && { response_format: { type: "json_object" } }),
  };

  let lastError: GroqError | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        const err = classifyHttpError(response.status, errorText);

        if (err.retryable && attempt < MAX_RETRIES) {
          lastError = err;
          const backoffMs = 500 * Math.pow(2, attempt);
          await sleep(backoffMs);
          continue;
        }

        throw err;
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        model?: string;
        usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
      };

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new GroqParseError("GROQ response missing content");
      }

      return {
        content,
        model: data.model ?? model,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (err) {
      clearTimeout(timer);

      if (err instanceof GroqError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        const timeoutErr = new GroqTimeoutError();
        if (attempt < MAX_RETRIES) {
          lastError = timeoutErr;
          await sleep(500 * Math.pow(2, attempt));
          continue;
        }
        throw timeoutErr;
      }

      throw new GroqError(
        `Unexpected GROQ call error: ${err instanceof Error ? err.message : String(err)}`,
        { retryable: false, cause: err }
      );
    }
  }

  throw lastError ?? new GroqError("GROQ call exhausted retries");
}

export function extractJsonContent(content: string): unknown {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // try to find the first { and last }
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const slice = trimmed.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(slice);
      } catch {
        throw new GroqParseError("Response is not valid JSON");
      }
    }
    throw new GroqParseError("Response is not valid JSON");
  }
}
