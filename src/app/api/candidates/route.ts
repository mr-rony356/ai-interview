import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/demoConfig";
import { listCandidates } from "@/lib/mockApi";

/**
 * GET /api/candidates
 *
 * In DEMO_MODE, returns a generated list of 8 realistic candidate
 * profiles each with their own evaluation, role, score, and status.
 *
 * POST is accepted but is a no-op in this mode (returns a synthetic
 * success response) — the real Supabase/MSSQL-backed implementation
 * is preserved below and will re-activate when DEMO_MODE is false.
 */
export async function GET() {
  if (DEMO_MODE) {
    const candidates = await listCandidates();
    // Shape to match the previous REST contract.
    const shaped = candidates.map((c) => ({
      id: c.id,
      firstName: c.name.split(" ")[0],
      lastName: c.name.split(" ").slice(1).join(" "),
      email: c.email,
      phoneNumber: "",
      currentPosition: c.role,
      skills: [],
      education: [],
      resume: "",
      picture: "",
      // Extra demo-only fields:
      score: c.evaluation.finalScore,
      recommendation: c.evaluation.recommendation,
      status: c.status,
      appliedAt: c.appliedAt,
    }));
    return NextResponse.json(shaped);
  }

  // --- Real MSSQL path preserved for later ---------------------------
  try {
    const { connectToDatabase } = await import("@/lib/db");
    const pool = await connectToDatabase();
    const request = new pool.Request();
    const result = await request.query(`
      SELECT Id, FirstName, LastName, Email, PhoneNumber,
             CurrentPosition, Skills, Education,
             CONVERT(VARCHAR(MAX), Resume, 2) as Resume,
             CONVERT(VARCHAR(MAX), Picture, 2) as Picture
      FROM my_candidates_list
    `);
    const candidates = result.recordset.map((candidate: any) => ({
      id: candidate.Id,
      firstName: candidate.FirstName,
      lastName: candidate.LastName,
      email: candidate.Email,
      phoneNumber: candidate.PhoneNumber,
      currentPosition: candidate.CurrentPosition,
      skills: candidate.Skills ? candidate.Skills.split(",") : [],
      education: candidate.Education ? candidate.Education.split(",") : [],
      resume: candidate.Resume ? `data:application/pdf;base64,${candidate.Resume}` : "",
      picture: candidate.Picture ? `data:image/jpeg;base64,${candidate.Picture}` : "",
    }));
    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (DEMO_MODE) {
    // Simulate a write — no real persistence.
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({
      message: "Candidate added successfully",
      id: `c_${Date.now().toString(36)}`,
      echo: body,
    });
  }
  return NextResponse.json(
    { error: "Endpoint unavailable" },
    { status: 501 }
  );
}
