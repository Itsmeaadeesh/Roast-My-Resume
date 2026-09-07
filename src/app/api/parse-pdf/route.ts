import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No résumé file was received." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Verify PDF header magic bytes "%PDF-"
    const header = new TextDecoder().decode(uint8Array.subarray(0, 5));
    if (header !== "%PDF-") {
      return NextResponse.json(
        {
          error:
            "The uploaded file is not a valid PDF document. Please paste your résumé text manually.",
        },
        { status: 422 }
      );
    }

    let parsedResult;
    try {
      parsedResult = await extractText(uint8Array);
    } catch (parseErr: unknown) {
      console.warn("PDF extraction error:", parseErr);
      return NextResponse.json(
        {
          error:
            "The uploaded PDF appears corrupted or unreadable. Please paste your résumé text manually.",
        },
        { status: 422 }
      );
    }

    const rawText = Array.isArray(parsedResult.text)
      ? parsedResult.text.join("\n\n")
      : parsedResult.text || "";

    const cleanText = rawText.trim();

    // Edge case: Image-only / scanned PDF without text objects
    if (!cleanText || cleanText.length < 15) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this PDF. It may be a scanned image or protected document. Please paste your résumé text manually.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: cleanText,
      fileName: file.name,
      fileSize: file.size,
      totalPages: parsedResult.totalPages || 1,
    });
  } catch (err: unknown) {
    console.error("PDF route error:", err);
    return NextResponse.json(
      {
        error:
          "Unable to read this PDF file. Please paste your résumé text manually.",
      },
      { status: 422 }
    );
  }
}
