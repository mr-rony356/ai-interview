import { NextResponse } from "next/server";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { DefaultAzureCredential } from "@azure/identity";
import { Readable } from "stream";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Convert the file to a stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // Initialize the Document Analysis Client
    const credential = new AzureKeyCredential(
      process.env.NEXT_PUBLIC_AZURE_API_KEY!
    );
    const client = new DocumentAnalysisClient(
      process.env.NEXT_PUBLIC_AZURE_ENDPOINT!, // Your Azure endpoint
      credential
    );

    // Analyze the document
    const poller = await client.beginAnalyzeDocument("prebuilt-read", stream);
    const { pages } = await poller.pollUntilDone();

    // Return the analysis results
    return NextResponse.json({
      pages,
    });
  } catch (error: any) {
    console.error("Error analyzing document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
