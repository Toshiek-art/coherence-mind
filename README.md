# Reflexive Coherence Model — Web Architecture

Astro + Sanity implementation for presenting the Reflexive Coherence Model (RCM). The site delivers structured institutional pages, research timelines, glossary entries, FAQ, papers, notes, and a blog while staying accessible, performant, and GDPR-respectful.

## Stack & Decisions
- **Astro 5 + TypeScript** with static output by default, enabling pre-rendered institutional content.
- **Tailwind CSS** for consistent, high-contrast theming and manageable spacing/typography tokens.
- **Sanity v4 Studio** powering structured content via GROQ queried at build time (SSR optional later).
- **Portable Text renderer** for rich text sections, isolated in `src/components/RichTextRenderer.tsx`.
- **SEO & GDPR ready** with `Seo.astro`, sitemap/robots, privacy + imprint placeholders, and an inactive cookie banner ready for optional analytics.

## Project Structure
```
/
├─ public/
│  └─ robots.txt, favicon.svg
├─ src/
│  ├─ components/ (layout primitives, cards, SEO, etc.)
│  ├─ layouts/ (BaseLayout with header/footer/skip link)
│  ├─ lib/ (Sanity client, GROQ queries, shared types)
│  ├─ pages/ (index, model, glossary, faq, timeline, papers, notes, blog, privacy, imprint)
│  └─ styles/global.css
├─ sanity/
│  ├─ sanity.config.ts
│  └─ schemaTypes/ (document schemas: modelPage, concept, faq, timeline, paper, note, blogPost…)
├─ package.json
└─ tailwind.config.cjs / postcss.config.cjs
```

## Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables**
   - Copy `.env.example` → `.env` and set `SANITY_PROJECT_ID`, `SANITY_DATASET`, optional `SANITY_API_READ_TOKEN` (if the dataset is private or draft content is required at build time).
   - For Studio, copy `sanity/.env.example` (or reuse the root values) and set `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`.
3. **Run Astro**
   ```bash
   npm run dev
   ```
4. **Run Sanity Studio**
   ```bash
   cd sanity
   npm install # first time only
   npm run dev
   ```

## Commands
| Command | Description |
| --- | --- |
| `npm run dev` | Astro dev server (localhost:4321) with hot reload |
| `npm run build` | Type-check + build static output to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run sanity` | Convenience script → `sanity dev` in `/sanity` |
| `npm run check` | Astro type/syntax checks |

## Sanity Studio
Document schemas live in `sanity/schemaTypes`. Key types:
- `siteSettings`, `navigation` for global layout metadata.
- `modelPage`, `concept`, `faq`, `timelineEvent`, `paper`, `note`, `blogPost`, `author`.
- Extend schemas as needed; keep GROQ queries in `src/lib/sanityQueries.ts` synchronized with the types defined in `src/lib/types.ts`.

## Accessibility, SEO, GDPR
- Semantically structured pages with ordered headings, `<nav>`, `<main>`, `<footer>`, and visible focus states.
- `Seo.astro` centralizes meta tags, canonical URLs, and OG/Twitter data; `@astrojs/sitemap` + `public/robots.txt` cover basic discoverability.
- No non-essential cookies or trackers are enabled by default. `CookieBanner.astro` contains the hook for a future consent manager should analytics or embeds be introduced.
- Privacy + imprint pages ship as placeholders ready for legal copy; update them before launch with controller details, lawful bases, and contact info.

## Deployment
`npm run build` outputs a static `dist/` folder compatible with Netlify, Vercel, Cloudflare Pages, and similar static hosts. Ensure host-level environment variables match `.env` when fetching Sanity content during build.
