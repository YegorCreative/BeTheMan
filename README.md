# Be The Man Challenge

Production-ready foundation for a premium challenge-driven web app focused on discipline, habit consistency, and measurable self-improvement.

## Project Overview

This repository contains the initial architecture and design system layer for the app. It intentionally excludes homepage feature build-out so product modules can be developed on top of a clean, scalable base.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS (custom theme tokens)
- Framer Motion (motion primitives)
- ESLint (Next.js flat config)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open http://localhost:3000

## Development Commands

- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## Folder Structure

```text
app/                    # App Router layout + entry points
components/
  ui/                   # Reusable design system primitives
  layout/               # Layout-specific components
  challenge/            # Challenge-domain components
  dashboard/            # Dashboard-domain components
  journal/              # Journal-domain components
lib/                    # Shared utilities
data/                   # Typed mock data modules
hooks/                  # Shared hooks
types/                  # Domain and shared TypeScript types
styles/                 # Global tokens and theming
docs/                   # Product and architecture documentation
public/
  images/               # Static image assets
  icons/                # Static icon assets
```

## Deployment

GitHub Pages static export is supported.

This repository deploys to GitHub Pages through the single workflow at `.github/workflows/deploy.yml`.

1. Push changes to `main`.
2. In GitHub repository settings, set Pages source to `GitHub Actions`.
3. Let the `Deploy to GitHub Pages` workflow build and publish the generated `out/` directory.

The app is configured to export static files, use the `/BeTheMan` base path in production, and include a `.nojekyll` marker so GitHub Pages serves the `_next` assets correctly.

## App Concept

Be The Man Challenge helps users execute daily actions across fitness, mindset, discipline, career, and leadership. The product direction emphasizes visible momentum, challenge progression, and high-accountability routines.