import React from "react";
import { RoastResult } from "@/types";
import { PenTool } from "lucide-react";

interface SectionBreakdownProps {
  breakdown: RoastResult["breakdown"];
}

export const SectionBreakdown: React.FC<SectionBreakdownProps> = ({ breakdown }) => {
  const sections = [
    {
      index: "01",
      key: "summary",
      label: "EXECUTIVE SUMMARY & OBJECTIVE CLAIMS",
      data: breakdown.summary,
    },
    {
      index: "02",
      key: "experience",
      label: "WORK EXPERIENCE & IMPACT METRICS",
      data: breakdown.experience,
    },
    {
      index: "03",
      key: "skills",
      label: "TECHNICAL SKILLS & TOOLKIT DENSITY",
      data: breakdown.skills,
    },
    {
      index: "04",
      key: "formatting",
      label: "FORMATTING, SYNTAX & ATS SURVIVABILITY",
      data: breakdown.formatting,
    },
  ];

  return (
    <section className="my-10">
      <div className="border-b-2 border-[#1A1A1A] pb-2 mb-6 flex items-baseline justify-between">
        <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-[#1A1A1A] tracking-tight">
          Section-by-Section Inquest
        </h3>
        <span className="text-xs font-mono text-[#8C8477] uppercase tracking-wider">
          4 DIAGNOSTIC AUDITS
        </span>
      </div>

      <div className="space-y-8">
        {sections.map(({ index, label, data }) => (
          <article
            key={index}
            className="border-b border-[#D8D2C7] pb-8 last:border-b-0"
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-mono font-bold text-[#B91C1C]">
                  [{index}]
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A]">
                  {label}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-[#8C8477]">
                  EVALUATION:
                </span>
                <span className="px-2 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0] text-xs font-mono font-bold">
                  {data.score}
                </span>
              </div>
            </div>

            {/* Brutal Truth Body */}
            <p className="text-sm sm:text-base font-serif text-[#1A1A1A] leading-relaxed mb-4 pl-0 sm:pl-9">
              {data.brutalTruth}
            </p>

            {/* Red Pen Annotation */}
            <div className="ml-0 sm:ml-9 p-3 bg-[#FAF0F0] border-l-2 border-[#B91C1C] text-xs font-mono text-[#1A1A1A] flex items-start gap-2.5">
              <PenTool size={14} className="text-[#B91C1C] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-[#B91C1C] uppercase tracking-wider mr-1.5">
                  [RED-PEN CORRECTION]:
                </span>
                <span>{data.redPenAnnotation}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
