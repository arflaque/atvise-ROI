# Vester Business — ROI Intelligence Platform

A premium dark-themed SaaS-style ROI calculator for industrial projects. Built with React + Vite + TypeScript + Tailwind, deployable as a static site to GitHub Pages.

## Features

- **4-tab navigation**: Context (educates) · Modules (configure) · Results (visualize) · Executive Report (export)
- **6 ROI driver modules**: Downtime · Energy · Maintenance · Production · Quality · Digitalization
- **Dual theme**: Premium Dark (default) ↔ Corporate Yellow — switchable at runtime
- **i18n**: ES · EN · PT · FR
- **URL-shareable state**: send a configured calculation via link
- **PDF export** of executive report
- **Recharts** for donut, waterfall, bar and timeline visualizations

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create repo on GitHub (e.g. `vester-roi-platform`).
2. Edit `vite.config.ts` → set `REPO_BASE` to `'/<your-repo-name>/'` (or `'/'` if using a custom domain with CNAME).
3. Push to `main`. GitHub Action in `.github/workflows/deploy.yml` builds and deploys automatically.
4. In repo Settings → Pages → Source = "GitHub Actions".

## Project structure

```
src/
├── components/
│   ├── layout/    # AppLayout, TopNav, SideRail, Footer
│   ├── ui/        # Card, Button, KPICard, Tooltip, etc.
│   ├── tabs/      # ContextTab, ModulesTab, ResultsTab, ReportTab
│   ├── modules/   # ModuleCard variants
│   ├── charts/    # Recharts wrappers
│   ├── results/   # KPIRow, ExecutiveSummary, ROIStory
│   └── report/    # ExecutiveReport, PDFExport
├── lib/           # modules catalog, calculations, scenarios, i18n
├── locales/       # es / en / pt / fr translations
├── hooks/         # useROIState, useURLState, useTheme, useI18n
├── styles/        # globals.css with theme tokens
└── types.ts       # domain types
```

## Theming

Both themes share the same component tree — only CSS variables change. Toggle via `<html data-theme="dark|corporate">` (handled by `useTheme` hook). All colors flow through Tailwind's `bg-bg-*`, `text-*`, `border-*`, `accent`, `positive`, `warning`, `negative` utilities.
