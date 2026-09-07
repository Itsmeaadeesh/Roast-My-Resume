import React, { useState } from "react";
import { RedemptionItem } from "@/types";
import { CheckSquare, Square, Wrench } from "lucide-react";

interface RedemptionArcProps {
  items: RedemptionItem[];
}

export const RedemptionArc: React.FC<RedemptionArcProps> = ({ items }) => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <section className="my-10 p-6 sm:p-8 bg-[#FAF8F5] dark:bg-[#181715] border border-[#1A1A1A] dark:border-[#EDEAE4] transition-colors">
      <div className="border-b border-[#1A1A1A] dark:border-[#EDEAE4] pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-[#B91C1C] dark:text-[#EF4444]" />
          <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-[#1A1A1A] dark:text-[#F0EDE5] tracking-tight">
            The Redemption Arc
          </h3>
        </div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#5C5855] dark:text-[#9E9A93]">
          ACTIONS COMPLETED: {completedCount} OF {items.length}
        </div>
      </div>

      <p className="text-xs sm:text-sm font-serif text-[#5C5855] dark:text-[#9E9A93] mb-6">
        Three mandatory surgical revisions to restore your credibility before applying to competitive tech organizations:
      </p>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const isDone = Boolean(completed[item.id]);

          return (
            <div
              key={item.id || idx}
              onClick={() => toggleItem(item.id || String(idx))}
              className={`p-4 border transition-colors cursor-pointer flex items-start gap-3.5 ${
                isDone
                  ? "bg-[#EFEAE1] dark:bg-[#1F1E1C] border-[#A39D93] dark:border-[#383530] text-[#5C5855] dark:text-[#7A756D]"
                  : "bg-white dark:bg-[#141413] border-[#D8D2C7] dark:border-[#2E2D2A] hover:border-[#1A1A1A] dark:hover:border-[#EDEAE4] text-[#1A1A1A] dark:text-[#F0EDE5]"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-[#1A1A1A] dark:text-[#F0EDE5] shrink-0 cursor-pointer"
                aria-label={isDone ? "Mark incomplete" : "Mark complete"}
              >
                {isDone ? (
                  <CheckSquare size={18} className="text-[#B91C1C] dark:text-[#EF4444]" />
                ) : (
                  <Square size={18} className="text-[#8C8477] dark:text-[#7A756D]" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-[#B91C1C] dark:text-[#EF4444]">
                    REVISION 0{idx + 1}:
                  </span>
                  <h4
                    className={`text-sm sm:text-base font-serif font-bold ${
                      isDone ? "line-through text-[#8C8477] dark:text-[#6E6B65]" : "text-[#1A1A1A] dark:text-[#F0EDE5]"
                    }`}
                  >
                    {item.headline}
                  </h4>
                </div>
                <p
                  className={`text-xs sm:text-sm font-serif leading-relaxed ${
                    isDone ? "line-through text-[#8C8477] dark:text-[#6E6B65]" : "text-[#5C5855] dark:text-[#9E9A93]"
                  }`}
                >
                  {item.concreteAction}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[#D8D2C7] dark:border-[#2E2D2A] flex justify-between items-center text-[11px] font-mono text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider">
        <span>COMMIT TO GIT &bull; RE-EXPORT TO PDF &bull; APPLY WITH EVIDENCE</span>
        <span>STATUS: {completedCount === items.length ? "READY FOR ATS" : "IN REVIEW"}</span>
      </div>
    </section>
  );
};
