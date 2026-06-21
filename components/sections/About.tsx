import { useTranslations } from "next-intl";
import type { Experience } from "@/types";
import { formatDateShort } from "@/lib/utils";

interface AboutProps {
  experiences: Experience[];
  locale: string;
}

export default function About({ experiences, locale }: AboutProps) {
  const t = useTranslations("about");

  const education = experiences.filter((e) => e.type === "education");
  const work = experiences.filter(
    (e) => e.type === "work" || e.type === "organization"
  );

  return (
    <section id="about" className="section-padding bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-title">
            {t("title")} <span className="section-title-accent">{t("title_accent")}</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div>
            <div className="mb-8">
              {/* Profile Visual */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-3xl font-bold font-heading mb-6">
                FR
              </div>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                {t("bio_1")}
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                {t("bio_2")}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { value: "3+", label: locale === "id" ? "Tahun Studi" : "Years of Study" },
                { value: "10+", label: locale === "id" ? "Proyek Selesai" : "Projects Completed" },
                { value: "4+", label: locale === "id" ? "Bidang Keahlian" : "Areas of Expertise" },
                { value: "5+", label: locale === "id" ? "Sertifikasi" : "Certifications" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="card p-4 text-center"
                >
                  <p className="text-2xl font-bold font-heading text-[var(--color-accent)]">{value}</p>
                  <p className="text-sm text-[var(--color-muted)] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-heading font-bold text-xl text-[var(--color-primary)] mb-6">
              {t("timeline_title")}
            </h3>

            {education.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-4">
                  {t("education")}
                </h4>
                <TimelineItems items={education} locale={locale} />
              </div>
            )}

            {work.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-4">
                  {t("experience")}
                </h4>
                <TimelineItems items={work} locale={locale} />
              </div>
            )}

            {experiences.length === 0 && (
              <div className="space-y-4">
                {/* Placeholder timeline items */}
                {[
                  { title: "Telekomunikasi — S1", institution: "Universitas / Institut", period: "2021 — Sekarang", current: true },
                  { title: "Network Intern", institution: "PT Telkom Indonesia", period: "2023", current: false },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 mt-1 flex-shrink-0 ${item.current ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "bg-white border-[var(--color-muted-light)]"}`} />
                      <div className="w-px flex-1 bg-[var(--color-border)] mt-1" />
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-[var(--color-primary)]">{item.title}</p>
                      <p className="text-sm text-[var(--color-muted)]">{item.institution}</p>
                      <p className="text-xs text-[var(--color-muted-light)] mt-1">{item.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItems({ items, locale }: { items: Experience[]; locale: string }) {
  return (
    <div className="space-y-1">
      {items.map((item, idx) => (
        <div key={item._id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 mt-1 flex-shrink-0 ${item.current ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "bg-white border-[var(--color-muted-light)]"}`} />
            {idx < items.length - 1 && (
              <div className="w-px flex-1 bg-[var(--color-border)] mt-1" />
            )}
          </div>
          <div className="pb-5">
            <div className="flex items-start gap-2 flex-wrap">
              <p className="font-semibold text-[var(--color-primary)]">{item.title}</p>
              {item.current && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                  {locale === "id" ? "Aktif" : "Current"}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-muted)]">{item.institution}</p>
            {item.gpa && (
              <p className="text-xs text-[var(--color-accent)] font-medium">GPA: {item.gpa}</p>
            )}
            <p className="text-xs text-[var(--color-muted-light)] mt-1">
              {formatDateShort(item.startDate, locale)} —{" "}
              {item.current
                ? locale === "id" ? "Sekarang" : "Present"
                : item.endDate
                  ? formatDateShort(item.endDate, locale)
                  : ""}
            </p>
            {item.description && (
              <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
