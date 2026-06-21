import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { allBlogPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("blog_title") };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts: BlogPost[] = isSanityConfigured ? await client.fetch(allBlogPostsQuery) : [];
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-16">
        <div className="section-container">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
            {t("title")} <span className="text-[var(--color-accent-light)]">{t("title_accent")}</span>
          </h1>
          <p className="text-blue-200 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="section-container py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                id={`blog-list-${post.slug.current}`}
                className="card overflow-hidden block group"
              >
                <div className="relative h-44 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={urlFor(post.coverImage).width(600).height(300).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl">📝</div>
                  )}
                </div>
                <div className="p-5">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-heading font-bold text-[var(--color-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-4">{post.summary}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--color-muted-light)]">
                    <span>{formatDate(post.publishedAt, locale)}</span>
                    {post.readingTime && <span>{post.readingTime} {t("min_read")}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-[var(--color-muted)] text-lg">{t("no_posts")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
