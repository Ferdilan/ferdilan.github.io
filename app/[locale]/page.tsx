import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import {
  featuredProjectsQuery,
  recentBlogPostsQuery,
  certificatesQuery,
  experiencesQuery,
} from "@/sanity/lib/queries";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Only fetch from Sanity when credentials are available (skipped during local build)
  const [projects, blogPosts, certificates, experiences] = isSanityConfigured
    ? await Promise.all([
        client.fetch(featuredProjectsQuery),
        client.fetch(recentBlogPostsQuery),
        client.fetch(certificatesQuery),
        client.fetch(experiencesQuery),
      ])
    : [[], [], [], []];

  return (
    <>
      <Hero locale={locale} />
      <About experiences={experiences} locale={locale} />
      <Skills locale={locale} />
      <Projects projects={projects} locale={locale} />
      {certificates.length > 0 && (
        <Certificates certificates={certificates} locale={locale} />
      )}
      <Blog posts={blogPosts} locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
