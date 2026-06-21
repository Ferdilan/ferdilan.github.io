import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Certificate } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";

interface CertificatesProps {
  certificates: Certificate[];
  locale: string;
}

export default function Certificates({ certificates, locale }: CertificatesProps) {
  const t = useTranslations("certificates");

  return (
    <section id="certificates" className="section-padding bg-[var(--color-surface)]">
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-title">
            {t("title")} <span className="section-title-accent">{t("title_accent")}</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="card p-5 flex gap-4 items-start group">
              {/* Icon / Image */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {cert.image ? (
                  <Image
                    src={urlFor(cert.image).width(56).height(56).url()}
                    alt={cert.title}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                ) : (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-[var(--color-primary)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  {t("issued_by")}: <span className="font-medium">{cert.issuedBy}</span>
                </p>
                <p className="text-xs text-[var(--color-muted-light)] mt-0.5">
                  {formatDate(cert.issuedAt, locale)}
                </p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`cert-link-${cert._id}`}
                    className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline mt-2 font-medium"
                  >
                    {locale === "id" ? "Verifikasi" : "Verify"}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
