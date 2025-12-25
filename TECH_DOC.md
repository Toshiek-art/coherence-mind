# Coherence Mind Portal · Technical Reference

This document condenses the moving parts of the Reflexive Coherence Model web portal so new contributors can understand the stack, data flow, and operational workflows in one place.

## 1. Stack & Deployment Model
- **Astro 5 + TypeScript** (static output) for the public site under `src/`. Astro fetches Sanity data at build time via GROQ, so content updates require rebuilding unless incremental hooks are added later.
- **Tailwind CSS** drives the design system (class-based dark mode, custom palette/tokens) with global utilities in `src/styles/global.css` and `tailwind.config.cjs`.
- **Sanity v4 Studio** lives in `/sanity`, defining structured content (concepts, notes, papers, etc.). Editors work in Studio; the Astro site consumes the published dataset.
- **Portable Text** rendering is encapsulated in `src/components/RichTextRenderer.tsx`, ensuring consistent typography and link rules.
- **Deployment target**: any static host (Vercel/Netlify/Cloudflare). `npm run build` emits `dist/` which already contains sitemap/robots and the generated pages.
- **Canonical domain**: `https://www.coherencemind.net` is set via `astro.config.mjs#site` and used everywhere canonical URLs or robots/sitemap links need a fallback.

## 2. Repository Layout
```
/
├─ public/               Static assets (favicon, robots, downloadable PDFs under /papers).
├─ src/
│  ├─ components/        UI primitives (Header, Footer, PageTitle, Seo, CookieBanner, etc.).
│  ├─ layouts/           BaseLayout wires SEO, header/footer, theme bootstrap, cookie banner.
│  ├─ lib/               Sanity client + GROQ queries + shared types.
│  ├─ pages/             Astro routes (index, model, glossary, faq, timeline, papers, notes, blog, imprint, privacy).
│  └─ styles/            Tailwind entry + utility classes.
├─ sanity/               Standalone Sanity Studio (config + schemas + its own package.json).
├─ astro.config.mjs      Astro project config (integrations, sitemap, etc.).
├─ tailwind.config.cjs   Theme tokens and Tailwind setup.
├─ tsconfig.json         App TS config (paths/types).
├─ package.json          Scripts + deps for the Astro app.
└─ WORKLOG.md            Running change log.
```

## 3. Local Development
1. **Install**: `npm install` (root) and `npm install` inside `/sanity` the first time.
2. **Env vars**: copy `.env.example` → `.env`, set `SANITY_PROJECT_ID`, `SANITY_DATASET`, optional `SANITY_API_READ_TOKEN` (only needed for private datasets or draft previews). Studio reads `SANITY_STUDIO_*` equivalents but falls back to the root vars.
3. **Run Astro**: `npm run dev` → http://localhost:4321
4. **Run Sanity Studio**: `npm run sanity` (or `cd sanity && npm run dev`) → http://localhost:3333
5. **Quality gate**: `npm run check` runs `astro check` (TS + Astro diagnostics). Currently only the known `ThemeToggle` hint surfaces.

## 4. Build & Deploy
- `npm run build` executes `astro check` then `astro build`, producing `/dist` with static HTML, CSS, JS, sitemap, robots, PDF copies, etc.
- `npm run preview` serves that build locally.
- CI/CD should inject the same Sanity env vars available locally. Because data is fetched during build, publishing new Sanity content requires triggering another site build unless ISR/webhooks are added later.

## 5. Frontend Architecture
### 5.1 Base Layout & Chrome
- `BaseLayout.astro` imports global CSS, fetches navigation/siteSettings via `getNavigation` + `getSiteSettings`, renders `<Seo>`, header, footer, skip link, and `<CookieBanner>`.
- Theme bootstrap script reads `localStorage['cm-theme']` (defaulting to the OS preference) and now understands three modes: light, dark, and the high-contrast “Accessibility+” profile. The toggle in `Header` cycles through these options while keeping multiple instances (desktop/mobile) in sync.
- `PageTitle.astro` standardizes hero/eyebrow/intro blocks across pages.

### 5.2 Data Layer
- `src/lib/sanityClient.ts` (not shown above) instantiates the Sanity client using env vars.
- `src/lib/sanityQueries.ts` exports typed GROQ helpers (site settings, nav, homepage payload, static pages, glossary, FAQ, timeline, papers, notes, blog posts). `safeFetch` guards against missing env vars or runtime failures.
- `src/lib/types.ts` mirrors the GROQ results so pages/components stay typed.

### 5.3 Pages & Routing
- **Static routes**: `index.astro`, `model.astro`, `glossary.astro`, `faq.astro`, `timeline.astro`, `papers.astro`, `notes.astro`, `blog/index.astro`, `privacy.astro`, `imprint.astro`, `accessibility.astro` (site statement + contact).
- **Dynamic (SSG) routes**: `notes/[slug].astro` and `blog/[slug].astro` (pattern identical—`getStaticPaths` pulls slugs via GROQ, each page fetches specific content, returns 404 when missing). Add new dynamic sections following this template.
- **Sticky in-page TOCs**: homepage, model, imprint, and privacy share the same pattern (mobile chips + desktop sticky sidebar). When adding another long-form page, copy this structure for consistency.
- `papers.astro` mixes static metadata (primary preprint card) with Sanity-driven list placeholders; hook up `getPapers()` when structured paper documents are available.

### 5.4 Styling & UX
- Tailwind dark mode is class-based. Palette extensions (accent, accentMuted, ink, mist) plus `boxShadow.depth` live in `tailwind.config.cjs`.
- `src/styles/global.css` applies high-level typography, link transitions, and `.btn-*` helpers.
- Component-specific styles stay inline via Tailwind classes.
- Accessibility: skip link, semantic headings, focus states, `sr-only` handles, `scroll-mt-*` on anchor targets, `aria` from components (e.g., navs, lists) keep page navigation keyboard-friendly.
- Cookie banner currently renders an informational block; actual consent logic is pending but the component is in place.

## 6. Sanity Studio
### 6.1 Running & Deploying
- Studio config (`sanity/sanity.config.ts`) auto-detects `projectId`/`dataset` from env, defaulting to `fuxytwjv/production`.
- Plugins: desk structure + Vision. Deploy via `cd sanity && npm run deploy` if you need the hosted Studio.

### 6.2 Schemas (`sanity/schemaTypes`)
| Schema | Purpose | Key fields |
| --- | --- | --- |
| `siteSettings` | Global title/description (SEO fallback, footer). | `title`, `description` |
| `navigation` | Header links (label, href, order). | `label`, `href`, `order` |
| `homepage` | Hero text + optional scope disclaimer. | `heroTitle`, `heroSubtitle`, `heroDisclaimer`, `scopeEpistemicStatus` |
| `staticPage` | Generic CMS-backed pages (currently used for `/model`). | `slug`, hero fields, `body`, `sections[]`, `scopeEpistemicStatus` |
| `concept` | Glossary entries (see `/glossary`). | `term`, `slug`, `shortDefinition`, `fullDefinition`, `relatedConcepts[]` |
| `faq` | FAQ entries grouped client-side by category. | `question`, `answer`, `category`, `slug` |
| `timelineEvent` | Chronological milestones. | `title`, `date`, `summary`, `body`, `slug` |
| `paper` | Structured paper/preprint references. | `title`, `slug`, `abstract`, `link`, `file`, `year`, `tags` |
| `note` | Lab notes (list view + detail route). | `title`, `slug`, `createdAt`, `tags`, `body` |
| `blogPost` | Long-form posts (list + `[slug]`). | `title`, `slug`, `excerpt`, `body`, `publishedAt`, `tags`, `author` |
| `author` | Blog/notes authorship metadata. | `name`, `slug`, `bio` |

Maintain GROQ queries (`src/lib/sanityQueries.ts`) whenever schema fields change. Add new schema modules under `sanity/schemaTypes/` and append them to `schemaTypes` in `index.ts`.

### 6.3 Content → Frontend Mapping
- **Homepage**: pulls `homepage.hero*`, top 3 `blogPost` entries, top 3 `note` entries, and renders the ecosystem card grid linking to Glossary, Timeline, Lab Notes, and Papers.
- **Model**: `staticPage` with slug `model` supplies hero copy + `scopeEpistemicStatus` (rendered near the bottom) + optional `body/sections` for CMS-managed content.
- **Glossary**: `concept` documents sorted alphabetically render term cards with definitions and related concept chips.
- **FAQ**: `faq` entries grouped by `category` in `getFaqByCategory()`.
- **Timeline**: `timelineEvent` array with date-sorted entries.
- **Notes & Blog**: list pages use `getNotes()` / `getBlogPosts()`; detail routes use `getNotesBySlug()` / `getBlogPostBySlug()` with Portable Text rendering.
- **Papers**: ready for `getPapers()` integration; currently the hero card uses static metadata while waiting for structured data.

## 7. Adding or Updating Features
- **New navigation item**: create/update a `navigation` document in Sanity; `Header` renders them ordered by the `order` field.
- **New CMS-backed page**: add a `staticPage` entry, create `src/pages/<slug>.astro` (or dynamic route) calling `getStaticPageBySlug('<slug>')`. Reuse `PageTitle`, `RichTextRenderer`, and sticky nav pattern if the page is long.
- **New schema**: create `<schema>.ts` in `sanity/schemaTypes`, export fields via `defineType`, register it in `schemaTypes/index.ts`, then add the required GROQ query + types + page/component usage.
- **Glossary/FAQ/Timeline updates**: purely content-driven—publish new documents in Studio, rebuild Astro to see them live (unless you switch to SSR).
- **PDF or asset updates**: drop new files under `public/papers/` (or other relevant folder) so Astro copies them verbatim to `dist`.

## 8. Testing & QA
- Use `npm run check` for type + Astro template validation.
- Manual QA checklist before deploy:
  1. `npm run build && npm run preview`.
  2. Visit `/`, `/model`, `/glossary`, `/timeline`, `/notes`, `/notes/<slug>`, `/blog`, `/blog/<slug>`, `/papers`, `/imprint`, `/privacy`.
  3. Toggle dark mode, ensure sticky menus (home/model/imprint/privacy) highlight anchors and “Back to top” works.
  4. Verify downloadable assets (PDFs) resolve under `/papers/` and robots/sitemap exist in `dist`.

## 9. Operational Notes / Open Questions
- **Analytics**: Currently none. `CookieBanner` is informational—add consent + tracking scripts when needed.
- **Draft previews**: Not implemented. For real-time previews you’d enable Astro SSR or add preview routes hitting the Sanity CDNs with draft tokens.
- **Incremental updates**: Builds must be retriggered after Sanity publishes. Consider Netlify/Vercel webhooks if editors need faster turnaround.
- **Localization**: Single-language (EN) today. Multi-language support would require locale fields in Sanity and routing changes.

This living doc should be updated whenever you add routes, schemas, or deployment steps so future collaborators can ramp up in minutes.
