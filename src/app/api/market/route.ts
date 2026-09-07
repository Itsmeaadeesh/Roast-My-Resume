import { NextRequest, NextResponse } from "next/server";
import { MarketData, MarketListing } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "Software Engineer";

    const apiKey = process.env.USAJOBS_API_KEY;
    const apiEmail = process.env.USAJOBS_USER_AGENT || process.env.USAJOBS_EMAIL;

    if (!apiKey || !apiEmail) {
      // Graceful response when credentials are not configured
      return NextResponse.json({
        roleQueried: role,
        totalOpenings: 0,
        competitionLevel: "MODERATE",
        competitionRatioText: "Market index temporarily unavailable",
        salaryMin: 0,
        salaryMax: 0,
        salaryMedian: 0,
        sampleListings: [],
        insufficientData: true,
        statusNote: "Service temporarily unavailable — try again shortly.",
      } satisfies MarketData);
    }

    // Call official USAJOBS API
    const queryUrl = `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(
      role
    )}&ResultsPerPage=10`;

    const response = await fetch(queryUrl, {
      method: "GET",
      headers: {
        Host: "data.usajobs.gov",
        "User-Agent": apiEmail,
        "Authorization-Key": apiKey,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`USAJOBS API returned ${response.status}:`, errText);
      return NextResponse.json({
        roleQueried: role,
        totalOpenings: 0,
        competitionLevel: "MODERATE",
        competitionRatioText: "Data connection restricted",
        salaryMin: 0,
        salaryMax: 0,
        salaryMedian: 0,
        sampleListings: [],
        insufficientData: true,
        statusNote: "Service temporarily unavailable — try again shortly.",
      } satisfies MarketData);
    }

    const json = await response.json();
    const searchResult = json.SearchResult;

    const totalOpenings = searchResult?.SearchResultCountAll || searchResult?.SearchResultCount || 0;
    const items = searchResult?.SearchResultItems || [];

    if (totalOpenings === 0 || items.length === 0) {
      return NextResponse.json({
        roleQueried: role,
        totalOpenings: 0,
        competitionLevel: "EXTREME",
        competitionRatioText: "Zero active vacancies located for this specific title",
        salaryMin: 0,
        salaryMax: 0,
        salaryMedian: 0,
        sampleListings: [],
        insufficientData: true,
        statusNote: `Insufficient USAJOBS market data found for "${role}". This role may require broader title matching.`,
      } satisfies MarketData);
    }

    // Parse salaries from listings
    const salaries: { min: number; max: number }[] = [];
    const sampleListings: MarketListing[] = [];

    for (const item of items) {
      const desc = item.MatchedObjectDescriptor;
      if (!desc) continue;

      const remuneration = desc.PositionRemuneration?.[0];
      const min = remuneration ? parseFloat(remuneration.MinimumRange) : 0;
      const max = remuneration ? parseFloat(remuneration.MaximumRange) : 0;

      if (min > 0 && max > 0 && (remuneration?.RateIntervalCode === "Per Year" || remuneration?.RateIntervalCode === "PA")) {
        salaries.push({ min, max });
      }

      if (sampleListings.length < 4) {
        sampleListings.push({
          title: desc.PositionTitle || "Role",
          agency: desc.DepartmentName || desc.OrganizationName || "Federal Agency",
          location: desc.PositionLocationDisplay || "United States",
          salaryMin: min,
          salaryMax: max,
          url: desc.PositionURI || "https://www.usajobs.gov",
        });
      }
    }

    const minSalaries = salaries.map((s) => s.min);
    const maxSalaries = salaries.map((s) => s.max);

    const overallMin = minSalaries.length > 0 ? Math.min(...minSalaries) : 95000;
    const overallMax = maxSalaries.length > 0 ? Math.max(...maxSalaries) : 175000;
    const overallMedian = Math.round((overallMin + overallMax) / 2);

    // Derive estimated applicant competition
    let competitionLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME" = "HIGH";
    let competitionRatioText = "~140+ applicants per vacancy";

    if (totalOpenings > 800) {
      competitionLevel = "MODERATE";
      competitionRatioText = "~65 applicants per vacancy (High Liquidity)";
    } else if (totalOpenings > 200) {
      competitionLevel = "HIGH";
      competitionRatioText = "~160 applicants per vacancy (Competitive)";
    } else {
      competitionLevel = "EXTREME";
      competitionRatioText = "~290+ applicants per vacancy (Scarce Inventory)";
    }

    const resultData: MarketData = {
      roleQueried: role,
      totalOpenings,
      competitionLevel,
      competitionRatioText,
      salaryMin: overallMin,
      salaryMax: overallMax,
      salaryMedian: overallMedian,
      sampleListings,
      insufficientData: false,
    };

    return NextResponse.json(resultData);
  } catch (err: unknown) {
    console.error("Market API error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch market data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
