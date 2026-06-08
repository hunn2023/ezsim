import { cookies } from "next/headers";
import Image from "next/image";
import { LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/i18n";

export interface CountryHeroProps {
  flag: string;
  flagCode?: string;
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
  flagCode,
  name,
  nameEn,
  tags,
  stats,
  gradient = "linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)",
  textColor = "#7F1D1D",
  tagBg = "rgba(255,255,255,0.7)",
}: CountryHeroProps) {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);

  const translateText = (value: string) => {
    if (language === "vi") return value;

    // Generic numeric patterns used in stats values.
    if (/^\d+(?:[.,]\d+)?%\s+diện tích$/i.test(value)) {
      return value.replace(/diện tích/i, "coverage");
    }

    if (/^\d[\d.]*\s+gói$/i.test(value)) {
      return value.replace(/gói/i, "packages");
    }

    const map: Record<string, string> = {
      "🔥 #1 Bán chạy": "🔥 #1 Best seller",
      "⚡ Kích hoạt 30s": "⚡ Activate in 30s",
      "📶 NTT Docomo & SoftBank": "📶 NTT Docomo & SoftBank",
      "🎌 12 gói data": "🎌 12 data packages",
      "🔥 Phổ biến": "🔥 Popular",
      "📶 SK Telecom": "📶 SK Telecom",
      "⚡ Kích hoạt tức thì": "⚡ Instant activation",
      "🛜 5G toàn quốc": "🛜 Nationwide 5G",
      "💰 Giá tốt": "💰 Great value",
      "🏖️ Phù hợp nghỉ dưỡng": "🏖️ Great for vacations",
      "📶 AIS / DTAC": "📶 AIS / DTAC",
      "⚡ QR tức thì": "⚡ Instant QR",
      "🌍 30+ quốc gia": "🌍 30+ countries",
      "🚄 Di chuyển liên quốc gia": "🚄 Cross-border ready",
      "📶 Orange / Vodafone": "📶 Orange / Vodafone",
      "🔥 Best seller EU": "🔥 EU best seller",
      "🇺🇸 T-Mobile / AT&T": "🇺🇸 T-Mobile / AT&T",
      "📞 Có gói có số": "📞 Plans with phone number",
      "⚡ Kích hoạt trong 1 phút": "⚡ Activate in 1 minute",
      "🛣️ Roadtrip friendly": "🛣️ Roadtrip friendly",
      "Nhà mạng": "Carrier",
      "Tốc độ": "Speed",
      "Phủ sóng": "Coverage",
      "Hotspot": "Hotspot",
      "Đã bán": "Sold",
      "99% diện tích": "99% coverage",
      "5G / 4G LTE": "5G / 4G LTE",
      "5G / LTE": "5G / LTE",
      "✅ Hỗ trợ chia sẻ": "✅ Hotspot supported",
      "✅ Có hỗ trợ": "✅ Supported",
      "Toàn nước Mỹ": "Across the U.S.",
      "Seoul, Busan, Jeju": "Seoul, Busan, Jeju",
      "Bangkok, Phuket": "Bangkok, Phuket",
      "30+ quốc gia": "30+ countries",
      "Hà Nội, Việt Nam": "Hanoi, Vietnam",
    };

    return map[value] ?? value;
  };

  const displayName =
    language === "en"
      ? name
          .replace("Nhật Bản", "Japan")
          .replace("Hàn Quốc", "South Korea")
          .replace("Thái Lan", "Thailand")
          .replace("Mỹ", "United States")
          .replace("Châu Âu", "Europe")
      : name;

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: gradient, padding: "48px 0" }}
    >
      <div className="max-w-container mx-auto px-6 grid md:grid-cols-[2fr_1fr] gap-12 items-center relative">
        {/* Country info */}
        <div className="flex gap-6 items-center">
          <div
            className="bg-white flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            {flagCode ? (
              <Image
                src={`https://flagcdn.com/w160/${flagCode}.png`}
                alt={displayName}
                width={96}
                height={64}
                className="h-16 w-24 rounded-lg object-cover"
              />
            ) : (
              <span style={{ fontSize: "64px" }}>{flag}</span>
            )}
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
              {displayName}
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
                  {translateText(tag)}
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
              <span className="text-gray-500">{translateText(s.label)}</span>
              <span className="font-bold text-navy">{translateText(s.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
