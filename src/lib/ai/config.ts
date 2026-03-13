import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * ConfiguraÃ§Ã£o dos Provedores de IA para o I9 Chamados.
 * 
 * - Groq: Utilizado para tarefas de baixa latÃªncia e alta velocidade (Triagem, Coleta).
 * - Gemini: Utilizado para processamento de contexto longo (RAG, Curadoria).
 */

// Provider Groq (via SDK da OpenAI)
export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Provider Gemini (Google)
// Explicitly initialized to ensure the API Key is loaded from process.env
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Modelos Groq e Gemini
export const models = {
  fast: groq('llama-3.3-70b-versatile'), // Para triagem e rascunhos rÃ¡pidos
  mini: groq('llama-3.1-8b-instant'),    // Para validaÃ§Ãµes simples

  // Modelos Google
  reasoning: google('gemini-3.1-flash-lite-preview'), // Para RAG e anÃ¡lise de contexto
  power: google('gemini-pro-latest'),      // Para soluÃ§Ãµes complexas
};


// Interface básica de orquestração com fallback
export async function getModelWithFallback(priority: 'fast' | 'reasoning') {
  if (priority === 'fast') return models.fast;
  return models.reasoning;
}
