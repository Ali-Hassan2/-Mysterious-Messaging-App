import OpenAI, { APIError } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each questions should be separated by '||'.These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audiance. Avoid personal or sensitive topics, focusing instead on univesal themes that encourage friendly interaction. " 
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse(
        {
          name,
          status,
          headers,
          message,
        },
        { status }
      );
    } else {
      console.error("There is an Unexpected error", error);
      throw error;
    }
  }
}
