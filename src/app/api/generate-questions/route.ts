import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { resume, job, roundTypes, roundLengths ,type} = await request.json();

  if (!resume || !job) {
    return NextResponse.json(
      { error: "Resume and job description are required" },
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
        resume,
        job,
        roundTypes: roundTypes || [],
        roundLengths: roundLengths || [],
        type:type
      }),
    });


    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
