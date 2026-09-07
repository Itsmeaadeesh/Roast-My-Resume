export interface SectionCritique {
  title: string;
  score: string; // e.g. "3/10" or "D+"
  brutalTruth: string;
  redPenAnnotation: string;
}

export interface RedemptionItem {
  id: string;
  headline: string;
  concreteAction: string;
}

export interface RoastResult {
  candidateRole: string;
  experienceLevel: string; // "Junior" | "Mid-Level" | "Senior" | "Staff/Principal" | "Executive"
  verdict: string;
  severityScore: number; // 0 to 100
  severityLabel: "MODERATE" | "SAVAGE" | "NUCLEAR";
  classifiedNotice: string; // e.g. "DEFICIT OBSERVED IN QUANTIFIABLE IMPACT"
  breakdown: {
    summary: SectionCritique;
    experience: SectionCritique;
    skills: SectionCritique;
    formatting: SectionCritique;
  };
  redemptionArc: RedemptionItem[];
  timestamp: string;
  dossierId: string;
}

export interface MarketListing {
  title: string;
  agency: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  url: string;
}

export interface MarketData {
  roleQueried: string;
  totalOpenings: number;
  competitionLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME";
  competitionRatioText: string; // e.g. "~142 applicants per vacancy"
  salaryMin: number;
  salaryMax: number;
  salaryMedian: number;
  sampleListings: MarketListing[];
  insufficientData: boolean;
  statusNote?: string;
}
