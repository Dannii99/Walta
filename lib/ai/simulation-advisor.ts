import {
  SIMULATION_ADVISOR_SYSTEM,
  buildAdvisorUserPrompt,
  type AdvisorContext,
} from "./prompts";
import { callGroqChat, extractJsonContent, GroqParseError } from "./groq-client";
import { AdvisorAnalysisSchema, type AdvisorAnalysis } from "./schemas";

/**
 * Generate a structured financial advisor analysis for a simulation.
 * Returns a validated AdvisorAnalysis object.
 */
export async function generateAdvisorAnalysis(
  context: AdvisorContext
): Promise<AdvisorAnalysis> {
  const system = SIMULATION_ADVISOR_SYSTEM;
  const user = buildAdvisorUserPrompt(context);

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
    throw new GroqParseError("Failed to parse GROQ advisor response", err);
  }

  const validated = AdvisorAnalysisSchema.safeParse(parsedJson);
  if (!validated.success) {
    throw new GroqParseError(
      `Advisor response failed schema validation: ${validated.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }

  return validated.data;
}
