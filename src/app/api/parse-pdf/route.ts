import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import to avoid bundling issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParseModule = (await import("pdf-parse")) as any;
    const pdfParse = pdfParseModule.default || pdfParseModule;
    
    // pdf-parse can be called as a function or class
    let extractedText = "";
    if (typeof pdfParse === "function") {
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text || "";
    } else if (pdfParse.PDFParser) {
      const parser = new pdfParse.PDFParser();
      const parsed = await parser.parseBuffer(buffer);
      extractedText = parsed.text || "";
    } else {
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract readable text from PDF. Please paste text directly." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: extractedText.trim(),
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: unknown) {
    console.error("PDF Parsing error:", err);
    const message = err instanceof Error ? err.message : "Failed to parse PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
