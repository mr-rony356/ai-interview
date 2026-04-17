import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/demoConfig";
import { scoreInterview } from "@/lib/mockApi";

/**
 * POST /api/interview-scoring
 *
 * In DEMO_MODE, runs the candidate's answers through the local
 * mock scoring engine — producing weighted scores, category
 * breakdown, and AI reasoning that tracks the score. Returns both
 * a markdown `output` string (for the existing UI) and a
 * structured `evaluation` object (for dashboard / report consumers).
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { questions, answers, roundTypes, roundLengths } = body ?? {};

  if (!questions || !answers) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (DEMO_MODE) {
    try {
      // The existing UI sends `questions` and `answers` already in JSON
      // form inside the body. We parse if needed.
      const parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
      const parsedAnswers = typeof answers === "string" ? JSON.parse(answers) : answers;
      const data = await scoreInterview({
        questions: parsedQuestions,
        answers: parsedAnswers,
        roundTypes,
        roundLengths,
      });
      return NextResponse.json(data);
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message ?? "Mock scoring failed" },
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
