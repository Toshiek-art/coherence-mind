import groq from 'groq';
import type { QueryParams } from '@sanity/client';
import { sanityClient } from './sanityClient';
import type {
  BlogPost,
  BlogPostSummary,
  Concept,
  FaqGroup,
  HomepagePayload,
  StaticPage,
  NavigationLink,
  Note,
  Paper,
  SiteSettings,
  TimelineEvent
} from './types';

type QueryResult<T> = Promise<T | null>;

async function safeFetch<T>(query: string, params?: QueryParams): QueryResult<T> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params ?? {});
  } catch (error) {
    console.error('Sanity fetch failed', error);
    return null;
  }
}

export function getSiteSettings() {
  return safeFetch<SiteSettings>(groq`*[_type == "siteSettings"][0]{title, description}`);
}

export function getNavigation() {
  return safeFetch<NavigationLink[]>(
    groq`*[_type == "navigation"] | order(order asc){_id,label,href,order}`
  );
}

export function getHomepageData() {
  return safeFetch<HomepagePayload>(groq`{
    "hero": *[_type == "homepage"][0]{
      _id,
      "slug": slug.current,
      heroTitle,
      heroSubtitle,
      heroDisclaimer,
      scopeEpistemicStatus
    },
    "latestPosts": *[_type == "blogPost"] | order(publishedAt desc)[0..2]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      tags
    },
    "notes": *[_type == "note"] | order(createdAt desc)[0..2]{
      _id,
      title,
      "slug": slug.current,
      createdAt,
      tags
    }
  }`);
}

export function getStaticPageBySlug(slug: string) {
  return safeFetch<StaticPage>(
    groq`*[_type == "staticPage" && slug.current == $slug][0]{
      _id,
      "slug": slug.current,
      title,
      heroTitle,
      heroSubtitle,
      heroDisclaimer,
      scopeEpistemicStatus,
      body,
      sections[]{
        title,
        summary,
        body
      }
    }`,
    { slug }
  );
}

export function getGlossary() {
  return safeFetch<Concept[]>(
    groq`*[_type == "concept"] | order(term asc){
      _id,
      term,
      "slug": slug.current,
      shortDefinition,
      fullDefinition,
      "relatedConcepts": relatedConcepts[]-> { term, "slug": slug.current }
    }`
  );
}

export async function getFaqByCategory() {
  const data = await safeFetch<{ items: FaqGroup['items'][number][] }>(groq`{
    "items": *[_type == "faq"] | order(category asc){
      _id,
      question,
      "slug": slug.current,
      answer,
      category
    }
  }`);
  if (!data || !data.items?.length) return null;
  const grouped: Record<string, FaqGroup> = {};
  data.items.forEach((faq) => {
    const key = faq.category ?? 'General';
    if (!grouped[key]) grouped[key] = { category: key, items: [] };
    grouped[key].items.push(faq);
  });
  return Object.values(grouped);
}

export function getTimeline() {
  return safeFetch<TimelineEvent[]>(
    groq`*[_type == "timelineEvent"] | order(date asc){
      _id,
      title,
      "slug": slug.current,
      date,
      summary,
      body
    }`
  );
}

export function getPapers() {
  return safeFetch<Paper[]>(
    groq`*[_type == "paper"] | order(year desc){
      _id,
      title,
      "slug": slug.current,
      abstract,
      link,
      "fileUrl": file.asset->url,
      year,
      tags
    }`
  );
}

export function getNotes() {
  return safeFetch<Note[]>(
    groq`*[_type == "note"] | order(createdAt desc){
      _id,
      title,
      "slug": slug.current,
      createdAt,
      body,
      tags
    }`
  );
}

export function getBlogPosts() {
  return safeFetch<BlogPostSummary[]>(
    groq`*[_type == "blogPost"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      tags
    }`
  );
}

export function getBlogPostBySlug(slug: string) {
  return safeFetch<BlogPost>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      publishedAt,
      updatedAt,
      tags,
      author->{
        _id,
        name,
        "slug": slug.current,
        bio
      }
    }`,
    { slug }
  );
}

export function getNotesBySlug(slug: string) {
  return safeFetch<Note>(
    groq`*[_type == "note" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      createdAt,
      body,
      tags
    }`,
    { slug }
  );
}
