import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const endpoint = process.env.NEXT_PUBLIC_AZURE_ENDPOINT;
    const apiKey = process.env.NEXT_PUBLIC_AZURE_API_KEY;

    const response = await fetch(`${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf",
        Authorization: `Bearer ${apiKey}`,
      },
      body: buffer,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
