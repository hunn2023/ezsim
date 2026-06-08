import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumb } from "@/components/ui";
import { CountryHero, EsimCountryBrowser } from "@/components/esim";
import { getEsimCountries, getEsimCountryBySlug } from "@/lib/api/esimApi";

export async function generateStaticParams() {
  const countries = await getEsimCountries();
  return countries.map((c) => ({ slug: c.slug }));
}

const getCachedEsimCountryBySlug = cache(async (slug: string) => getEsimCountryBySlug(slug));

const COUNTRY_FLAG_CODES: Record<string, string> = {
  "nhat-ban": "jp",
  "han-quoc": "kr",
  "thai-lan": "th",
  "chau-au": "eu",
  "my": "us",
};

// ─── Next.js metadata + params ───────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCachedEsimCountryBySlug(slug);
  if (!country) return { title: "Không tìm thấy quốc gia | EZSIM" };
  const countryName = country.name.replace(/^eSIM\s+/, "");
  const countryMap: Record<string, string> = {
    "nhat-ban": "Japan",
    "han-quoc": "South Korea",
    "thai-lan": "Thailand",
    "chau-au": "Europe",
    "my": "United States",
  };
  return {
    title: `${country.name} - Kết nối ngay khi đặt chân | EZSIM`,
  };
}

export default async function EsimCountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const language = "vi" as const;
  const country = await getCachedEsimCountryBySlug(slug);
  if (!country) notFound();

  const regionMap: Record<string, string> = {
    "Châu Á": "Asia",
    "Châu Âu": "Europe",
    "Châu Mỹ": "Americas",
    "Châu Đại Dương": "Oceania",
  };

  const countryMap: Record<string, string> = {
    "nhat-ban": "Japan",
    "han-quoc": "South Korea",
    "thai-lan": "Thailand",
    "chau-au": "Europe",
    "my": "United States",
  };

  const displayRegion = language === "vi" ? country.region : regionMap[country.region] ?? country.region;
  const displayCountry = language === "vi" ? country.name.replace(/^eSIM\s+/, "") : countryMap[country.slug] ?? country.name.replace(/^eSIM\s+/, "");
  const breadcrumbRoot = language === "vi" ? "eSIM Du lịch" : "Travel eSIM";

  return (
    <>
      <Breadcrumb items={[
        { label: breadcrumbRoot, href: "/esim-du-lich" },
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
