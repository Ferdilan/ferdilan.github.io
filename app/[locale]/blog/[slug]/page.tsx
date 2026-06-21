import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { blogPostBySlugQuery, allBlogPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return [];
  const posts: BlogPost[] = await client.fetch(allBlogPostsQuery);
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogPost | null = await client.fetch(blogPostBySlugQuery, { slug });
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post: BlogPost | null = await client.fetch(blogPostBySlugQuery, { slug });
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] overflow-hidden">
        {post.coverImage && (
          <Image
            src={urlFor(post.coverImage).width(1400).height(600).url()}
            alt={post.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-8">
            <Link
              href="/blog"
              id="blog-back"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("back")}
            </Link>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[var(--color-muted-light)] mb-8 pb-6 border-b border-[var(--color-border)]">
            <span>{formatDate(post.publishedAt, locale)}</span>
            {post.readingTime && (
              <span>• {post.readingTime} {t("min_read")}</span>
            )}
          </div>

          {/* Summary */}
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
            {post.summary}
          </p>

          {/* Body Content */}
          {post.body && (
            <div className="prose-content">
              {/* PortableText renderer can be added here with @portabletext/react */}
              <p className="text-[var(--color-muted)]">
                {locale === "id"
                  ? "Konten artikel tersedia di Sanity CMS."
                  : "Full article content available in Sanity CMS."}
              </p>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
            <Link href="/blog" className="btn-outline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("back")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
