import React from "react";
import { ArrowLeft, AlertOctagon, Flame } from "lucide-react";
import { RoastResult } from "@/types";

interface DossierHeaderProps {
  roast: RoastResult;
  onReset: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({ roast, onReset }) => {
  const getSeverityBadge = () => {
    switch (roast.severityLabel) {
      case "NUCLEAR":
        return {
          text: "SEVERITY: NUCLEAR / COMPLETE OVERHAUL",
          bg: "bg-[#1A1A1A] dark:bg-[#EDEAE4] text-[#F7F5F0] dark:text-[#141413]",
          border: "border-[#1A1A1A] dark:border-[#EDEAE4]",
        };
      case "SAVAGE":
        return {
          text: "SEVERITY: SAVAGE / CRITICAL DEFICITS",
          bg: "bg-[#B91C1C] dark:bg-[#EF4444] text-[#F7F5F0] dark:text-[#FFFFFF]",
          border: "border-[#B91C1C] dark:border-[#EF4444]",
        };
      default:
        return {
          text: "SEVERITY: MODERATE / REPAIRABLE",
          bg: "bg-[#EFEAE1] dark:bg-[#1C1C1A] text-[#1A1A1A] dark:text-[#F0EDE5]",
          border: "border-[#8C8477] dark:border-[#383530]",
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div className="w-full border-b border-[#1A1A1A] dark:border-[#EDEAE4] pb-6 mb-8 transition-colors">
      {/* Top back link & dossier tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#D8D2C7] dark:border-[#2E2D2A] text-xs font-mono">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[#5C5855] dark:text-[#9E9A93] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors cursor-pointer self-start"
        >
          <ArrowLeft size={14} />
          <span>&larr; SUBMIT ANOTHER DOSSIER</span>
        </button>

        <div className="flex items-center gap-3 text-[#8C8477] dark:text-[#7A756D] text-[11px] uppercase tracking-wider">
          <span>DOSSIER #{roast.dossierId}</span>
          <span>•</span>
          <span>DATE: {roast.timestamp}</span>
        </div>
      </div>

      {/* Title & Metadata Grid */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#B91C1C] dark:text-[#EF4444] font-semibold flex items-center gap-1.5 mb-1.5">
            <AlertOctagon size={13} />
            <span>CONFIDENTIAL AUDIT // SENIOR TECH RECRUITER DESK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#1A1A1A] dark:text-[#F0EDE5] tracking-tight">
            The Candidate Dossier.
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-[#5C5855] dark:text-[#9E9A93]">
            <span className="uppercase tracking-wider font-semibold text-[#1A1A1A] dark:text-[#F0EDE5]">
              INFERRED PROFILE:
            </span>
            <span className="bg-[#EFEAE1] dark:bg-[#1C1C1A] px-2 py-0.5 border border-[#D8D2C7] dark:border-[#2E2D2A] text-[#1A1A1A] dark:text-[#F0EDE5] font-bold">
              {roast.candidateRole}
            </span>
            <span>•</span>
            <span>TIER: {roast.experienceLevel}</span>
          </div>
        </div>

        {/* Severity Stamp Badge */}
        <div className="flex flex-col items-start md:items-end gap-1.5">
          <div
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-widest font-bold border flex items-center gap-2 ${badge.bg} ${badge.border}`}
          >
            <Flame size={14} />
            <span>{badge.text}</span>
          </div>
          <span className="text-[10px] font-mono text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider">
            ROAST INDEX: {roast.severityScore}/100 • NOT APPROVED FOR ATS
          </span>
        </div>
      </div>
    </div>
  );
};
