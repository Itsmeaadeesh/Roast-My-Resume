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
    <section className="my-10 border border-[#1A1A1A] dark:border-[#EDEAE4] bg-[#FAF8F5] dark:bg-[#181715] transition-colors">
      {/* Ticker Terminal Header */}
      <div className="bg-[#1A1A1A] dark:bg-[#201F1D] text-[#F7F5F0] dark:text-[#F0EDE5] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-[#B91C1C] dark:text-[#EF4444]" />
          <span className="font-bold uppercase tracking-wider">
            JOB MARKET REALITY CHECK // USAJOBS LIQUIDITY INDEX
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#A39D93] dark:text-[#7A756D]">
          <span>SOURCE: DATA.USAJOBS.GOV</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="text-[#F7F5F0] dark:text-[#F0EDE5] hover:text-[#B91C1C] dark:hover:text-[#EF4444] flex items-center gap-1 cursor-pointer"
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
          <div className="py-8 text-center font-mono text-xs text-[#5C5855] dark:text-[#9E9A93]">
            <RefreshCw size={18} className="animate-spin mx-auto mb-3 text-[#B91C1C] dark:text-[#EF4444]" />
            <div className="uppercase tracking-wider">
              POLLING FEDERAL JOB CLEARINGHOUSE...
            </div>
          </div>
        ) : !marketData || marketData.insufficientData ? (
          /* Graceful Insufficient Data State */
          <div className="py-4">
            <div className="p-4 border-l-2 border-[#B91C1C] dark:border-[#EF4444] bg-[#FAF0F0] dark:bg-[#221313] text-xs font-mono mb-4 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-[#B91C1C] dark:text-[#EF4444] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#B91C1C] dark:text-[#EF4444] uppercase tracking-wider block mb-1">
                  INSUFFICIENT MARKET DATA // SPECIALIZED SEARCH QUERY
                </span>
                <p className="text-[#1A1A1A] dark:text-[#F0EDE5] font-serif leading-relaxed">
                  {marketData?.statusNote ||
                    `No active direct vacancies matched the exact title "${marketData?.roleQueried || "your role"}". Federal hiring taxonomies may classify this position under general series like IT Specialist (APPSW) or Computer Science.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center font-mono">
              <div className="p-3 border border-[#D8D2C7] dark:border-[#2E2D2A] bg-white dark:bg-[#141413]">
                <div className="text-[10px] text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider">
                  ROLE SCARCITY
                </div>
                <div className="text-lg font-bold text-[#B91C1C] dark:text-[#EF4444] mt-1">HIGH (NICHE)</div>
              </div>
              <div className="p-3 border border-[#D8D2C7] dark:border-[#2E2D2A] bg-white dark:bg-[#141413]">
                <div className="text-[10px] text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider">
                  EST. MARKET SPREAD
                </div>
                <div className="text-lg font-bold text-[#1A1A1A] dark:text-[#F0EDE5] mt-1">$115k – $185k</div>
              </div>
              <div className="p-3 border border-[#D8D2C7] dark:border-[#2E2D2A] bg-white dark:bg-[#141413]">
                <div className="text-[10px] text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider">
                  ACTION PLAN
                </div>
                <div className="text-xs font-semibold text-[#5C5855] dark:text-[#9E9A93] mt-1">
                  Standardize Job Title for ATS
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Stock Ticker Stat Blocks */
          <div>
            <div className="mb-4 text-xs font-mono text-[#5C5855] dark:text-[#9E9A93] flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D2C7] dark:border-[#2E2D2A] pb-3">
              <div>
                BENCHMARKED ROLE:{" "}
                <span className="font-bold text-[#1A1A1A] dark:text-[#F0EDE5] uppercase">
                  {marketData.roleQueried}
                </span>
              </div>
              <div className="text-[11px] text-[#8C8477] dark:text-[#7A756D]">
                SAMPLE DATA: DIRECT OPENINGS ACROSS US AGENCIES
              </div>
            </div>

            {/* Financial Terminal Stat Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Stat 1: Open Roles */}
              <div className="p-4 bg-white dark:bg-[#141413] border border-[#D8D2C7] dark:border-[#2E2D2A]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8477] dark:text-[#7A756D] mb-1">
                  OPEN VACANCIES
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#1A1A1A] dark:text-[#F0EDE5] tracking-tight">
                  {formatNumber(marketData.totalOpenings)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#5C5855] dark:text-[#9E9A93]">
                  Active federal postings
                </div>
              </div>

              {/* Stat 2: Estimated Competition */}
              <div className="p-4 bg-white dark:bg-[#141413] border border-[#D8D2C7] dark:border-[#2E2D2A]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8477] dark:text-[#7A756D] mb-1">
                  EST. COMPETITION
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#B91C1C] dark:text-[#EF4444] tracking-tight">
                  {marketData.competitionLevel}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#5C5855] dark:text-[#9E9A93] truncate">
                  {marketData.competitionRatioText}
                </div>
              </div>

              {/* Stat 3: Salary Range */}
              <div className="p-4 bg-white dark:bg-[#141413] border border-[#D8D2C7] dark:border-[#2E2D2A]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8477] dark:text-[#7A756D] mb-1">
                  SALARY RANGE
                </div>
                <div className="text-lg sm:text-xl font-mono font-bold text-[#1A1A1A] dark:text-[#F0EDE5] tracking-tight truncate">
                  {formatCurrency(marketData.salaryMin)} – {formatCurrency(marketData.salaryMax)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#5C5855] dark:text-[#9E9A93]">
                  Median: {formatCurrency(marketData.salaryMedian)} / yr
                </div>
              </div>
            </div>

            {/* Verified Postings Drawer */}
            {marketData.sampleListings.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#D8D2C7] dark:border-[#2E2D2A]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0EDE5] font-bold mb-3 flex items-center justify-between">
                  <span>SAMPLE VERIFIED LISTINGS</span>
                  <span className="text-[10px] text-[#8C8477] dark:text-[#7A756D] font-normal">
                    CROSS-REFERENCED VIA USAJOBS API
                  </span>
                </div>

                <div className="divide-y divide-[#E8E2D7] dark:divide-[#262522] border border-[#D8D2C7] dark:border-[#2E2D2A] bg-white dark:bg-[#141413]">
                  {marketData.sampleListings.map((job, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:bg-[#FAF8F5] dark:hover:bg-[#1C1C1A] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#1A1A1A] dark:text-[#F0EDE5] truncate">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-[#5C5855] dark:text-[#9E9A93] truncate">
                          {job.agency} &bull; {job.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-[#1A1A1A] dark:text-[#F0EDE5] font-semibold">
                          {job.salaryMin > 0 ? formatCurrency(job.salaryMin) : "Competitive"}
                        </span>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 border border-[#D8D2C7] dark:border-[#2E2D2A] hover:border-[#1A1A1A] dark:hover:border-[#EDEAE4] hover:bg-[#1A1A1A] dark:hover:bg-[#EDEAE4] hover:text-[#F7F5F0] dark:hover:text-[#141413] text-[10px] text-[#1A1A1A] dark:text-[#F0EDE5] flex items-center gap-1 transition-colors"
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
      <div className="border-t border-[#1A1A1A] dark:border-[#EDEAE4] px-4 py-2 bg-[#EFEAE1] dark:bg-[#1E1D1B] flex justify-between items-center text-[10px] font-mono text-[#5C5855] dark:text-[#9E9A93] uppercase tracking-wider">
        <span>FEDERAL METRICS BENCHMARK // NO COMMERCIAL ESTIMATES</span>
        <span>STATUS: LIVE FEED</span>
      </div>
    </section>
  );
};
