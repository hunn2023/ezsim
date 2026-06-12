"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/ui";
import { CountryHero, EsimCountryBrowser } from "@/components/esim";
import { getEsimCountryBySlug } from "@/lib/api/esimApi";
import type { EsimCountryDetail } from "@/types/esim";

const COUNTRY_FLAG_CODES: Record<string, string> = {
  "nhat-ban": "jp",
  "han-quoc": "kr",
  "thai-lan": "th",
  "chau-au": "eu",
  "my": "us",
};

export default function EsimCountryPageClient({ slug }: { slug: string }) {
  const [country, setCountry] = useState<EsimCountryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEsimCountryBySlug(slug)
      .then(setCountry)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="max-w-container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-navy">Không tìm thấy quốc gia</h1>
        <p className="text-gray-500 mt-2">Quốc gia này chưa có trong hệ thống.</p>
      </div>
    );
  }

  const language = "vi" as const;
  const regionMap: Record<string, string> = {
    "Châu Á": "Asia",
    "Châu Âu": "Europe",
    "Châu Mỹ": "Americas",
    "Châu Đại Dương": "Oceania",
  };

  const displayRegion = language === "vi" ? country.region : regionMap[country.region] ?? country.region;
  const displayCountry = country.name.replace(/^eSIM\s+/, "");

  return (
    <>
      <Breadcrumb items={[
        { label: "eSIM Du lịch", href: "/esim-du-lich" },
        { label: displayRegion, href: `/esim-du-lich?region=${encodeURIComponent(country.region)}` },
        { label: displayCountry },
      ]} />

      <CountryHero
        flag={country.flag}
        flagCode={COUNTRY_FLAG_CODES[country.slug]}
        name={country.name}
        nameEn={country.nameEn}
        tags={country.tags}
        stats={country.stats}
        gradient={country.gradient}
        textColor={country.textColor}
        tagBg={country.tagBg}
      />

      <EsimCountryBrowser country={country} />
    </>
  );
}
