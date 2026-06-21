"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ContactProps {
  locale: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function Contact({ locale }: ContactProps) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  const SOCIAL = [
    { id: "contact-linkedin", href: "https://linkedin.com/in/ferdilanrama", label: "LinkedIn", color: "#0077B5" },
    { id: "contact-github", href: "https://github.com/ferdilan", label: "GitHub", color: "#181717" },
    { id: "contact-email", href: "mailto:ferdilanramadhani@gmail.com", label: "Email", color: "#EA4335" },
  ];

  return (
    <section id="contact" className="section-padding bg-[var(--color-surface)]">
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-title">
            {t("title")} <span className="section-title-accent">{t("title_accent")}</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — Social + Info */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <h3 className="font-heading font-bold text-[var(--color-primary)] mb-4">
                {t("social_title")}
              </h3>
              <div className="space-y-3">
                {SOCIAL.map(({ id, href, label }) => (
                  <a
                    key={id}
                    id={id}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-[var(--color-primary)] transition-all group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[var(--color-surface-dark)] flex items-center justify-center text-sm font-bold group-hover:bg-blue-50 transition-colors">
                      {label[0]}
                    </span>
                    <span className="font-medium text-sm">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
              <div className="text-2xl mb-3">💬</div>
              <p className="font-heading font-bold text-lg mb-2">
                {locale === "id" ? "Mari Berkolaborasi!" : "Let's Collaborate!"}
              </p>
              <p className="text-sm text-blue-200 leading-relaxed">
                {locale === "id"
                  ? "Terbuka untuk proyek, magang, dan diskusi teknis yang menarik."
                  : "Open to projects, internships, and interesting technical discussions."}
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 card p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--color-primary)] mb-1.5">
                  {t("name")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("placeholder_name")}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--color-primary)] mb-1.5">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("placeholder_email")}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-[var(--color-primary)] mb-1.5">
                {t("subject")} <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder={t("placeholder_subject")}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-[var(--color-primary)] mb-1.5">
                {t("message")} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                placeholder={t("placeholder_message")}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white resize-none"
              />
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("success")}
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("error")}
              </div>
            )}

            <button
              id="contact-submit"
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("sending")}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {t("send")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
