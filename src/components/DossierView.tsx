import React from "react";
import { RoastResult, MarketData } from "@/types";
import { DossierHeader } from "@/components/DossierHeader";
import { VerdictPullQuote } from "@/components/VerdictPullQuote";
import { SectionBreakdown } from "@/components/SectionBreakdown";
import { RealityCheckPanel } from "@/components/RealityCheckPanel";
import { RedemptionArc } from "@/components/RedemptionArc";

interface DossierViewProps {
  roast: RoastResult;
  marketData: MarketData | null;
  isLoadingMarket: boolean;
  onReset: () => void;
  onOpenCardExport?: () => void;
}

export const DossierView: React.FC<DossierViewProps> = ({
  roast,
  marketData,
  isLoadingMarket,
  onReset,
  onOpenCardExport,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Editorial Broadside Masthead Header */}
      <DossierHeader roast={roast} onReset={onReset} />

      {/* The Verdict Pull Quote */}
      <VerdictPullQuote
        verdict={roast.verdict}
        classifiedNotice={roast.classifiedNotice}
      />

      {/* Section-by-Section Inquest */}
      <SectionBreakdown breakdown={roast.breakdown} />

      {/* Job Market Reality Check Panel */}
      <RealityCheckPanel
        marketData={marketData}
        isLoading={isLoadingMarket}
      />

      {/* The Redemption Arc Checklist */}
      <RedemptionArc items={roast.redemptionArc} />

      {/* Action Footer: Reset & Share Card */}
      <div className="mt-12 pt-6 border-t-2 border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors uppercase tracking-wider cursor-pointer"
        >
          &larr; Audit Another Résumé
        </button>

        {onOpenCardExport && (
          <button
            onClick={onOpenCardExport}
            className="w-full sm:w-auto px-6 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-[#F7F5F0] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>GENERATE VIRAL ROAST CARD</span>
          </button>
        )}
      </div>
    </div>
  );
};
