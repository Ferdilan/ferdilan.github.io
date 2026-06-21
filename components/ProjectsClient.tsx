"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types";
import { urlFor } from "@/sanity/lib/image";

const CATEGORY_KEYS = ["all", "networking", "software", "iot", "ai"] as const;

interface ProjectsClientProps {
  projects: Project[];
  locale: string;
}

export default function ProjectsClient({ projects, locale }: ProjectsClientProps) {
  const t = useTranslations("projects");
  const [active, setActive] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchCat = active === "all" || p.category === active;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies ?? []).some((tech) =>
        tech.toLowerCase().includes(search.toLowerCase())
      );
    return matchCat && matchSearch;
  });

  const categoryLabels: Record<string, string> = {
    all: t("all"),
    networking: t("networking"),
    software: t("software"),
    iot: t("iot"),
    ai: t("ai"),
  };

  const categoryColors: Record<string, string> = {
    networking: "bg-blue-100 text-blue-700",
    software: "bg-indigo-100 text-indigo-700",
    iot: "bg-teal-100 text-teal-700",
    ai: "bg-violet-100 text-violet-700",
  };

  return (
    <div className="section-container py-12">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-light)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="projects-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === "id" ? "Cari proyek atau teknologi..." : "Search projects or technologies..."}
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              id={`projects-filter-${cat}`}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === cat
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-muted)] mb-6">
        {filtered.length} {locale === "id" ? "proyek ditemukan" : "projects found"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div key={project._id} className="card overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] overflow-hidden">
                {project.coverImage ? (
                  <Image
                    src={urlFor(project.coverImage).width(600).height(400).url()}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 text-5xl font-bold font-heading">
                    {project.category === "networking" ? "🌐" : project.category === "software" ? "💻" : project.category === "iot" ? "🔌" : "🤖"}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[project.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {project.category.toUpperCase()}
                  </span>
                </div>
                {project.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      ⭐ Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading font-bold text-[var(--color-primary)] mb-2">{project.title}</h3>
                <p className="text-sm text-[var(--color-muted)] mb-4 line-clamp-2 flex-1">{project.summary}</p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="tag text-xs">{tech}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]">
                  <Link
                    href={`/projects/${project.slug.current}`}
                    id={`all-project-${project.slug.current}`}
                    className="flex-1 text-center py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {t("view_project")}
                  </Link>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="GitHub"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--color-muted)]">
          <div className="text-4xl mb-4">🔍</div>
          <p>{t("no_projects")}</p>
        </div>
      )}
    </div>
  );
}
