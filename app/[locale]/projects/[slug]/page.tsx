import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { projectBySlugQuery, allProjectsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return [];
  const projects: Project[] = await client.fetch(allProjectsQuery);
  return projects.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug });
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project: Project | null = await client.fetch(projectBySlugQuery, { slug });
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });

  const categoryColors: Record<string, string> = {
    networking: "bg-blue-100 text-blue-700",
    software: "bg-indigo-100 text-indigo-700",
    iot: "bg-teal-100 text-teal-700",
    ai: "bg-violet-100 text-violet-700",
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] overflow-hidden">
        {project.coverImage && (
          <Image
            src={urlFor(project.coverImage).width(1400).height(600).url()}
            alt={project.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-8">
            <Link
              href="/projects"
              id="project-back"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("back")}
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[project.category] ?? "bg-gray-100 text-gray-700"}`}>
                {project.category.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">{project.summary}</p>

            {project.description && (
              <div className="prose-content">
                {/* For now just show summary; PortableText renderer can be added here */}
                <p className="text-[var(--color-muted)]">
                  {locale === "id" ? "Detail proyek tersedia di CMS." : "Project details available in CMS."}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="card p-5">
                <h3 className="font-heading font-bold text-[var(--color-primary)] mb-3 text-sm uppercase tracking-wide">
                  {t("technologies")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(project.liveUrl || project.githubUrl) && (
              <div className="card p-5 space-y-3">
                {project.liveUrl && (
                  <a
                    id="project-detail-live"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t("view_project")}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    id="project-detail-github"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full justify-center text-sm"
                  >
                    {t("source_code")}
                  </a>
                )}
              </div>
            )}

            {/* Date */}
            {project.publishedAt && (
              <div className="card p-5">
                <p className="text-xs text-[var(--color-muted-light)] uppercase tracking-wide mb-1">
                  {locale === "id" ? "Diterbitkan" : "Published"}
                </p>
                <p className="font-medium text-[var(--color-primary)]">
                  {formatDate(project.publishedAt, locale)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
