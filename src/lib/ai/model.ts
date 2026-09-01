import { createOpenAI } from '@ai-sdk/openai';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error(
    'OPENROUTER_API_KEY is not configured.',
  );
}

export const openRouter = createOpenAI({
  apiKey,
  baseURL:
    'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer':
      process.env.BETTER_AUTH_URL ??
      'http://localhost:3000',
    'X-Title': 'Qorelytics',
  },
});

export function getModel(
  model = 'deepseek/deepseek-chat',
) {
  return openRouter(model);
}