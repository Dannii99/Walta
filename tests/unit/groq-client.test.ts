import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  callGroqChat,
  extractJsonContent,
  GroqAuthError,
  GroqParseError,
  GroqRateLimitError,
  GroqServiceError,
  GroqTimeoutError,
} from "@/lib/ai/groq-client";

const ORIGINAL_API_KEY = process.env.GROQ_API_KEY;
const VALID_KEY = "gsk_test_dummy_key_for_unit_tests_1234567890";

interface MockResponseInit {
  status: number;
  jsonBody?: unknown;
  textBody?: string;
}

function makeMockResponse(init: MockResponseInit) {
  const body = init.textBody ?? JSON.stringify(init.jsonBody ?? {});
  return {
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    text: async () => body,
    json: async () => JSON.parse(body),
  };
}

beforeEach(() => {
  process.env.GROQ_API_KEY = VALID_KEY;
  vi.restoreAllMocks();
});

afterEach(() => {
  if (ORIGINAL_API_KEY === undefined) {
    delete process.env.GROQ_API_KEY;
  } else {
    process.env.GROQ_API_KEY = ORIGINAL_API_KEY;
  }
});

describe("callGroqChat - auth", () => {
  it("throws GroqAuthError when GROQ_API_KEY is missing", async () => {
    delete process.env.GROQ_API_KEY;
    await expect(
      callGroqChat({ system: "s", user: "u" })
    ).rejects.toBeInstanceOf(GroqAuthError);
  });

  it("throws GroqAuthError when GROQ_API_KEY is too short", async () => {
    process.env.GROQ_API_KEY = "short";
    await expect(
      callGroqChat({ system: "s", user: "u" })
    ).rejects.toBeInstanceOf(GroqAuthError);
  });

  it("throws GroqAuthError on 401 response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({ status: 401, jsonBody: { error: "unauthorized" } }) as never
    );

    await expect(
      callGroqChat({ system: "s", user: "u" })
    ).rejects.toBeInstanceOf(GroqAuthError);
  });
});

describe("callGroqChat - success", () => {
  it("sends correct request body and returns content", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({
        status: 200,
        jsonBody: {
          choices: [{ message: { content: "Hello" } }],
          model: "llama-3.3-70b-versatile",
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        },
      }) as never
    );

    const result = await callGroqChat({
      system: "you are helpful",
      user: "hi",
    });

    expect(result.content).toBe("Hello");
    expect(result.model).toBe("llama-3.3-70b-versatile");
    expect(result.usage?.totalTokens).toBe(15);

    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions");
    const requestInit = init as RequestInit;
    expect(requestInit.method).toBe("POST");
    expect(requestInit.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: `Bearer ${VALID_KEY}`,
    });
    const body = JSON.parse(requestInit.body as string);
    expect(body.model).toBe("llama-3.3-70b-versatile");
    expect(body.messages).toEqual([
      { role: "system", content: "you are helpful" },
      { role: "user", content: "hi" },
    ]);
    expect(body.temperature).toBe(0.4);
    expect(body.max_tokens).toBe(1500);
  });

  it("includes response_format when jsonMode is true", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({
        status: 200,
        jsonBody: { choices: [{ message: { content: '{"x":1}' } }], model: "x" },
      }) as never
    );

    await callGroqChat({ system: "s", user: "u", jsonMode: true });

    const [, init] = fetchSpy.mock.calls[0]!;
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.response_format).toEqual({ type: "json_object" });
  });

  it("uses custom temperature and maxTokens when provided", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({
        status: 200,
        jsonBody: { choices: [{ message: { content: "ok" } }], model: "x" },
      }) as never
    );

    await callGroqChat({
      system: "s",
      user: "u",
      temperature: 0.7,
      maxTokens: 500,
    });

    const [, init] = fetchSpy.mock.calls[0]!;
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.temperature).toBe(0.7);
    expect(body.max_tokens).toBe(500);
  });

  it("throws GroqParseError when content is missing", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({ status: 200, jsonBody: { choices: [{}], model: "x" } }) as never
    );

    await expect(
      callGroqChat({ system: "s", user: "u" })
    ).rejects.toBeInstanceOf(GroqParseError);
  });
});

describe("callGroqChat - retry behavior", () => {
  it("retries on 429 then succeeds", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        makeMockResponse({ status: 429, jsonBody: { error: "rate limit" } }) as never
      )
      .mockResolvedValueOnce(
        makeMockResponse({
          status: 200,
          jsonBody: { choices: [{ message: { content: "ok" } }], model: "x" },
        }) as never
      );

    const result = await callGroqChat({ system: "s", user: "u" });
    expect(result.content).toBe("ok");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("retries on 500 then succeeds", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        makeMockResponse({ status: 500, textBody: "internal error" }) as never
      )
      .mockResolvedValueOnce(
        makeMockResponse({
          status: 200,
          jsonBody: { choices: [{ message: { content: "ok" } }], model: "x" },
        }) as never
      );

    const result = await callGroqChat({ system: "s", user: "u" });
    expect(result.content).toBe("ok");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("throws GroqRateLimitError after exhausting retries on 429", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({ status: 429, jsonBody: { error: "rate limit" } }) as never
    );

    await expect(
      callGroqChat({ system: "s", user: "u" })
    ).rejects.toBeInstanceOf(GroqRateLimitError);
  }, 15000);

  it("throws GroqServiceError after exhausting retries on 500", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      makeMockResponse({ status: 500, textBody: "internal error" }) as never
    );

    await expect(
      callGroqChat({ system: "s", user: "u" })
    ).rejects.toBeInstanceOf(GroqServiceError);
  }, 15000);
});

describe("callGroqChat - timeout", () => {
  it("throws GroqTimeoutError on abort", async () => {
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            const err = new Error("aborted");
            err.name = "AbortError";
            reject(err);
          }, 50);
        })
    );

    await expect(
      callGroqChat({ system: "s", user: "u", timeoutMs: 20 })
    ).rejects.toBeInstanceOf(GroqTimeoutError);
  }, 10000);
});

describe("extractJsonContent", () => {
  it("parses clean JSON", () => {
    expect(extractJsonContent('{"a":1}')).toEqual({ a: 1 });
  });

  it("parses JSON with surrounding text", () => {
    expect(extractJsonContent('Here is the result: {"a":2} done!')).toEqual({
      a: 2,
    });
  });

  it("parses JSON with newlines", () => {
    const json = `{
      "a": 3,
      "b": "x"
    }`;
    expect(extractJsonContent(json)).toEqual({ a: 3, b: "x" });
  });

  it("throws GroqParseError on invalid input", () => {
    expect(() => extractJsonContent("not json at all")).toThrow(GroqParseError);
  });
});
