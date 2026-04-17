import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/demoConfig";
import { generateQuestions } from "@/lib/mockApi";

/**
 * POST /api/generate-questions
 *
 * In DEMO_MODE, delegates to the local mock engine and returns
 * realistic-but-fake interview questions. The response shape
 * matches the original real-API contract so existing UI (which
 * does `JSON.parse(data.output)`) works unchanged.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { resume, job, roundTypes, roundLengths, type } = body ?? {};

  if (!resume || !job) {
    return NextResponse.json(
      { error: "Resume and job description are required" },
      { status: 400 }
    );
  }

  if (DEMO_MODE) {
    try {
      const data = await generateQuestions({ resume, job, roundTypes, roundLengths, type });
      return NextResponse.json(data);
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message ?? "Mock generation failed" },
        { status: 500 }
      );
    }
  }

  // --- Real-API path (kept in place for easy swap-back) --------------
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
        type,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
