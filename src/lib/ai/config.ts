import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const GEMINI_DEFAULT_MODEL = 'gemini-3.1-flash-lite-preview';

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export function resolveGeminiModelId(modelId?: string) {
  const preferred = modelId || process.env.GEMINI_PREFERRED_MODEL || GEMINI_DEFAULT_MODEL;
  return preferred.replace(/^models\//, '');
}

export const models = {
  fast: google(resolveGeminiModelId(process.env.GEMINI_FAST_MODEL || GEMINI_DEFAULT_MODEL)),
  mini: google(resolveGeminiModelId(process.env.GEMINI_MINI_MODEL || GEMINI_DEFAULT_MODEL)),
  reasoning: google(resolveGeminiModelId(process.env.GEMINI_REASONING_MODEL || GEMINI_DEFAULT_MODEL)),
  power: google(resolveGeminiModelId(process.env.GEMINI_POWER_MODEL || GEMINI_DEFAULT_MODEL)),
  next: google(resolveGeminiModelId(process.env.GEMINI_NEXT_MODEL || GEMINI_DEFAULT_MODEL)),
};

export async function getModelWithFallback() {
  return models.reasoning;
}
