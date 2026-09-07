import React, { useRef, useEffect, useState } from "react";
import { X, Download, Copy, Check, Share2, Sparkles } from "lucide-react";
import { RoastResult, MarketData } from "@/types";

interface RoastCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  roast: RoastResult;
  marketData: MarketData | null;
}

export const RoastCardModal: React.FC<RoastCardModalProps> = ({
  isOpen,
  onClose,
  roast,
  marketData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"story" | "post">("story"); // story: 1080x1350, post: 1200x675
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions
    const width = aspectRatio === "story" ? 1080 : 1200;
    const height = aspectRatio === "story" ? 1350 : 675;

    canvas.width = width;
    canvas.height = height;

    // Background: Newsprint Warm Paper
    ctx.fillStyle = "#F7F5F0";
    ctx.fillRect(0, 0, width, height);

    // Outer double border
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = "#A39D93";
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 38, width - 76, height - 76);

    // Helper to wrap text
    const wrapText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ): number => {
      const words = text.split(" ");
      let line = "";
      let currentY = y;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + " ";
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY;
    };

    if (aspectRatio === "story") {
      // 1080 x 1350 VERTICAL INSTAGRAM / LINKEDIN PORTRAIT LAYOUT

      // Masthead Top Bar
      ctx.fillStyle = "#5C5855";
      ctx.font = "bold 18px monospace";
      ctx.fillText(`VOL. XCIV • NO. 48,102`, 60, 80);
      ctx.textAlign = "right";
      ctx.fillText(`DOSSIER #${roast.dossierId}`, width - 60, 80);
      ctx.textAlign = "left";

      // Divider
      ctx.strokeStyle = "#1A1A1A";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 100);
      ctx.lineTo(width - 60, 100);
      ctx.stroke();

      // Masthead Title
      ctx.fillStyle = "#B91C1C";
      ctx.font = "bold 20px monospace";
      ctx.fillText("CONFIDENTIAL RECRUITER AUDIT", 60, 140);

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "900 64px Georgia, serif";
      ctx.fillText("ROAST MY RÉSUMÉ", 60, 205);

      // Inferred Role Header Strip
      ctx.fillStyle = "#EFEAE1";
      ctx.fillRect(60, 235, width - 120, 70);
      ctx.strokeStyle = "#D8D2C7";
      ctx.lineWidth = 1;
      ctx.strokeRect(60, 235, width - 120, 70);

      ctx.fillStyle = "#5C5855";
      ctx.font = "bold 16px monospace";
      ctx.fillText("INFERRED PROFILE:", 85, 265);

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "bold 24px Georgia, serif";
      ctx.fillText(`${roast.candidateRole} (${roast.experienceLevel})`, 85, 292);

      // Severity Stamp on the Right
      ctx.fillStyle = "#B91C1C";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${roast.severityLabel} [${roast.severityScore}/100]`, width - 85, 278);
      ctx.textAlign = "left";

      // Big Pull-Quote Box for The Verdict
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(60, 335, width - 120, 360);
      ctx.strokeStyle = "#B91C1C";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(60, 335);
      ctx.lineTo(60, 695);
      ctx.stroke();

      ctx.strokeStyle = "#D8D2C7";
      ctx.lineWidth = 1;
      ctx.strokeRect(66, 335, width - 126, 360);

      ctx.fillStyle = "#B91C1C";
      ctx.font = "bold 18px monospace";
      ctx.fillText("THE VERDICT // PULL QUOTE", 95, 375);

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "italic 32px Georgia, serif";
      wrapText(`“${roast.verdict}”`, 95, 430, width - 190, 46);

      // Section Score Cards Grid
      ctx.fillStyle = "#1A1A1A";
      ctx.font = "900 24px Georgia, serif";
      ctx.fillText("SECTION AUDIT SCORES", 60, 745);

      const sectionList = [
        { label: "EXECUTIVE SUMMARY", score: roast.breakdown.summary.score },
        { label: "WORK EXPERIENCE", score: roast.breakdown.experience.score },
        { label: "TECH SKILLS", score: roast.breakdown.skills.score },
        { label: "ATS FORMATTING", score: roast.breakdown.formatting.score },
      ];

      const boxWidth = (width - 120 - 45) / 4;
      sectionList.forEach((s, idx) => {
        const boxX = 60 + idx * (boxWidth + 15);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(boxX, 770, boxWidth, 110);
        ctx.strokeStyle = "#D8D2C7";
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, 770, boxWidth, 110);

        ctx.fillStyle = "#5C5855";
        ctx.font = "bold 13px monospace";
        ctx.fillText(s.label, boxX + 15, 800);

        ctx.fillStyle = "#1A1A1A";
        ctx.font = "900 36px monospace";
        ctx.fillText(s.score, boxX + 15, 850);
      });

      // USAJOBS Reality Check Ticker Strip
      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(60, 915, width - 120, 110);

      ctx.fillStyle = "#B91C1C";
      ctx.font = "bold 16px monospace";
      ctx.fillText("USAJOBS GOV REALITY CHECK // LIQUIDITY INDEX", 85, 948);

      ctx.fillStyle = "#F7F5F0";
      ctx.font = "bold 20px monospace";
      if (marketData && !marketData.insufficientData) {
        ctx.fillText(
          `OPEN ROLES: ${marketData.totalOpenings.toLocaleString()}  •  COMPETITION: ${
            marketData.competitionLevel
          }  •  MEDIAN: $${(marketData.salaryMedian / 1000).toFixed(0)}k/yr`,
          85,
          990
        );
      } else {
        ctx.fillText(
          `FEDERAL OPENINGS: AUDIT ACTIVE  •  COMPETITION: EXTREME  •  NICHE PROFILE`,
          85,
          990
        );
      }

      // Red Ink Watermark Stamp in Corner
      ctx.save();
      ctx.translate(width - 230, 1130);
      ctx.rotate((-12 * Math.PI) / 180);
      ctx.strokeStyle = "rgba(185, 28, 28, 0.75)";
      ctx.lineWidth = 4;
      ctx.strokeRect(-20, -35, 240, 70);
      ctx.fillStyle = "rgba(185, 28, 28, 0.85)";
      ctx.font = "900 24px monospace";
      ctx.fillText("REJECTED BY ATS", 0, 5);
      ctx.restore();

      // Editorial Footer Strip
      ctx.fillStyle = "#5C5855";
      ctx.font = "bold 16px monospace";
      ctx.fillText("PUBLISHED VIA ROAST MY RÉSUMÉ • POWERED BY GEMINI & USAJOBS", 60, 1260);

      ctx.textAlign = "right";
      ctx.fillText("github.com/Itsmeaadeesh/Roast-My-Resume", width - 60, 1260);
      ctx.textAlign = "left";
    } else {
      // 1200 x 675 LANDSCAPE LINKEDIN / TWITTER BANNER
      ctx.fillStyle = "#5C5855";
      ctx.font = "bold 16px monospace";
      ctx.fillText("CONFIDENTIAL RECRUITER DOSSIER", 60, 75);
      ctx.textAlign = "right";
      ctx.fillText(`SEVERITY: ${roast.severityLabel} [${roast.severityScore}/100]`, width - 60, 75);
      ctx.textAlign = "left";

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "900 48px Georgia, serif";
      ctx.fillText("ROAST MY RÉSUMÉ", 60, 135);

      // Verdict Pull Quote
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(60, 165, width - 120, 240);
      ctx.strokeStyle = "#B91C1C";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, 165);
      ctx.lineTo(60, 405);
      ctx.stroke();

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "italic 26px Georgia, serif";
      wrapText(`“${roast.verdict}”`, 90, 220, width - 180, 38);

      // Bottom Bar
      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(60, 435, width - 120, 150);

      ctx.fillStyle = "#B91C1C";
      ctx.font = "bold 16px monospace";
      ctx.fillText(`INFERRED ROLE: ${roast.candidateRole.toUpperCase()} (${roast.experienceLevel})`, 85, 475);

      ctx.fillStyle = "#F7F5F0";
      ctx.font = "bold 18px monospace";
      ctx.fillText(
        `SUMMARY: ${roast.breakdown.summary.score}  •  EXPERIENCE: ${roast.breakdown.experience.score}  •  SKILLS: ${roast.breakdown.skills.score}  •  ATS: ${roast.breakdown.formatting.score}`,
        85,
        520
      );

      ctx.fillStyle = "#A39D93";
      ctx.font = "14px monospace";
      ctx.fillText("ROASTMYRESUME.COM • GEMINI 2.5 • USAJOBS INDEX", 85, 555);
    }

    setImageLoaded(true);
  }, [isOpen, aspectRatio, roast, marketData]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `Roast-Card-${roast.dossierId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } catch (err) {
      console.warn("Clipboard copy failed, fallback to download:", err);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px] overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#F7F5F0] border-2 border-[#1A1A1A] p-6 shadow-none my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-[#B91C1C]" />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
              EDITORIAL ROAST CARD // SOCIAL EXPORT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#5C5855] hover:text-[#1A1A1A] p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-xs font-mono">
          <span className="text-[#8C8477] uppercase text-[11px]">FORMAT:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAspectRatio("story")}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                aspectRatio === "story"
                  ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]"
                  : "bg-white text-[#1A1A1A] border-[#D8D2C7] hover:border-[#1A1A1A]"
              }`}
            >
              PORTRAIT (4:5 / STORIES & LINKEDIN)
            </button>
            <button
              onClick={() => setAspectRatio("post")}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                aspectRatio === "post"
                  ? "bg-[#1A1A1A] text-[#F7F5F0] border-[#1A1A1A]"
                  : "bg-white text-[#1A1A1A] border-[#D8D2C7] hover:border-[#1A1A1A]"
              }`}
            >
              LANDSCAPE (16:9 / FEED BANNER)
            </button>
          </div>
        </div>

        {/* Canvas Display Viewport */}
        <div className="border border-[#1A1A1A] bg-[#EFEAE1] p-2 flex justify-center max-h-[55vh] overflow-auto">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto shadow-sm border border-[#D8D2C7]"
            style={{ maxHeight: "50vh" }}
          />
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-4 border-t border-[#D8D2C7] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <span className="text-[11px] text-[#8C8477] uppercase flex items-center gap-1">
            <Sparkles size={12} className="text-[#B91C1C]" />
            READY TO SHARE TO LINKEDIN, X, OR INSTAGRAM
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[#B91C1C]" />
                  <span>COPIED IMAGE!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>COPY IMAGE</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-[#F7F5F0] transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider text-[11px]"
            >
              <Download size={14} />
              <span>DOWNLOAD PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
