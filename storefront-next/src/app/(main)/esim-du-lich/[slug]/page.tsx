import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumb } from "@/components/ui";
import { CountryHero, EsimCountryBrowser } from "@/components/esim";
import { getEsimCountryBySlug } from "@/lib/api/esimApi";
import { LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/i18n";

export const revalidate = 300;

const getCachedEsimCountryBySlug = cache(async (slug: string) => getEsimCountryBySlug(slug));

// ─── Next.js metadata + params ───────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);
  const { slug } = await params;
  const country = await getCachedEsimCountryBySlug(slug);
  if (!country) return { title: language === "vi" ? "Không tìm thấy quốc gia | EZSIM" : "Country not found | EZSIM" };
  const countryName = country.name.replace(/^eSIM\s+/, "");
  const countryMap: Record<string, string> = {
    "nhat-ban": "Japan",
    "han-quoc": "South Korea",
    "thai-lan": "Thailand",
    "chau-au": "Europe",
    "my": "United States",
  };
  const displayName = language === "vi" ? countryName : countryMap[country.slug] ?? countryName;

  return {
    title:
      language === "vi"
        ? `${country.name} - Kết nối ngay khi đặt chân | EZSIM`
        : `${displayName} eSIM - Stay connected on arrival | EZSIM`,
  };
}

export default async function EsimCountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);
  const { slug } = await params;
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
