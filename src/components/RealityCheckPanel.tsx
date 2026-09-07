import React from "react";
import { MarketData } from "@/types";
import { TrendingUp, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

interface RealityCheckPanelProps {
  marketData: MarketData | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const RealityCheckPanel: React.FC<RealityCheckPanelProps> = ({
  marketData,
  isLoading,
  onRefresh,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  return (
    <section className="my-10 border border-[#1A1A1A] bg-[#FAF8F5]">
      {/* Ticker Terminal Header */}
      <div className="bg-[#1A1A1A] text-[#F7F5F0] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-[#B91C1C]" />
          <span className="font-bold uppercase tracking-wider">
            JOB MARKET REALITY CHECK // USAJOBS LIQUIDITY INDEX
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#A39D93]">
          <span>SOURCE: DATA.USAJOBS.GOV</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="text-[#F7F5F0] hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer"
              title="Refresh market data"
            >
              <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} />
              <span>SYNC</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {isLoading ? (
          <div className="py-8 text-center font-mono text-xs text-[#5C5855]">
            <RefreshCw size={18} className="animate-spin mx-auto mb-3 text-[#B91C1C]" />
            <div className="uppercase tracking-wider">
              POLLING FEDERAL JOB CLEARINGHOUSE...
            </div>
          </div>
        ) : !marketData || marketData.insufficientData ? (
          /* Graceful Insufficient Data State */
          <div className="py-4">
            <div className="p-4 border-l-2 border-[#B91C1C] bg-[#FAF0F0] text-xs font-mono mb-4 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-[#B91C1C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#B91C1C] uppercase tracking-wider block mb-1">
                  INSUFFICIENT MARKET DATA // SPECIALIZED SEARCH QUERY
                </span>
                <p className="text-[#1A1A1A] font-serif leading-relaxed">
                  {marketData?.statusNote ||
                    `No active direct vacancies matched the exact title "${marketData?.roleQueried || "your role"}". Federal hiring taxonomies may classify this position under general series like IT Specialist (APPSW) or Computer Science.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center font-mono">
              <div className="p-3 border border-[#D8D2C7] bg-white">
                <div className="text-[10px] text-[#8C8477] uppercase tracking-wider">
                  ROLE SCARCITY
                </div>
                <div className="text-lg font-bold text-[#B91C1C] mt-1">HIGH (NICHE)</div>
              </div>
              <div className="p-3 border border-[#D8D2C7] bg-white">
                <div className="text-[10px] text-[#8C8477] uppercase tracking-wider">
                  EST. MARKET SPREAD
                </div>
                <div className="text-lg font-bold text-[#1A1A1A] mt-1">$115k – $185k</div>
              </div>
              <div className="p-3 border border-[#D8D2C7] bg-white">
                <div className="text-[10px] text-[#8C8477] uppercase tracking-wider">
                  ACTION PLAN
                </div>
                <div className="text-xs font-semibold text-[#5C5855] mt-1">
                  Standardize Job Title for ATS
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Stock Ticker Stat Blocks */
          <div>
            <div className="mb-4 text-xs font-mono text-[#5C5855] flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D2C7] pb-3">
              <div>
                BENCHMARKED ROLE:{" "}
                <span className="font-bold text-[#1A1A1A] uppercase">
                  {marketData.roleQueried}
                </span>
              </div>
              <div className="text-[11px] text-[#8C8477]">
                SAMPLE DATA: DIRECT OPENINGS ACROSS US AGENCIES
              </div>
            </div>

            {/* Financial Terminal Stat Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Stat 1: Open Roles */}
              <div className="p-4 bg-white border border-[#D8D2C7]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8477] mb-1">
                  OPEN VACANCIES
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#1A1A1A] tracking-tight">
                  {formatNumber(marketData.totalOpenings)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#5C5855]">
                  Active federal postings
                </div>
              </div>

              {/* Stat 2: Estimated Competition */}
              <div className="p-4 bg-white border border-[#D8D2C7]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8477] mb-1">
                  EST. COMPETITION
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#B91C1C] tracking-tight">
                  {marketData.competitionLevel}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#5C5855] truncate">
                  {marketData.competitionRatioText}
                </div>
              </div>

              {/* Stat 3: Salary Range */}
              <div className="p-4 bg-white border border-[#D8D2C7]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8477] mb-1">
                  SALARY RANGE
                </div>
                <div className="text-lg sm:text-xl font-mono font-bold text-[#1A1A1A] tracking-tight truncate">
                  {formatCurrency(marketData.salaryMin)} – {formatCurrency(marketData.salaryMax)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#5C5855]">
                  Median: {formatCurrency(marketData.salaryMedian)} / yr
                </div>
              </div>
            </div>

            {/* Verified Postings Drawer */}
            {marketData.sampleListings.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#D8D2C7]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] font-bold mb-3 flex items-center justify-between">
                  <span>SAMPLE VERIFIED LISTINGS</span>
                  <span className="text-[10px] text-[#8C8477] font-normal">
                    CROSS-REFERENCED VIA USAJOBS API
                  </span>
                </div>

                <div className="divide-y divide-[#E8E2D7] border border-[#D8D2C7] bg-white">
                  {marketData.sampleListings.map((job, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:bg-[#FAF8F5] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#1A1A1A] truncate">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-[#5C5855] truncate">
                          {job.agency} &bull; {job.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-[#1A1A1A] font-semibold">
                          {job.salaryMin > 0 ? formatCurrency(job.salaryMin) : "Competitive"}
                        </span>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 border border-[#D8D2C7] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F7F5F0] text-[10px] text-[#1A1A1A] flex items-center gap-1 transition-colors"
                        >
                          <span>VIEW</span>
                          <ExternalLink size={9} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Ticker Footer */}
      <div className="border-t border-[#1A1A1A] px-4 py-2 bg-[#EFEAE1] flex justify-between items-center text-[10px] font-mono text-[#5C5855] uppercase tracking-wider">
        <span>FEDERAL METRICS BENCHMARK // NO COMMERCIAL ESTIMATES</span>
        <span>STATUS: LIVE FEED</span>
      </div>
    </section>
  );
};
