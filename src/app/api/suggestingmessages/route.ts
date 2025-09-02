import OpenAI, { APIError } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const {name,status,headers,message} = error;
      return 
    } else {
      console.error("There is an Unexpected error", error);
      throw error;
    }
  }
}
