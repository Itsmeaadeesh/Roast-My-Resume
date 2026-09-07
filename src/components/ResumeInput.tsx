import React, { useState, useRef } from "react";
import { Upload, FileText, X, Sparkles, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { SAMPLE_RESUMES } from "@/data/sampleResumes";

interface ResumeInputProps {
  onSubmit: (resumeText: string, targetRole: string) => void;
  isLoading: boolean;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({ onSubmit, isLoading }) => {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const charCount = resumeText.length;

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to extract text from PDF");
        }

        setResumeText(data.text);
        setFileName(file.name);
      } else {
        // Text / Markdown file
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setResumeText(content);
          setFileName(file.name);
        };
        reader.onerror = () => {
          setUploadError("Could not read plain text file.");
        };
        reader.readAsText(file);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error processing file";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (index: number) => {
    const sample = SAMPLE_RESUMES[index];
    setResumeText(sample.text);
    setTargetRole(sample.role);
    setFileName(`Sample: ${sample.label}`);
    setUploadError(null);
  };

  const handleClear = () => {
    setResumeText("");
    setFileName(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || isLoading) return;
    onSubmit(resumeText.trim(), targetRole.trim());
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Editorial Headline */}
      <div className="mb-8 text-center sm:text-left border-b border-[#D8D2C7] dark:border-[#2E2D2A] pb-6 transition-colors">
        <div className="text-[11px] font-mono tracking-widest text-[#8C8477] dark:text-[#7A756D] uppercase mb-2 flex items-center gap-2">
          <span>SECTION 01</span>
          <span>•</span>
          <span>PRIMARY INTAKE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] dark:text-[#F0EDE5] leading-tight">
          Let’s See What You’re Working With.
        </h2>
        <p className="mt-3 text-sm sm:text-base font-serif text-[#5C5855] dark:text-[#9E9A93] leading-relaxed max-w-3xl">
          Paste your résumé plain text or drop a PDF. An AI senior tech recruiter will review it with zero diplomatic filters, dissect your claims, and contrast them with real-time federal hiring statistics.
        </p>

        {/* Sample Resume Quick Load */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[#8C8477] dark:text-[#7A756D] uppercase text-[10px] tracking-wider">Test Drive With Samples:</span>
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleSampleSelect(idx)}
              className="px-2.5 py-1 bg-[#EFEAE1] dark:bg-[#1C1C1A] hover:bg-[#1A1A1A] dark:hover:bg-[#F0EDE5] hover:text-[#F7F5F0] dark:hover:text-[#141413] border border-[#D8D2C7] dark:border-[#383530] text-[#1A1A1A] dark:text-[#F0EDE5] transition-colors cursor-pointer text-[11px]"
            >
              + {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag & Drop or Upload Strip */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed p-4 sm:p-5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDragging
              ? "border-[#B91C1C] dark:border-[#EF4444] bg-[#FAF5F0] dark:bg-[#201A18]"
              : "border-[#A39D93] dark:border-[#3E3B36] bg-[#FAF8F5] dark:bg-[#191816] hover:border-[#1A1A1A] dark:hover:border-[#EDEAE4]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.text"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#D8D2C7] dark:border-[#2E2D2A] bg-[#F7F5F0] dark:bg-[#141413] text-[#1A1A1A] dark:text-[#F0EDE5]">
              <Upload size={18} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0EDE5]">
                {fileName ? (
                  <span className="text-[#B91C1C] dark:text-[#EF4444] flex items-center gap-1.5">
                    <FileText size={13} /> {fileName}
                  </span>
                ) : (
                  "Drag & Drop Résumé (PDF or TXT)"
                )}
              </div>
              <div className="text-[11px] font-serif text-[#5C5855] dark:text-[#9E9A93]">
                {fileName
                  ? "File parsed. You can edit the extracted text below before roasting."
                  : "Or click to browse from your device. Clean text extraction only."}
              </div>
            </div>
          </div>

          {fileName && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-[11px] font-mono text-[#8C8477] dark:text-[#7A756D] hover:text-[#B91C1C] dark:hover:text-[#EF4444] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <X size={13} /> CLEAR FILE
            </button>
          )}
        </div>

        {uploadError && (
          <div className="p-3 border-l-2 border-[#B91C1C] dark:border-[#EF4444] bg-[#FAF0F0] dark:bg-[#2A1515] text-[#B91C1C] dark:text-[#EF4444] text-xs font-mono flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Minimalist Textarea Input with thin bottom border */}
        <div className="relative">
          <div className="flex justify-between items-end pb-2 border-b border-[#1A1A1A] dark:border-[#EDEAE4]">
            <label
              htmlFor="resume-text"
              className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0EDE5] font-bold"
            >
              Résumé Transcript / Text Copy
            </label>
            <div className="text-[11px] font-mono text-[#8C8477] dark:text-[#7A756D] flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          <textarea
            id="resume-text"
            rows={12}
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              if (fileName && !fileName.startsWith("Sample")) {
                setFileName(null);
              }
            }}
            placeholder="Paste your full résumé here (Summary, Work History, Core Competencies, Education, Projects)..."
            required
            className="w-full mt-2 p-3 sm:p-4 bg-transparent border-b border-[#D8D2C7] dark:border-[#2E2D2A] focus:border-[#1A1A1A] dark:focus:border-[#EDEAE4] font-mono text-base sm:text-sm text-[#1A1A1A] dark:text-[#F0EDE5] placeholder-[#A39D93] dark:placeholder-[#6E6B65] leading-relaxed resize-y focus:outline-none transition-colors"
          />
        </div>

        {/* Optional Target Role Specification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-b border-[#D8D2C7] dark:border-[#2E2D2A] pb-6 transition-colors">
          <div className="md:col-span-1">
            <label
              htmlFor="target-role"
              className="block text-xs font-mono uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0EDE5] font-semibold mb-1"
            >
              Target Role (Optional)
            </label>
            <p className="text-[11px] font-serif text-[#5C5855] dark:text-[#9E9A93] leading-snug">
              Leave blank to allow Gemini to infer your role, or specify a target position for targeted USAJOBS market benchmarking.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              id="target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer, Staff SRE, Product Manager"
              className="w-full px-3 py-3 sm:py-2.5 bg-transparent border border-[#D8D2C7] dark:border-[#2E2D2A] focus:border-[#1A1A1A] dark:focus:border-[#EDEAE4] font-mono text-base sm:text-xs text-[#1A1A1A] dark:text-[#F0EDE5] placeholder-[#A39D93] dark:placeholder-[#6E6B65] focus:outline-none min-h-[44px] transition-colors"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-[11px] font-mono text-[#8C8477] dark:text-[#7A756D] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#B91C1C] dark:bg-[#EF4444] inline-block" />
            <span>CONFIDENTIAL • NO RESUME DATA IS RETAINED</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {resumeText && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 border border-[#D8D2C7] dark:border-[#2E2D2A] hover:border-[#1A1A1A] dark:hover:border-[#EDEAE4] text-xs font-mono uppercase tracking-wider text-[#5C5855] dark:text-[#9E9A93] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE5] transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="submit"
              disabled={!resumeText.trim() || isLoading || isUploading}
              className={`w-full sm:w-auto px-6 py-3.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                !resumeText.trim() || isLoading || isUploading
                  ? "bg-[#D8D2C7] dark:bg-[#2E2D2A] text-[#8C8477] dark:text-[#6E6B65] cursor-not-allowed"
                  : "bg-[#1A1A1A] dark:bg-[#EDEAE4] text-[#F7F5F0] dark:text-[#141413] hover:bg-[#B91C1C] dark:hover:bg-[#EF4444] dark:hover:text-[#FFFFFF] active:translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>TRANSMITTING DOSSIER...</span>
                </>
              ) : (
                <>
                  <span>SUBMIT DOSSIER FOR ROAST</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
