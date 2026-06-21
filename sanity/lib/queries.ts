import { groq } from "next-sanity";

// ─── Projects ────────────────────────────────────────────────────────────────

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    category,
    summary,
    coverImage,
    technologies,
    liveUrl,
    githubUrl,
    publishedAt
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    summary,
    coverImage,
    technologies,
    liveUrl,
    githubUrl,
    featured,
    publishedAt
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    summary,
    description,
    coverImage,
    technologies,
    liveUrl,
    githubUrl,
    publishedAt
  }
`;

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const recentBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    summary,
    coverImage,
    tags,
    publishedAt,
    readingTime
  }
`;

export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    summary,
    coverImage,
    tags,
    publishedAt,
    readingTime
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    summary,
    coverImage,
    tags,
    body,
    publishedAt,
    readingTime
  }
`;

// ─── Certificates ─────────────────────────────────────────────────────────────

export const certificatesQuery = groq`
  *[_type == "certificate"] | order(issuedAt desc) {
    _id,
    title,
    issuedBy,
    issuedAt,
    expiresAt,
    credentialId,
    credentialUrl,
    image,
    category
  }
`;

// ─── Experience / Education ───────────────────────────────────────────────────

export const experiencesQuery = groq`
  *[_type == "experience"] | order(order asc, startDate desc) {
    _id,
    type,
    title,
    institution,
    location,
    startDate,
    endDate,
    current,
    description,
    gpa
  }
`;
