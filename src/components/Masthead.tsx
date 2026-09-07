import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Masthead: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="w-full border-b border-[#D8D2C7] dark:border-[#2E2D2A] bg-[#F7F5F0] dark:bg-[#141413] transition-colors">
      {/* Top micro-bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex justify-between items-center text-[10px] sm:text-[11px] font-mono tracking-widest text-[#5C5855] dark:text-[#9E9A93] uppercase border-b border-[#E8E2D7] dark:border-[#262522]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#1A1A1A] dark:text-[#F0EDE5]">VOL. XCIV • NO. 48,102</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">EDITION: TECH RECRUITMENT & LABOR LIQUIDITY</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline">{currentDate}</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden md:inline text-[#B91C1C] dark:text-[#EF4444] font-semibold">LATE CITY FINAL</span>
          <span className="hidden md:inline">|</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Main newspaper title banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 text-center">
        <div className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#B91C1C] dark:text-[#EF4444] font-semibold mb-1">
          Confidential Senior Recruiter Dossier
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-[#1A1A1A] dark:text-[#F0EDE5] leading-[1.05]">
          ROAST MY RÉSUMÉ
        </h1>
        <p className="mt-2 text-xs sm:text-sm md:text-base font-serif italic text-[#5C5855] dark:text-[#9E9A93] max-w-2xl mx-auto">
          &ldquo;Unfiltered editorial triage for the modern tech professional, cross-examined against real-world labor demand.&rdquo;
        </p>
      </div>

      {/* Lower masthead ticker rule */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex justify-between items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5C5855] dark:text-[#9E9A93] border-t-2 border-b border-[#1A1A1A] dark:border-[#EDEAE4]">
        <span className="truncate">MARKET BENCHMARK: USAJOBS GOV INDEX</span>
        <span className="hidden sm:inline">ZERO STORAGE PRIVACY POLICY</span>
        <span className="text-[#B91C1C] dark:text-[#EF4444] font-semibold">HONESTY OVER DIPLOMACY</span>
      </div>
    </header>
  );
};
