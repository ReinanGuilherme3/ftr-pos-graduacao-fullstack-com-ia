import { NextRequest, NextResponse } from "next/server";
import { openrouter} from "@/ai/open-router";
import { generateText} from 'ai'

export async function GET(request: NextRequest){
    const result = await generateText({
        model: openrouter.chat('openai/chatgpt-4o-latest'),
        prompt: 'Traduza "Hello World" para o português.',
        system: 'Você é um tradutor de inglês para português, sempre retorne da maneira mais sucinta possivel.',
    });

    return NextResponse.json({ message: result.text });
}