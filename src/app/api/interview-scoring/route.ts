import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { questions, answers, roundTypes, roundLengths } = await request.json();

  if (!questions || !answers) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const endpoint = process.env.NEXT_PUBLIC_INTERVIEW_SCORING_ENDPOINT;
    const apiKey = process.env.NEXT_PUBLIC_INTERVIEW_SCORING_API_KEY;

    const response = await fetch(endpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        questions: JSON.stringify(questions),
        answers: JSON.stringify(answers),
        roundTypes: roundTypes || [],
        roundLengths: roundLengths || [],
        type: "scoring",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to score interview");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
