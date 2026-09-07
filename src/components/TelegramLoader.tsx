import React, { useEffect, useState } from "react";

const TELEGRAPH_STAGES = [
  "ESTABLISHING WIRE CONNECTION TO SENIOR RECRUITER DESK...",
  "READING CANDIDATE DOSSIER AND DISSECTING CLAIMS...",
  "CROSS-EXAMINING BUZZWORDS AGAINST INDUSTRY REALITY INDEX...",
  "QUERYING USAJOBS FEDERAL REPOSITORY FOR LIVE ROLE LIQUIDITY...",
  "TABULATING APPLICANT-TO-OPENING RATIOS & SALARY SPREADS...",
  "FORMULATING SAVAGE VERDICT, SECTION SCORES & REDEMPTION PLAN...",
];

export const TelegramLoader: React.FC = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    const fullText = TELEGRAPH_STAGES[currentLineIndex];
    setDisplayText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayText(fullText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);

        // Move to next message after a brief pause
        const timeout = setTimeout(() => {
          setCurrentLineIndex((prev) => (prev + 1) % TELEGRAPH_STAGES.length);
        }, 1200);

        return () => clearTimeout(timeout);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [currentLineIndex]);

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-6 sm:p-8 bg-[#FAF8F5] dark:bg-[#191816] border border-[#1A1A1A] dark:border-[#EDEAE4] transition-colors">
      {/* Telegraph Header */}
      <div className="border-b border-[#1A1A1A] dark:border-[#EDEAE4] pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#B91C1C] dark:bg-[#EF4444] animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F0EDE5]">
            CONFIDENTIAL TELEGRAM WIRE
          </span>
        </div>
        <div className="text-[#8C8477] dark:text-[#7A756D] uppercase text-[11px]">
          REF: REC-DISPATCH // TRANSCRIPT LIVE
        </div>
      </div>

      {/* Telegram Message Box */}
      <div className="min-h-[140px] flex flex-col justify-center">
        <div className="text-[11px] font-mono text-[#8C8477] dark:text-[#7A756D] mb-2 uppercase tracking-wider">
          STATUS MONITOR [STAGE 0{currentLineIndex + 1}/06]:
        </div>
        <p className="font-mono text-sm sm:text-base text-[#1A1A1A] dark:text-[#F0EDE5] leading-relaxed tracking-wide">
          <span className="text-[#B91C1C] dark:text-[#EF4444] font-bold">&gt;&gt; </span>
          {displayText}
          <span className="inline-block w-2.5 h-4 ml-1 bg-[#1A1A1A] dark:bg-[#F0EDE5] align-middle animate-blink" />
        </p>
      </div>

      {/* Telegram Footer Rule */}
      <div className="mt-6 pt-3 border-t border-[#D8D2C7] dark:border-[#2E2D2A] flex justify-between items-center text-[10px] font-mono text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider">
        <span>PLEASE HOLD. HONESTY CANNOT BE RUSHED.</span>
        <span>STOP • TRANSMISSION IN PROGRESS • STOP</span>
      </div>
    </div>
  );
};
