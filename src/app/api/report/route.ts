import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/demoConfig";
import { generateReport, sendReportEmail, type ReportPayload } from "@/lib/mockApi";

/**
 * POST /api/report
 *
 * Demo-only endpoint. Accepts a full evaluation payload and returns
 * an HTML report (blob-ready on the client) plus an "email delivered"
 * confirmation. No real PDF binary is produced — the client renders
 * the HTML and can print-to-PDF from the browser if desired.
 *
 * Body: ReportPayload (see lib/mockApi.ts)
 */
export async function POST(request: Request) {
  if (!DEMO_MODE) {
    return NextResponse.json(
      { error: "Report endpoint unavailable" },
      { status: 501 }
    );
  }

  try {
    const payload = (await request.json()) as ReportPayload;
    if (!payload?.candidateEmail || !payload?.candidateName) {
      return NextResponse.json(
        { error: "candidateName and candidateEmail are required" },
        { status: 400 }
      );
    }

    const report = await generateReport(payload);
    const email = await sendReportEmail(payload);

    // Server-side cannot return a blobUrl — client will create its own.
    return NextResponse.json({
      fileName: report.fileName,
      html: report.html,
      emailStatus: email.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Report generation failed" },
      { status: 500 }
    );
  }
}
