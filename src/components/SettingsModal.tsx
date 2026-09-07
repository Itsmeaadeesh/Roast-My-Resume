import React, { useState, useEffect } from "react";
import { X, Key, Check, ShieldAlert, ExternalLink } from "lucide-react";
import { AppSettings } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}) => {
  const [geminiKey, setGeminiKey] = useState(initialSettings.geminiKey);
  const [usajobsKey, setUsajobsKey] = useState(initialSettings.usajobsKey);
  const [usajobsEmail, setUsajobsEmail] = useState(initialSettings.usajobsEmail);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setGeminiKey(initialSettings.geminiKey);
    setUsajobsKey(initialSettings.usajobsKey);
    setUsajobsEmail(initialSettings.usajobsEmail);
  }, [initialSettings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      geminiKey: geminiKey.trim(),
      usajobsKey: usajobsKey.trim(),
      usajobsEmail: usajobsEmail.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]">
      <div className="w-full max-w-lg bg-[#F7F5F0] border-2 border-[#1A1A1A] p-6 shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-[#B91C1C]" />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
              TERMINAL CONFIGURATION // API KEYS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#5C5855] hover:text-[#1A1A1A] p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs font-serif text-[#5C5855] mb-5 leading-relaxed">
          By default, the server uses environment variables (<code className="font-mono text-[11px] bg-[#EFEAE1] px-1 py-0.5">GEMINI_API_KEY</code>, <code className="font-mono text-[11px] bg-[#EFEAE1] px-1 py-0.5">USAJOBS_API_KEY</code>). If deploying privately or testing custom quotas, you can enter your keys here. Keys remain strictly in your browser session.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Gemini API Key */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="gemini-key" className="font-bold uppercase text-[#1A1A1A]">
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#B91C1C] hover:underline flex items-center gap-0.5"
              >
                Get Free Key <ExternalLink size={10} />
              </a>
            </div>
            <input
              id="gemini-key"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-white border border-[#D8D2C7] focus:border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] focus:outline-none"
            />
          </div>

          {/* USAJOBS Authorization Key */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="usajobs-key" className="font-bold uppercase text-[#1A1A1A]">
                USAJOBS Authorization Key
              </label>
              <a
                href="https://developer.usajobs.gov/APIRequest/Index"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#B91C1C] hover:underline flex items-center gap-0.5"
              >
                Free Registration <ExternalLink size={10} />
              </a>
            </div>
            <input
              id="usajobs-key"
              type="password"
              value={usajobsKey}
              onChange={(e) => setUsajobsKey(e.target.value)}
              placeholder="API Key from developer.usajobs.gov"
              className="w-full px-3 py-2 bg-white border border-[#D8D2C7] focus:border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] focus:outline-none"
            />
          </div>

          {/* USAJOBS Email (User-Agent) */}
          <div>
            <label htmlFor="usajobs-email" className="block font-bold uppercase text-[#1A1A1A] mb-1">
              USAJOBS Registered Email (User-Agent header)
            </label>
            <input
              id="usajobs-email"
              type="email"
              value={usajobsEmail}
              onChange={(e) => setUsajobsEmail(e.target.value)}
              placeholder="youremail@example.com"
              className="w-full px-3 py-2 bg-white border border-[#D8D2C7] focus:border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#D8D2C7] flex items-center justify-between">
            <span className="text-[10px] text-[#8C8477] uppercase flex items-center gap-1">
              <ShieldAlert size={12} /> Stored in localStorage only
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-[#D8D2C7] hover:border-[#1A1A1A] text-[11px] uppercase tracking-wider text-[#5C5855] hover:text-[#1A1A1A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1A1A1A] text-[#F7F5F0] hover:bg-[#B91C1C] text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check size={12} /> SAVED
                  </>
                ) : (
                  "SAVE CONFIG"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
