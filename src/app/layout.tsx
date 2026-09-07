import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roast My Résumé — The Brutal Recruiter Dossier",
  description:
    "A savage-but-useful resume critique from an AI senior tech recruiter, backed by real job market data.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased selection:bg-[#B91C1C] selection:text-[#F7F5F0]`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F5F0] text-[#1A1A1A] font-serif">
        {children}
      </body>
    </html>
  );
}
