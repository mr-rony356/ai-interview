import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { jobDescription } = await request.json();

  try {
    const response = await axios.post(
      `${process.env.AZURE_OAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OAI_DEPLOYMENT_NAME}/completions?api-version=${process.env.AZURE_OAI_API_VERSION}`,
      {
        prompt: `Generate interview questions for the following job description: ${jobDescription}`,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OAI_API_KEY,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
