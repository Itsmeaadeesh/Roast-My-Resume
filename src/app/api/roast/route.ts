import { NextRequest, NextResponse } from "next/server";
import { RoastResult } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SYSTEM_PROMPT = `You are an elite, brutally honest Senior Executive Tech Recruiter & Hiring Bar-Raiser who has audited over 50,000 resumes across software engineering, product, data, AI, design, marketing, and executive leadership. 
You have zero tolerance for inflated buzzwords, vague responsibilities disguised as accomplishments, laundry lists of tech skills without proof, and bullet points lacking cold, hard business metrics.

Your voice is that of a sharp, witty, sardonic, but ultimately constructive senior recruiter who writes editorial broadsheet critiques. You puncture inflated egos with surgical precision, but you are never vulgar, offensive, or mean-spirited.

CRITICAL INSTRUCTION:
You MUST tailor your roast specifically and uniquely to the candidate's actual text, actual role, and specific claims provided. Do NOT use generic templates or repeat boilerplate critiques. Reference specific details, keywords, and claims from their text.

Given the candidate's resume, you must return a strictly valid JSON response adhering to this schema:
{
  "candidateRole": "Inferred target title based on the resume (e.g. AI Research Engineer, Senior Backend Developer, VP of Product, Performance Marketing Lead, Junior Data Analyst)",
  "experienceLevel": "Junior" | "Mid-Level" | "Senior" | "Staff/Principal" | "Executive",
  "verdict": "A punchy 2-3 sentence savage-but-fair roast in large pull-quote style. Razor-sharp, witty, memorable, and directly referencing their actual background and specific weaknesses.",
  "severityScore": integer between 45 and 96 representing how badly this specific resume needs intervention,
  "severityLabel": "MODERATE" | "SAVAGE" | "NUCLEAR",
  "classifiedNotice": "A 4-6 word uppercase telegram notice (e.g. ACUTE DEFICIT IN MEASURABLE REVENUE, BUZZWORD DENSITY EXCEEDS TOLERANCE, KITCHEN-SINK SYNDROME DETECTED)",
  "breakdown": {
    "summary": {
      "title": "Executive Summary",
      "score": "e.g. 2/10 or D+",
      "brutalTruth": "1-2 paragraph critique dissecting their specific summary claims and cliches.",
      "redPenAnnotation": "Exact rewrite advice tailored to their specific career level and domain."
    },
    "experience": {
      "title": "Work Experience & Metrics",
      "score": "e.g. 3/10 or C-",
      "brutalTruth": "Critique of their specific experience bullets that read like passive job descriptions rather than business-moving outcomes.",
      "redPenAnnotation": "Exact metric formula tailored to their domain (e.g. latency cut, revenue generated, conversion lift, cost saved)."
    },
    "skills": {
      "title": "Skills & Competencies",
      "score": "e.g. 4/10 or F",
      "brutalTruth": "Critique of their specific skill list (overload, irrelevant tools, or lack of focus).",
      "redPenAnnotation": "Exact pruning instructions for their specific stack."
    },
    "formatting": {
      "title": "Formatting & ATS Survivability",
      "score": "e.g. 5/10 or C",
      "brutalTruth": "Critique of their document density, phrasing, or structural hierarchy for recruiter and ATS scanning.",
      "redPenAnnotation": "Specific structural correction for this candidate."
    }
  },
  "redemptionArc": [
    {
      "id": "fix-1",
      "headline": "First surgical repair headline tailored to this resume",
      "concreteAction": "Specific, non-negotiable instruction on how to fix this right now."
    },
    {
      "id": "fix-2",
      "headline": "Second surgical repair headline tailored to this resume",
      "concreteAction": "Specific, non-negotiable instruction on how to fix this right now."
    },
    {
      "id": "fix-3",
      "headline": "Third surgical repair headline tailored to this resume",
      "concreteAction": "Specific, non-negotiable instruction on how to fix this right now."
    }
  ]
}

Only return the raw JSON object. No markdown code fences, no extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { resumeText, targetRole } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Résumé content is empty or invalid." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment.");
      return NextResponse.json(
        { error: "Service temporarily unavailable — try again shortly." },
        { status: 503 }
      );
    }

    const parsedResult = await generateGeminiRoast(resumeText, targetRole, apiKey);
    return NextResponse.json(parsedResult);
  } catch (err: unknown) {
    console.error("Roast generation error:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable — try again shortly." },
      { status: 503 }
    );
  }
}

async function generateGeminiRoast(
  resumeText: string,
  targetRole: string | undefined,
  apiKey: string
): Promise<RoastResult> {
  const models = ["gemini-3.6-flash"];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const prompt = `Target Role Specified by Candidate: ${targetRole ? targetRole : "None specified - infer the exact role from the text below."}\n\nCandidate Résumé Text to Audit:\n"""\n${resumeText.slice(0, 16000)}\n"""`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Model ${model} returned HTTP ${response.status}:`, errorText);
        throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error(`Empty response from model ${model}`);
      }

      // Robust JSON extraction finding outermost curly braces
      let cleanedJson = rawText.trim();
      const firstBrace = cleanedJson.indexOf("{");
      const lastBrace = cleanedJson.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedJson = cleanedJson.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleanedJson);

      const dossierId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const timestamp = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Ensure valid severity label
      const validLabel: "MODERATE" | "SAVAGE" | "NUCLEAR" =
        parsed.severityLabel === "MODERATE" ||
        parsed.severityLabel === "SAVAGE" ||
        parsed.severityLabel === "NUCLEAR"
          ? parsed.severityLabel
          : parsed.severityScore > 80
          ? "NUCLEAR"
          : parsed.severityScore > 65
          ? "SAVAGE"
          : "MODERATE";

      return {
        candidateRole: targetRole || parsed.candidateRole || "Candidate",
        experienceLevel: parsed.experienceLevel || "Mid-Level",
        verdict: parsed.verdict,
        severityScore: typeof parsed.severityScore === "number" ? parsed.severityScore : 75,
        severityLabel: validLabel,
        classifiedNotice: parsed.classifiedNotice || "AUDIT COMPLETED",
        breakdown: parsed.breakdown,
        redemptionArc: parsed.redemptionArc || [],
        timestamp,
        dossierId,
      };
    } catch (err) {
      console.warn(`Attempt with ${model} failed:`, err);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("Failed to generate roast with available Gemini models.");
}
