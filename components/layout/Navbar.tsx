"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "nav.home", id: "home" },
  { href: "/#about", label: "nav.about", id: "about" },
  { href: "/#skills", label: "nav.skills", id: "skills" },
  { href: "/#projects", label: "nav.projects", id: "projects" },
  { href: "/blog", label: "nav.blog", id: "blog" },
  { href: "/#contact", label: "nav.contact", id: "contact" },
] as const;

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === "id" ? "en" : "id" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[var(--color-border)]"
          : "bg-transparent"
      )}
      style={{ boxShadow: scrolled ? "var(--shadow-nav)" : "none" }}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="flex items-center gap-2 font-heading font-bold text-lg text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
          >
            <span className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center text-white text-sm font-bold">
              FR
            </span>
            <span className="hidden sm:block">Ferdilan</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, id }) => (
              <li key={id}>
                <a
                  href={href}
                  id={`nav-${id}`}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  {t(label)}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              id="lang-toggle"
              onClick={toggleLocale}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              aria-label={`Switch to ${locale === "id" ? "English" : "Bahasa Indonesia"}`}
            >
              <span className="text-base">{locale === "id" ? "🇬🇧" : "🇮🇩"}</span>
              {t("nav.language")}
            </button>

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "w-5 h-0.5 bg-[var(--color-primary)] transition-all duration-300",
                  mobileOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-[var(--color-primary)] transition-all duration-300",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-[var(--color-primary)] transition-all duration-300",
                  mobileOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-white border-t border-[var(--color-border)] overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96 py-4" : "max-h-0"
        )}
      >
        <div className="section-container flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, id }) => (
            <a
              key={id}
              href={href}
              id={`nav-mobile-${id}`}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-all"
            >
              {t(label)}
            </a>
          ))}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-all mt-2 border-t border-[var(--color-border)]"
          >
            <span>{locale === "id" ? "🇬🇧" : "🇮🇩"}</span>
            {locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
          </button>
        </div>
      </div>
    </header>
  );
}
