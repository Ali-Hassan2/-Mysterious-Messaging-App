import { model } from "mongoose";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each questions should be separated by '||'.These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audiance. Avoid personal or sensitive topics, focusing instead on univesal themes that encourage friendly interaction. For example your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's simple thing that makes you happy?' Ensure the questions are intriguing, foster curiosuty and contribute to a positive and welcoming conversational enviornment.";
    const response = await fetch("https://api.deepseek.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        prompt,
        max_token: 200,
        stream: true,
      }),
    });
    if (!response.ok) {
      const error_Data = await response.json().catch(() => null);
      return NextResponse.json(
        {
          success: false,
          error: error_Data?.message,
        },
        { status: response.status }
      );
    }
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
