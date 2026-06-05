import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumb } from "@/components/ui";
import { CountryHero, EsimCountryBrowser } from "@/components/esim";
import { getEsimCountryBySlug } from "@/lib/api/esimApi";

export const revalidate = 300;

const getCachedEsimCountryBySlug = cache(async (slug: string) => getEsimCountryBySlug(slug));

// ─── Next.js metadata + params ───────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCachedEsimCountryBySlug(slug);
  if (!country) return { title: "Không tìm thấy quốc gia | EZSIM" };
  return {
    title: `${country.name} - Kết nối ngay khi đặt chân | EZSIM`,
  };
}

export default async function EsimCountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = await getCachedEsimCountryBySlug(slug);
  if (!country) notFound();

  return (
    <>
      <Breadcrumb items={[
        { label: "eSIM Du lịch", href: "/esim-du-lich" },
        { label: country.region, href: `/esim-du-lich?region=${encodeURIComponent(country.region)}` },
        { label: country.name.replace(/^eSIM\s+/, "") },
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
