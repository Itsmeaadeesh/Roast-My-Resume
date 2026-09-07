# Roast My Résumé

A savage-but-useful resume critique web application styled as a vintage editorial broadsheet and financial terminal, powered by **Gemini 2.5** and real-time job market data from **USAJOBS**.

## Features

- **Classic Editorial Design**: Warm newsprint cream palette (`#F7F5F0`), ink black text (`#1A1A1A`), deep editor-red accents (`#B91C1C`), and sharp 1px borders.
- **Typography**: Paired serif headline display (*Newsreader*) with clean monospace data tickers (*JetBrains Mono*).
- **Brutally Honest Senior Tech Recruiter**: High-signal, witty, and constructive resume roasts with pull-quote verdicts, section-by-section dissections, and actionable red-pen corrections.
- **Job Market Reality Check**: Live job listings, applicant competition metrics, and salary ranges powered by the official **USAJOBS API**.
- **Shareable Editorial Roast Card**: Canvas-rendered social cards styled like a classifieds dossier for viral sharing on LinkedIn and Instagram.
- **Zero-Storage Privacy**: Resumes are parsed in memory and never stored.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom editorial print design tokens
- **AI Engine**: Google Gemini API
- **Market Data**: USAJOBS API (`data.usajobs.gov`)
- **PDF Extraction**: `pdf-parse`
- **Deployment**: Vercel

## Getting Started

1. Clone repository:
   ```bash
   git clone https://github.com/Itsmeaadeesh/Roast-My-Resume.git
   cd Roast-My-Resume
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (`.env.local`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   USAJOBS_API_KEY=your_usajobs_api_key
   USAJOBS_EMAIL=your_email@domain.com
   ```

4. Run local dev server:
   ```bash
   npm run dev
   ```
