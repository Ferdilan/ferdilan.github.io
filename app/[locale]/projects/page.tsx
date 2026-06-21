import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { allProjectsQuery } from "@/sanity/lib/queries";
import ProjectsClient from "@/components/ProjectsClient";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("projects_title") };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = isSanityConfigured ? await client.fetch(allProjectsQuery) : [];
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-16">
        <div className="section-container">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
            {t("title")} <span className="text-[var(--color-accent-light)]">{t("title_accent")}</span>
          </h1>
          <p className="text-blue-200 text-lg">{t("subtitle")}</p>
        </div>
      </div>
      <ProjectsClient projects={projects} locale={locale} />
    </div>
  );
}
