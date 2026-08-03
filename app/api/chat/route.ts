import { streamText, convertToModelMessages } from "ai";
import { openrouter } from "@/src/lib/ai/ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter("openai/gpt-4.1-mini"),
    messages: await convertToModelMessages(messages),

    system: `
You are Qorelytics AI.

You are an expert business analyst.

Answer clearly.

Use markdown.

If you don't know something, say so.
`,
  });

  return result.toUIMessageStreamResponse();
}