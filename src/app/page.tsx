"use client";

import React, { useState } from "react";
import { Masthead } from "@/components/Masthead";
import { ResumeInput } from "@/components/ResumeInput";
import { TelegramLoader } from "@/components/TelegramLoader";
import { DossierView } from "@/components/DossierView";
import { RoastCardModal } from "@/components/RoastCardModal";
import { RoastResult, MarketData } from "@/types";
import { Shield, AlertTriangle } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const [lastSubmission, setLastSubmission] = useState<{
    resumeText: string;
    targetRole: string;
  } | null>(null);

  const fetchMarketData = async (role: string) => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch(`/api/market?role=${encodeURIComponent(role)}`);

      if (res.ok) {
        const data: MarketData = await res.json();
        setMarketData(data);
      }
    } catch (err) {
      console.warn("Error fetching market data:", err);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  const handleResumeSubmit = async (resumeText: string, targetRole: string) => {
    setIsLoading(true);
    setError(null);
    setLastSubmission({ resumeText, targetRole });

    try {
      // Call server-side Roast API
      const roastRes = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole,
        }),
      });

      const roastData = await roastRes.json();
      if (!roastRes.ok) {
        throw new Error(
          roastData.error || "Service temporarily unavailable — try again shortly."
        );
      }

      setRoastResult(roastData);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Trigger USAJOBS Market Reality Check
      fetchMarketData(roastData.candidateRole);
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Service temporarily unavailable — try again shortly.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] dark:bg-[#141413] text-[#1A1A1A] dark:text-[#F0EDE5] font-serif transition-colors">
      {/* Masthead Header */}
      <Masthead />

      {/* Main Content Area */}
      <main className="flex-1">
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 border-l-4 border-[#B91C1C] dark:border-[#EF4444] bg-[#FAF0F0] dark:bg-[#2A1515] text-[#1A1A1A] dark:text-[#F0EDE5] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#B91C1C] dark:text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#B91C1C] dark:text-[#EF4444] uppercase tracking-wider block mb-1">
                    EDITORIAL DESK NOTICE // REVISE & RETRY
                  </span>
                  <span className="leading-relaxed">{error}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {lastSubmission && (
                  <button
                    onClick={() => handleResumeSubmit(lastSubmission.resumeText, lastSubmission.targetRole)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-[#B91C1C] dark:bg-[#EF4444] text-[#F7F5F0] dark:text-[#FFFFFF] hover:bg-[#991B1B] dark:hover:bg-[#DC2626] font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                  >
                    Retry Submission
                  </button>
                )}
                <button
                  onClick={() => setError(null)}
                  className="px-2.5 py-1.5 border border-[#D8D2C7] dark:border-[#3E3B36] hover:border-[#1A1A1A] dark:hover:border-[#EDEAE4] text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <TelegramLoader />
        ) : roastResult ? (
          <DossierView
            roast={roastResult}
            marketData={marketData}
            isLoadingMarket={isLoadingMarket}
            onReset={() => {
              setRoastResult(null);
              setMarketData(null);
              setError(null);
            }}
            onOpenCardExport={() => setIsCardModalOpen(true)}
          />
        ) : (
          <ResumeInput onSubmit={handleResumeSubmit} isLoading={isLoading} />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="w-full border-t border-[#D8D2C7] dark:border-[#2E2D2A] bg-[#FAF8F5] dark:bg-[#191816] py-8 mt-16 text-xs font-mono text-[#5C5855] dark:text-[#9E9A93] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A1A] dark:text-[#F0EDE5] uppercase tracking-wider">
              ROAST MY RÉSUMÉ
            </span>
            <span>•</span>
            <span>PUBLISHED INDEPENDENTLY</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-[#B91C1C] dark:text-[#EF4444]" />
              ZERO DATA STORAGE
            </span>
            <span>•</span>
            <span>GEMINI 3.6 FLASH</span>
            <span>•</span>
            <span>USAJOBS REST API</span>
          </div>

          <div>
            <a
              href="https://github.com/Itsmeaadeesh/Roast-My-Resume"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#1A1A1A] dark:text-[#F0EDE5] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors editorial-hover"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>SOURCE / GITHUB</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Shareable Roast Card Export Modal */}
      {roastResult && (
        <RoastCardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          roast={roastResult}
          marketData={marketData}
        />
      )}
    </div>
  );
}
