export interface CountryHeroProps {
  flag: string;
  name: string;
  nameEn: string;
  tags: string[];
  stats: { label: string; value: string }[];
  /** Background gradient for the hero (mockup uses pink/red for Japan). */
  gradient?: string;
  /** Text color for name & tags (mockup uses dark red for Japan). */
  textColor?: string;
  tagBg?: string;
}

export default function CountryHero({
  flag,
  name,
  nameEn,
  tags,
  stats,
  gradient = "linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)",
  textColor = "#7F1D1D",
  tagBg = "rgba(255,255,255,0.7)",
}: CountryHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: gradient, padding: "48px 0" }}
    >
      <div className="max-w-container mx-auto px-6 grid md:grid-cols-[2fr_1fr] gap-12 items-center relative">
        {/* Country info */}
        <div className="flex gap-6 items-center">
          <div
            className="bg-white flex items-center justify-center flex-shrink-0"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              fontSize: "64px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            {flag}
          </div>
          <div>
            <h1
              className="font-extrabold"
              style={{
                fontSize: "36px",
                color: textColor,
                marginBottom: "4px",
                letterSpacing: "-1px",
              }}
            >
              {name}
            </h1>
            <p
              className="font-medium"
              style={{ fontSize: "16px", color: textColor, opacity: 0.85 }}
            >
              {nameEn}
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-semibold"
                  style={{
                    background: tagBg,
                    color: textColor,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div
          className="bg-white"
          style={{
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex justify-between"
              style={{
                padding: "8px 0",
                fontSize: "13px",
                borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <span className="text-gray-500">{s.label}</span>
              <span className="font-bold text-navy">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
