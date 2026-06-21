import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";

interface BlogProps {
  posts: BlogPost[];
  locale: string;
}

export default function Blog({ posts, locale }: BlogProps) {
  const t = useTranslations("blog");

  return (
    <section id="blog" className="section-padding bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-title">
            {t("title")} <span className="section-title-accent">{t("title_accent")}</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, idx) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  id={`blog-card-${post.slug.current}`}
                  className={`card overflow-hidden block group ${idx === 0 ? "md:col-span-1" : ""}`}
                >
                  {/* Cover */}
                  <div className="relative h-44 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={urlFor(post.coverImage).width(600).height(300).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                        📝
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-heading font-bold text-[var(--color-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-4">
                      {post.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--color-muted-light)]">
                      <span>{formatDate(post.publishedAt, locale)}</span>
                      {post.readingTime && (
                        <span>{post.readingTime} {t("min_read")}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog" id="blog-view-all" className="btn-outline">
                {t("view_all")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-[var(--color-muted)] text-lg">{t("no_posts")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
