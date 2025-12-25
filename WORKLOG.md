# Worklog

## 2025-12-22
- Re-pointed the site’s canonical domain to `https://www.coherencemind.net` via `astro.config.mjs`, updated canonical fallbacks on blog/note detail pages, and regenerated `public/robots.txt` so sitemap URLs match the new host.
- Added the Lab Notes card to the homepage Ecosystem section to make `/notes` discoverable without relying on secondary CTAs.
- Refreshed TECH_DOC to capture the canonical-domain change plus the expanded homepage ecosystem grid.

## 2025-12-19
- Introduced a three-state theme system (light, dark, Accessibility+) with a synchronized toggle, global `theme-accessible` class handling, and high-contrast overrides in `src/styles/global.css`.
- Added `/accessibility` (Astro page using BaseLayout) to document EAA/WCAG commitments, limitations, and a dedicated contact channel.
- Raised color contrast across homepage elements (hero eyebrow, CTAs, cards, footer text, link accents) to satisfy Lighthouse/WCAG thresholds.
- Updated `tsconfig.json` to exclude `/sanity` from Astro’s type check so CI/CD doesn’t need Studio dependencies during site builds.
 
## 2025-12-13
- Added the sticky “On this page” navigation pattern (mobile chips + desktop sidebar) to both `/imprint` and `/privacy`, mirroring the home/model experience for consistent UX.
- Verified that `/papers` remains discoverable via the homepage ecosystem card (the only direct internal link) and noted other references just target PDF assets.
- Mirrored the sticky in-page navigation from `/model` onto the homepage (`src/pages/index.astro`), including the mobile chip nav and desktop sticky sidebar with “On this page” and a back-to-top link.
- Added centralized anchor definitions so every major homepage block (`#overview`, `#model`, `#structure`, `#ecosystem`, `#notes`, `#manifesto`, optional `#scope`) stays linked consistently.
- Ran `npm run check` to verify Astro diagnostics (still only hits the known `ThemeToggle` hint).

## 2025-12-12
- Removed DEV template metadata debug panels from `src/pages/index.astro` and `src/pages/model.astro` so production builds stay clean.
- Documented that `/model` is the route serving the model page content fetched via `getStaticPageBySlug('model')`.

## 2024-01-?? (session date unknown)
- Fixed Tailwind `@apply` circular dependency by removing the redundant `.sr-only { @apply sr-only; }` block in `src/styles/global.css`.
- Rebuilt `src/pages/index.astro` to match the Reflexive Coherence Model mockup with all required sections (hero, reveals, structural stack, ecosystem, notes, manifesto) and static content blocks.
- Introduced light/dark theme system:
  - Enabled Tailwind class-based dark mode and updated global body styles.
  - Added theme-prefetch script plus transition-friendly body classes in `BaseLayout`.
  - Created `ThemeToggle` component, wired it into `Header`, and ensured `Nav`/`Section` support both themes.
- Synced Sanity configuration with real project `fuxytwjv`:
  - Updated `.env`, `.env.example`, and `sanity/sanity.config.ts` defaults.
  - Noted that hero content comes from the `modelPage` document; other homepage text stays code-driven for now.
