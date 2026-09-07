import React, { useEffect, useState } from "react";
import { Quote } from "lucide-react";

interface VerdictPullQuoteProps {
  verdict: string;
  classifiedNotice: string;
}

export const VerdictPullQuote: React.FC<VerdictPullQuoteProps> = ({
  verdict,
  classifiedNotice,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDoneTyping, setIsDoneTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    setIsDoneTyping(false);

    const timer = setInterval(() => {
      if (i < verdict.length) {
        setDisplayedText(verdict.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsDoneTyping(true);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [verdict]);

  return (
    <section className="my-8 py-6 px-6 sm:px-8 bg-[#FAF8F5] border-l-4 border-[#B91C1C] border-y border-r border-[#D8D2C7] relative">
      {/* Top tag */}
      <div className="flex items-center justify-between gap-4 border-b border-[#D8D2C7] pb-3 mb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#B91C1C] font-bold flex items-center gap-1.5">
          <Quote size={13} />
          THE VERDICT // EDITORIAL OPINION
        </span>
        <span className="text-[10px] font-mono text-[#8C8477] uppercase tracking-wider">
          CLASSIFICATION: {classifiedNotice}
        </span>
      </div>

      {/* Pull Quote Typography */}
      <blockquote
        onClick={() => {
          if (!isDoneTyping) {
            setDisplayedText(verdict);
            setIsDoneTyping(true);
          }
        }}
        className="cursor-pointer select-text"
        title={!isDoneTyping ? "Click to display immediately" : undefined}
      >
        <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[#1A1A1A] leading-snug tracking-tight">
          &ldquo;{displayedText}&rdquo;
          {!isDoneTyping && (
            <span className="inline-block w-2.5 h-6 ml-1 bg-[#B91C1C] align-middle animate-blink" />
          )}
        </p>
      </blockquote>

      {/* Pull Quote Attributed Footnote */}
      <div className="mt-4 pt-3 border-t border-[#E8E2D7] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#5C5855] gap-1">
        <span>— Senior Talent Partner & Technical Hiring Bar-Raiser</span>
        {!isDoneTyping && (
          <span className="text-[10px] text-[#8C8477] italic">
            [Typewriter teletype rendering... click text to reveal in full]
          </span>
        )}
      </div>
    </section>
  );
};
