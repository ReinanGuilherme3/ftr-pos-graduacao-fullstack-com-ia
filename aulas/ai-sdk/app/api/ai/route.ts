import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText} from 'ai'

export async function GET(request: NextRequest){
    const result = await generateText({
        model: openai('gpt-4o'),
        prompt: 'Traduza "Hello World" para o português.',
        system: 'Você é um tradutor de inglês para português, sempre retorne da maneira mais sucinta possivel.',
    });

    return NextResponse.json({ message: result.text });
}