import { useTranslations } from "next-intl";

interface SkillsProps {
  locale: string;
}

const SKILLS = [
  {
    category: "networking",
    icon: "🌐",
    color: "from-blue-600 to-blue-800",
    items: [
      { name: "Cisco Networking (CCNA)", level: 80 },
      { name: "TCP/IP & Routing Protocols", level: 85 },
      { name: "Wireless Communication", level: 75 },
      { name: "Signal Processing", level: 70 },
      { name: "Network Security", level: 65 },
    ],
  },
  {
    category: "software",
    icon: "💻",
    color: "from-indigo-600 to-purple-700",
    items: [
      { name: "Python", level: 85 },
      { name: "JavaScript / TypeScript", level: 80 },
      { name: "Next.js / React", level: 75 },
      { name: "C / C++", level: 70 },
      { name: "SQL / Databases", level: 65 },
    ],
  },
  {
    category: "iot",
    icon: "🔌",
    color: "from-teal-600 to-cyan-700",
    items: [
      { name: "Arduino / ESP32", level: 80 },
      { name: "Raspberry Pi", level: 75 },
      { name: "MQTT Protocol", level: 70 },
      { name: "Sensor Integration", level: 75 },
      { name: "Embedded C", level: 65 },
    ],
  },
  {
    category: "ai",
    icon: "🤖",
    color: "from-violet-600 to-pink-700",
    items: [
      { name: "Machine Learning", level: 70 },
      { name: "TensorFlow / PyTorch", level: 60 },
      { name: "Computer Vision", level: 60 },
      { name: "Data Analysis", level: 75 },
      { name: "Scikit-learn", level: 65 },
    ],
  },
];

export default function Skills({ locale }: SkillsProps) {
  const t = useTranslations("skills");

  const categoryLabels: Record<string, string> = {
    networking: t("networking"),
    software: t("software"),
    iot: t("iot"),
    ai: t("ai"),
  };

  return (
    <section id="skills" className="section-padding bg-[var(--color-surface)]">
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-title">
            {t("title")} <span className="section-title-accent">{t("title_accent")}</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map(({ category, icon, color, items }) => (
            <div key={category} className="card p-6 group">
              {/* Category Header */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <h3 className="font-heading font-bold text-[var(--color-primary)] mb-5">
                {categoryLabels[category]}
              </h3>

              {/* Skill Bars */}
              <div className="space-y-3.5">
                {items.map(({ name, level }) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-[var(--color-primary)]">
                        {name}
                      </span>
                      <span className="text-xs text-[var(--color-muted-light)]">
                        {level}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
