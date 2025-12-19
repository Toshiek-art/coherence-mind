import type { PortableTextBlock } from '@portabletext/types';

export type ImageAsset = {
  url?: string;
  alt?: string;
};

export type NavigationLink = {
  _id: string;
  label: string;
  href: string;
  order: number;
};

export type SiteSettings = {
  title: string;
  description?: string;
  logo?: ImageAsset;
};

export type PageSection = {
  title: string;
  summary?: string;
  body?: PortableTextBlock[];
};

export type StaticPage = {
  _id?: string;
  slug?: string;
  title: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroDisclaimer?: string;
  scopeEpistemicStatus?: PortableTextBlock[];
  body?: PortableTextBlock[];
  sections?: PageSection[];
};

export type RelatedConcept = {
  term?: string;
  slug?: string;
  title?: string;
  name?: string;
};

export type Concept = {
  _id: string;
  term: string;
  slug: string;
  title?: string;
  name?: string;
  label?: string;
  shortDefinition?: string;
  summary?: string;
  definition?: string;
  whatItIs?: string;
  whatIsText?: string;
  what_is?: string;
  whatItIsNot?: string;
  whatNotText?: string;
  what_is_not?: string;
  fullDefinition?: PortableTextBlock[];
  relatedConcepts?: RelatedConcept[];
};

export type Faq = {
  _id: string;
  question: string;
  slug: string;
  answer?: PortableTextBlock[];
  category?: string;
};

export type FaqGroup = {
  category: string;
  items: Faq[];
};

export type TimelineEvent = {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  year?: number;
  dateFormatted?: string;
  summary?: string;
  body?: PortableTextBlock[];
};

export type Paper = {
  _id: string;
  title: string;
  slug: string;
  abstract?: string;
  link?: string;
  fileUrl?: string;
  year?: number;
  tags?: string[];
};

export type Note = {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  body?: PortableTextBlock[];
  tags?: string[];
};

export type Author = {
  _id: string;
  name: string;
  slug: string;
  bio?: PortableTextBlock[];
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  author?: Author;
};

export type BlogPostSummary = Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'tags' | 'publishedAt'>;

export type HomepagePayload = {
  hero?: {
    _id?: string;
    slug?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroDisclaimer?: string;
    scopeEpistemicStatus?: PortableTextBlock[];
  };
  latestPosts?: BlogPostSummary[];
  notes?: Note[];
};
