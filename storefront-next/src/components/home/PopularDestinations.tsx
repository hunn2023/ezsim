"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { getEsimCountries } from "@/lib/api/esimApi";
import type { EsimCountrySummary } from "@/types/esim";

interface DestinationVisual {
  image: string;
  hint: string;
  accent: string;
}

const DESTINATION_FLAG_CODES: Record<string, string> = {
  "nhat-ban": "jp",
  "han-quoc": "kr",
  "thai-lan": "th",
  "chau-au": "eu",
  "my": "us",
};

const DESTINATION_VISUALS: Record<string, DestinationVisual> = {
  "nhat-ban": {
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    hint: "Tokyo, Osaka, Kyoto",
    accent: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
  },
  "han-quoc": {
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80",
    hint: "Seoul, Busan, Jeju",
    accent: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
  },
  "thai-lan": {
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
    hint: "Bangkok, Pattaya, Phuket",
    accent: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
  },
  "chau-au": {
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    hint: "30+ quốc gia Châu Âu",
    accent: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  },
  "my": {
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80",
    hint: "New York, California, Texas",
    accent: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
  },
};

export default function PopularDestinations() {
  const language = "vi" as const;
  const [destinations, setDestinations] = useState<EsimCountrySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEsimCountries()
      .then(setDestinations)
      .finally(() => setLoading(false));
  }, []);

  const featuredDestinations = destinations
    .filter((destination) => DESTINATION_VISUALS[destination.slug])
    .slice(0, 5);

  const text = {
    heading: language === "vi" ? "Điểm đến phổ biến" : "Popular destinations",
    subtitle:
      language === "vi"
        ? "Top quốc gia mua nhiều nhất kèm hình ảnh đặc trưng và giá tốt nhất hôm nay"
        : "Top booked destinations with signature visuals and best prices today",
    viewAll: language === "vi" ? "Xem tất cả 200+ quốc gia" : "View all 200+ countries",
    esimPrefix: language === "vi" ? "eSIM" : "eSIM",
    priceFrom: language === "vi" ? "Giá từ" : "From",
    hot: language === "vi" ? "HOT" : "HOT",
  };

  const countryName = (slug: string, fallback: string) => {
    if (language === "vi") return fallback;
    const map: Record<string, string> = {
      "nhat-ban": "Japan",
      "han-quoc": "South Korea",
      "thai-lan": "Thailand",
      "chau-au": "Europe",
      "my": "United States",
    };
    return map[slug] ?? fallback;
  };

  const hintText = (slug: string, fallback: string) => {
    if (language === "vi") return fallback;
    const map: Record<string, string> = {
      "nhat-ban": "Tokyo, Osaka, Kyoto",
      "han-quoc": "Seoul, Busan, Jeju",
      "thai-lan": "Bangkok, Pattaya, Phuket",
      "chau-au": "30+ European countries",
      "my": "New York, California, Texas",
    };
    return map[slug] ?? fallback;
  };

  if (loading) {
    return (
      <section style={{ padding: "0 0 64px" }}>
        <div className="max-w-container mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredDestinations.length === 0) return null;

  return (
    <section style={{ padding: "0 0 64px" }}>
      <div className="max-w-container mx-auto px-6">
        <div className="mb-8">
          <div>
            <h2 className="section-title">{text.heading}</h2>
            <p className="section-subtitle">{text.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {featuredDestinations.map((d) => {
            const visual = DESTINATION_VISUALS[d.slug];
            const flagCode = DESTINATION_FLAG_CODES[d.slug];
            return (
            <Link
              key={d.slug}
              href={`/esim-du-lich/${d.slug}`}
              className="bg-white text-navy no-underline transition-all duration-300 group hover:-translate-y-1"
              style={{
                border: "1.5px solid #E2E8F0",
                borderRadius: "18px",
                overflow: "hidden",
              }}
            >
              <div className="relative" style={{ height: "150px" }}>
                <Image
                  src={visual.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 20vw"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: "64px",
                    background: "linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.72) 100%)",
                  }}
                />
                <span
                  className="absolute top-3 left-3 inline-flex items-center justify-center rounded-md bg-white/95 border border-white/80 shadow-sm overflow-hidden"
                  style={{ width: "38px", height: "26px" }}
                  aria-label={`Cờ ${d.name}`}
                >
                  <Image
                    src={`https://flagcdn.com/w40/${flagCode}.png`}
                    alt={d.name}
                    width={38}
                    height={26}
                    className="w-full h-full object-cover"
                  />
                </span>
                {d.bestseller && (
                  <span
                    className="absolute top-3 right-3 text-white font-bold"
                    style={{
                      background: visual.accent,
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "10px",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {text.hot}
                  </span>
                )}
              </div>

              <div style={{ padding: "14px 14px 16px" }}>
                <p className="text-gray-500 mb-1" style={{ fontSize: "12px" }}>
                  {hintText(d.slug, visual.hint)}
                </p>
                <div className="font-extrabold text-navy" style={{ fontSize: "18px", letterSpacing: "-0.2px" }}>
                  {text.esimPrefix} {countryName(d.slug, d.name)}
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <div>
                    <p className="text-gray-500" style={{ fontSize: "11px" }}>
                      {text.priceFrom}
                    </p>
                    <p className="text-primary font-extrabold" style={{ fontSize: "18px", letterSpacing: "-0.2px" }}>
                      {d.startingPrice.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center justify-center rounded-full text-primary"
                    style={{ width: "34px", height: "34px", background: "#EFF6FF" }}
                  >
                    <Icon icon="arrow-right" className="text-sm" />
                  </span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/esim-du-lich"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white gradient-primary shadow-sm hover:opacity-90 transition"
          >
            {text.viewAll} <Icon icon="arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
