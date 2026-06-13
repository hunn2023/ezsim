import type { Metadata } from "next";
import { getEsimCountryBySlug } from "@/lib/api/esimApi";
import EsimCountryView from "./EsimCountryView";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugSet = new Set<string>();

  // Fetch product slugs (e.g., "esim-han-quoc")
  try {
    const res = await fetch(`${API_BASE_URL}/api/catalog/products/home/esim-products`);
    if (res.ok) {
      const json = await res.json();
      const items: { slug: string }[] = json.data ?? [];
      for (const item of items) slugSet.add(item.slug);
    }
  } catch { /* ignore */ }

  // Fetch country slugs (e.g., "viet-nam")
  try {
    const res = await fetch(`${API_BASE_URL}/api/catalog/countries/home`);
    if (res.ok) {
      const json = await res.json();
      const payload = json.data ?? json;
      const items: { slug: string }[] = Array.isArray(payload) ? payload : payload.items ?? [];
      for (const item of items) slugSet.add(item.slug.trim().replace(/\s+/g, "-"));
    }
  } catch { /* ignore */ }

  if (slugSet.size > 0) {
    return Array.from(slugSet).map((slug) => ({ slug }));
  }

  // Fallback
  return [
    { slug: "esim-han-quoc" },
    { slug: "viet-nam" },
  ];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const country = await getEsimCountryBySlug(params.slug);
  const description =
    country.tags && country.tags.length > 0
      ? `Gói ${country.name}: ${country.tags.join(", ")}. Kích hoạt nhanh bằng QR Code.`
      : `Các gói ${country.name} giá tốt, kích hoạt nhanh bằng QR Code.`;
  return {
    title: `${country.name} - Kết nối ngay khi đặt chân | EZSIM`,
    description,
  };
}

export default async function EsimCountryPage({ params }: { params: { slug: string } }) {
  const country = await getEsimCountryBySlug(params.slug);
  return <EsimCountryView country={country} />;
}
