import { NextResponse, type NextRequest } from "next/server";
import { generateObject } from 'ai';
import { openrouter } from "@/ai/open-router";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const result = await generateObject({
    model: openrouter.chat('openai/chatgpt-4o-latest'),
    schema: z.object({
      en: z.string().describe('Tradução para inglês'),
      fr: z.string().describe('Tradução para francês'),
      es: z.string().describe('Tradução para espanhol'),
    }),
    prompt: 'Traduza "Hello World" para diferentes idiomas!',
    system: 'Você é uma AI especializada em tradução, sempre retorne da maneira mais sucinta possível.',
  })

  return NextResponse.json({ message: result.object });
}
