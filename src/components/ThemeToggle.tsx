"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("roast_theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("roast_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <div className="w-16 h-5 border border-dashed border-[#D8D2C7] opacity-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-1.5 px-2 py-0.5 border border-[#D8D2C7] dark:border-[#383530] hover:border-[#B91C1C] dark:hover:border-[#B91C1C] text-[10px] font-mono tracking-wider text-[#1A1A1A] dark:text-[#F0EDE5] hover:text-[#B91C1C] dark:hover:text-[#B91C1C] transition-colors cursor-pointer"
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Edition`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <Moon size={11} className="text-[#5C5855]" />
          <span>NIGHT ED.</span>
        </>
      ) : (
        <>
          <Sun size={11} className="text-[#E5E1D8]" />
          <span>DAY ED.</span>
        </>
      )}
    </button>
  );
};
