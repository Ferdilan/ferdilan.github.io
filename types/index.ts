import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  category: "networking" | "software" | "iot" | "ai";
  summary: string;
  description?: unknown[];
  coverImage?: SanityImageSource;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  publishedAt?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  coverImage?: SanityImageSource;
  tags?: string[];
  body?: unknown[];
  publishedAt: string;
  readingTime?: number;
}

export interface Certificate {
  _id: string;
  title: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: SanityImageSource;
  category?: string;
}

export interface Experience {
  _id: string;
  type: "education" | "work" | "organization";
  title: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  gpa?: string;
}

export type Locale = "id" | "en";
