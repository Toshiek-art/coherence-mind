import type { APIRoute } from "astro";
import { createClient } from "@sanity/client";

const site = "https://www.coherencemind.net";

const sanity = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  apiVersion: import.meta.env.SANITY_API_VERSION ?? "2024-01-01",
  useCdn: true,
});

const NOTES_QUERY = `*[_type == "note" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }`;
const BLOG_QUERY = `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }`;

type SlugRow = { slug: string; _updatedAt?: string };

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toUrlEntry(
  loc: string,
  lastmod?: string,
  changefreq?: string,
  priority?: number
) {
  const parts: string[] = [];
  parts.push("<url>");
  parts.push(`<loc>${xmlEscape(loc)}</loc>`);
  if (lastmod) parts.push(`<lastmod>${xmlEscape(new Date(lastmod).toISOString())}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${xmlEscape(changefreq)}</changefreq>`);
  if (typeof priority === "number") parts.push(`<priority>${priority.toFixed(2)}</priority>`);
  parts.push("</url>");
  return parts.join("");
}

export const GET: APIRoute = async () => {
  const staticUrls = [
    { path: "/", changefreq: "weekly", priority: 1.0 },
    { path: "/model", changefreq: "monthly", priority: 0.95 },
    { path: "/model/expansion-hypothesis", changefreq: "monthly", priority: 0.9 },
    { path: "/glossary", changefreq: "monthly", priority: 0.85 },
    { path: "/timeline", changefreq: "monthly", priority: 0.7 },
    { path: "/notes", changefreq: "weekly", priority: 0.8 },
    { path: "/blog", changefreq: "weekly", priority: 0.8 },
    { path: "/papers", changefreq: "monthly", priority: 0.85 },
    { path: "/faq", changefreq: "monthly", priority: 0.6 },
    { path: "/accessibility", changefreq: "yearly", priority: 0.5 },
    { path: "/imprint", changefreq: "yearly", priority: 0.5 },
    { path: "/privacy", changefreq: "yearly", priority: 0.5 },
  ];

  let notes: SlugRow[] = [];
  let posts: SlugRow[] = [];

  try {
    notes = await sanity.fetch(NOTES_QUERY);
  } catch (e) {
    console.error("Sanity notes fetch failed:", e);
  }

  try {
    posts = await sanity.fetch(BLOG_QUERY);
  } catch (e) {
    console.error("Sanity blog fetch failed:", e);
  }

  const urls: string[] = [];

  for (const u of staticUrls) {
    urls.push(toUrlEntry(`${site}${u.path}`, undefined, u.changefreq, u.priority));
  }

  for (const n of notes) {
    urls.push(
      toUrlEntry(
        `${site}/notes/${encodeURIComponent(n.slug)}`,
        n._updatedAt,
        "monthly",
        0.7
      )
    );
  }

  for (const p of posts) {
    urls.push(
      toUrlEntry(
        `${site}/blog/${encodeURIComponent(p.slug)}`,
        p._updatedAt,
        "monthly",
        0.65
      )
    );
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.join("") +
    `</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
