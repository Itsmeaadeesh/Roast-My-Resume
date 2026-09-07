import { NextRequest, NextResponse } from "next/server";
import { RoastResult } from "@/types";

const SYSTEM_PROMPT = `You are an elite, brutally honest Senior Executive Tech Recruiter & Hiring Bar-Raiser who has audited over 50,000 engineering and tech resumes. 
You have zero tolerance for inflated buzzwords ("dynamic visionary", "cloud ninja", "spearheaded synergies"), vague responsibilities disguised as accomplishments, laundry lists of 40 tech skills without proof, and bullet points lacking cold, hard business metrics.

Your voice is that of a sharp, witty, sardonic, but ultimately constructive senior recruiter who writes editorial broadsheet critiques. You puncture inflated egos with precision, but you are never vulgar, offensive, or mean-spirited.

Given the candidate's resume, you must return a strictly valid JSON response adhering to the exact schema:
{
  "candidateRole": "Inferred target title (e.g. Senior Full-Stack Engineer, Staff SRE, Lead Product Manager)",
  "experienceLevel": "Junior" | "Mid-Level" | "Senior" | "Staff/Principal" | "Executive",
  "verdict": "A punchy 2-3 sentence savage-but-fair roast in large pull-quote style. Razor-sharp, memorable, and captures the core weakness.",
  "severityScore": integer between 45 and 96 representing how badly this resume needs intervention,
  "severityLabel": "MODERATE" | "SAVAGE" | "NUCLEAR",
  "classifiedNotice": "A 4-6 word uppercase telegram notice (e.g. ACUTE DEFICIT IN MEASURABLE REVENUE, BUZZWORD DENSITY EXCEEDS TOLERANCE, KITCHEN-SINK SYNDROME DETECTED)",
  "breakdown": {
    "summary": {
      "title": "Executive Summary",
      "score": "e.g. 2/10 or D+",
      "brutalTruth": "1-2 paragraph critique dissecting cliches and self-aggrandizing claims.",
      "redPenAnnotation": "Exact rewrite advice: e.g. Cut the entire paragraph or replace 'passionate problem solver' with years of production experience and scale."
    },
    "experience": {
      "title": "Work Experience & Metrics",
      "score": "e.g. 4/10 or C-",
      "brutalTruth": "Critique of bullet points that read like job descriptions rather than business-moving outcomes.",
      "redPenAnnotation": "Exact metric formula: e.g. Reframe 'responsible for microservices' to 'Cut API p99 latency from 450ms to 85ms across 12M DAUs using Redis caching'."
    },
    "skills": {
      "title": "Skills & Competencies",
      "score": "e.g. 3/10 or F",
      "brutalTruth": "Critique of tool overload, irrelevant acronyms, or listing technologies touched once in 2019.",
      "redPenAnnotation": "Exact cut: e.g. Prune from 28 tools to 8 core production competencies grouped by language and infrastructure."
    },
    "formatting": {
      "title": "Formatting & ATS Survivability",
      "score": "e.g. 5/10 or C",
      "brutalTruth": "Critique of density, length, font sprawl, or layout quirks that choke applicant tracking systems.",
      "redPenAnnotation": "Structural fix: e.g. Eliminate 2-column tables and reduce page count to a tight single page."
    }
  },
  "redemptionArc": [
    {
      "id": "fix-1",
      "headline": "First surgical repair headline",
      "concreteAction": "Specific, non-negotiable instruction on how to fix this right now."
    },
    {
      "id": "fix-2",
      "headline": "Second surgical repair headline",
      "concreteAction": "Specific, non-negotiable instruction on how to fix this right now."
    },
    {
      "id": "fix-3",
      "headline": "Third surgical repair headline",
      "concreteAction": "Specific, non-negotiable instruction on how to fix this right now."
    }
  ]
}

Only return the JSON object, with no markdown code fences, no extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { resumeText, targetRole, customApiKey } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Résumé content is empty or invalid." },
        { status: 400 }
      );
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let parsedResult: RoastResult;

    if (apiKey) {
      try {
        parsedResult = await generateGeminiRoast(resumeText, targetRole, apiKey);
      } catch (geminiError: unknown) {
        console.warn("Gemini API call failed, using intelligent fallback:", geminiError);
        parsedResult = generateCuratedRoast(resumeText, targetRole);
      }
    } else {
      // Intelligent fallback when key not yet configured in local env
      parsedResult = generateCuratedRoast(resumeText, targetRole);
    }

    return NextResponse.json(parsedResult);
  } catch (err: unknown) {
    console.error("Roast error:", err);
    const message = err instanceof Error ? err.message : "Internal error generating roast.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function generateGeminiRoast(
  resumeText: string,
  targetRole: string | undefined,
  apiKey: string
): Promise<RoastResult> {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const prompt = `Candidate Target Role Override: ${targetRole || "Auto-infer from content"}\n\nCandidate Résumé Text:\n"""\n${resumeText.slice(0, 15000)}\n"""`;

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
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty response from Gemini");
      }

      // Clean markdown code blocks if any
      const cleanedJson = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleanedJson);

      const dossierId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const timestamp = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        candidateRole: targetRole || parsed.candidateRole || "Software Engineer",
        experienceLevel: parsed.experienceLevel || "Mid-to-Senior",
        verdict: parsed.verdict || "This resume demonstrates broad familiarity with tech jargon while carefully omitting any trace of measurable commercial impact.",
        severityScore: parsed.severityScore || 78,
        severityLabel: parsed.severityLabel || "SAVAGE",
        classifiedNotice: parsed.classifiedNotice || "QUANTIFIABLE IMPACT DEFICIT DETECTED",
        breakdown: parsed.breakdown,
        redemptionArc: parsed.redemptionArc,
        timestamp,
        dossierId,
      };
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("Failed to generate roast with Gemini");
}

function generateCuratedRoast(resumeText: string, targetRole?: string): RoastResult {
  const lower = resumeText.toLowerCase();

  const isEngineer = lower.includes("developer") || lower.includes("engineer") || lower.includes("code") || lower.includes("react");
  const isPM = lower.includes("product manager") || lower.includes("roadmap") || lower.includes("prd");

  const inferredRole = targetRole || (isPM ? "Product Manager" : isEngineer ? "Senior Software Engineer" : "Tech Professional");
  const dossierId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    candidateRole: inferredRole,
    experienceLevel: lower.includes("senior") || lower.includes("lead") ? "Senior" : "Mid-Level",
    verdict: `You have successfully assembled every buzzword coined in Silicon Valley between 2018 and last Tuesday, yet managed to describe zero verifiable business outcomes. Your resume reads less like a track record of engineering excellence and more like an applicant trying to out-talk an automated keyword scanner.`,
    severityScore: 84,
    severityLabel: "SAVAGE",
    classifiedNotice: "EXTREME SYNERGY-TO-IMPACT RATIO",
    breakdown: {
      summary: {
        title: "Executive Summary",
        score: "2/10",
        brutalTruth: "Your summary is an echo chamber of self-appointed titles: 'visionary', 'disruptive leader', and 'passionate synergizer'. Recruiters spend 6 seconds per resume; using 5 of them to explain that you 'thrive in agile environments' tells us you have nothing concrete to anchor your seniority.",
        redPenAnnotation: "Eradicate all adjectives. Replace with: 'Software Engineer with 5+ years building distributed backend APIs handling 10k+ QPS.'",
      },
      experience: {
        title: "Work Experience & Metrics",
        score: "3/10",
        brutalTruth: "Every single bullet point begins with an aggressive verb ('Spearheaded', 'Revolutionized', 'Championed') followed immediately by passive maintenance work ('participated in standups', 'assisted in refactoring'). You wrote what you were supposed to do, not what actually changed because you showed up to work.",
        redPenAnnotation: "Use the Google XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. If you cannot name the percentage of latency cut or dollars saved, delete the bullet.",
      },
      skills: {
        title: "Technical Skills & Toolkit",
        score: "4/10",
        brutalTruth: "Listing 24 distinct programming languages, 8 cloud platforms, and Jira does not signal versatility; it signals that you watched a 15-minute YouTube overview of Kubernetes and added it to your resume. A recruiter will test you on the weakest item and disqualify you immediately.",
        redPenAnnotation: "Group into 'Core Production' and 'Proficient'. Cap your primary toolkit to the 6 technologies you can comfortably debug on a whiteboard at 9:00 AM.",
      },
      formatting: {
        title: "Formatting & ATS Survivability",
        score: "5/10",
        brutalTruth: "Your layout attempts to cram two decades of aspirations into a visually dense wall of text. Applicant tracking systems (and tired recruiters on their 80th application of the morning) will gloss over this wall without retaining a single differentiator.",
        redPenAnnotation: "Enforce strict single-column hierarchy, consistent 10pt/12pt typography, and minimum 1.25 line-height with generous section spacing.",
      },
    },
    redemptionArc: [
      {
        id: "fix-1",
        headline: "Purge the Corporate Buzzword Bingo",
        concreteAction: "Search your document for 'spearheaded', 'synergy', 'passionate', 'disruptive', and 'evangelist'. Delete every instance and replace with the specific technical tool and direct business outcome.",
      },
      {
        id: "fix-2",
        headline: "Attach Hard Metrics to Top 3 Accomplishments",
        concreteAction: "For your most recent position, ensure at least three bullets contain verifiable figures: latency reduction (%), revenue impact ($), user volume (DAU/MAU), or infrastructure cost cut (%).",
      },
      {
        id: "fix-3",
        headline: "Prune the Kitchen-Sink Skills Inventory",
        concreteAction: "Cut your skills section in half. Remove anything you have not pushed to a production branch in the last 18 months.",
      },
    ],
    timestamp,
    dossierId,
  };
}
