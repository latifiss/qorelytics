import { createOpenAI } from '@ai-sdk/openai';

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not configured. Add OPENROUTER_API_KEY to the Vercel production environment and redeploy.',
    );
  }

  return createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer':
        process.env.BETTER_AUTH_URL ??
        'http://localhost:3000',
      'X-Title': 'Qorelytics',
    },
  });
}

export function getModel(
  model = 'deepseek/deepseek-v4-flash',
) {
  return getOpenRouterClient()(model);
}
