import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/demoConfig";

/**
 * POST /api/extract-text
 *
 * In DEMO_MODE, simulates OCR extraction from an uploaded resume.
 * Returns a synthetic `pages` structure that matches the Azure
 * Form Recognizer contract the rest of the app expects.
 */
export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (DEMO_MODE) {
    // Simulated OCR output — resembles the Azure `pages` shape
    // (pages[].lines[].content) so downstream flatMap logic works.
    const mockLines = [
      "Jordan Rivera — Senior Software Engineer",
      "jordan.rivera@gmail.com | linkedin.com/in/jrivera",
      "Experience: 6 years full-stack, React / Node / Postgres",
      "Led design system rollout, mentored 3 junior engineers",
      "Shipped payments migration reducing failed txns 23%",
      "Education: B.S. Computer Science, State University",
      "Skills: TypeScript, React, Node.js, SQL, AWS, Testing",
    ];
    return NextResponse.json({
      pages: [
        {
          pageNumber: 1,
          lines: mockLines.map((content) => ({ content })),
        },
      ],
    });
  }

  // --- Real Azure path preserved for later ---------------------------
  try {
    const { AzureKeyCredential, DocumentAnalysisClient } = await import(
      "@azure/ai-form-recognizer"
    );
    const { Readable } = await import("stream");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const credential = new AzureKeyCredential(process.env.NEXT_PUBLIC_AZURE_API_KEY!);
    const client = new DocumentAnalysisClient(
      process.env.NEXT_PUBLIC_AZURE_ENDPOINT!,
      credential
    );

    const poller = await client.beginAnalyzeDocument("prebuilt-read", stream);
    const { pages } = await poller.pollUntilDone();
    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error("Error analyzing document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
