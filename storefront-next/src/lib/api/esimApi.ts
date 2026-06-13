import type {
  EsimCountryDetail,
  EsimCountrySummary,
  EsimDataRange,
  EsimPackage,
  EsimPackageFilters,
  PackageQuickTag,
} from "@/types/esim";
import type { ApiCountryHome, ApiEsimPackage } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalize slug: replace spaces with hyphens, trim */
function normalizeSlug(slug: string): string {
  return slug.trim().replace(/\s+/g, "-");
}

function mapApiCountryHomeToSummary(country: ApiCountryHome): EsimCountrySummary {
  return {
    slug: normalizeSlug(country.slug),
    flag: country.flagUrl || `https://flagcdn.com/w160/${country.code?.toLowerCase()}.png`,
    name: country.name,
    region: mapRegion(country.region),
    startingPrice: country.priceFrom ?? 0,
    bestseller: country.isHot,
    packageCount: country.packageCount ?? 0,
  };
}

function mapRegion(region: string | null): EsimCountryDetail["region"] {
  if (!region) return "Châu Á";
  const r = region.toLowerCase();
  if (r.includes("âu") || r.includes("europe")) return "Châu Âu";
  if (r.includes("mỹ") || r.includes("america")) return "Châu Mỹ";
  if (r.includes("đại dương") || r.includes("oceania")) return "Châu Đại Dương";
  return "Châu Á";
}

function mapApiPackageToEsim(pkg: ApiEsimPackage): EsimPackage {
  const dataGB = pkg.isUnlimited ? null : (pkg.dataAmount ?? 0);
  const dataStr = pkg.isUnlimited ? "∞" : String(pkg.dataAmount ?? 0);
  const dataUnitStr = pkg.isUnlimited ? "Không giới hạn" : (pkg.dataUnit || "GB");

  const quickTags: PackageQuickTag[] = [];
  if (pkg.isUnlimited) quickTags.push("unlimited");
  if (pkg.hotspotSupported) quickTags.push("hotspot");
  if (pkg.phoneNumberSupported) quickTags.push("phone");
  if (pkg.salePrice && pkg.price && pkg.salePrice < pkg.price * 0.85) quickTags.push("cheap");

  const features: string[] = [];
  if (pkg.coverageDescription) features.push(pkg.coverageDescription);
  if (pkg.activationPolicy) features.push(pkg.activationPolicy);
  if (pkg.speedPolicy) features.push(pkg.speedPolicy);

  const price = pkg.salePrice ?? pkg.price ?? 0;
  const oldPrice = pkg.originalPrice ?? pkg.price ?? undefined;
  const discount = oldPrice && oldPrice > price
    ? `-${Math.round((1 - price / oldPrice) * 100)}%`
    : undefined;

  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    image: `https://picsum.photos/seed/${pkg.slug}/640/480`,
    productId: pkg.productId,
    productVariantId: pkg.productVariantId,
    esimPackageId: pkg.id,
    data: dataStr,
    dataUnit: dataUnitStr,
    subtitle: pkg.coverageType || `${pkg.validityDays} ngày`,
    tag: pkg.isUnlimited ? "UNLIMITED" : `${pkg.validityDays} NGÀY`,
    tagType: pkg.isUnlimited ? "unlimited" : undefined,
    features,
    price,
    oldPrice: oldPrice !== price ? oldPrice : undefined,
    discount,
    featured: pkg.sortOrder <= 2,
    days: pkg.validityDays,
    dataGB,
    quickTags,
    stock: 999,
    rating: 4.5,
    salesCount: 100 - pkg.sortOrder,
  };
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export interface CatalogThumbnailMaps {
  byVariant: Map<string, string>;
  byProduct: Map<string, string>;
}

let catalogThumbnailsPromise: Promise<CatalogThumbnailMaps> | null = null;

/**
 * Fetches all catalog variant thumbnails and indexes them by productVariantId
 * and productId. Cached at module level so repeated lookups (e.g. opening
 * several order detail popups) hit the network only once.
 */
export async function getCatalogThumbnails(): Promise<CatalogThumbnailMaps> {
  if (!catalogThumbnailsPromise) {
    catalogThumbnailsPromise = (async () => {
      const byVariant = new Map<string, string>();
      const byProduct = new Map<string, string>();
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/catalog/products/variants?pageSize=500`
        );
        if (response.ok) {
          const json = await response.json();
          const payload = json?.data ?? json;
          const items: ApiProductVariant[] = Array.isArray(payload) ? payload : payload?.items ?? [];
          for (const item of items) {
            if (!item.thumbnailUrl) continue;
            if (item.productVariantId) byVariant.set(item.productVariantId, item.thumbnailUrl);
            if (item.productId && !byProduct.has(item.productId)) {
              byProduct.set(item.productId, item.thumbnailUrl);
            }
          }
        }
      } catch {
        // Network failures fall back to no thumbnails — caller handles gracefully.
      }
      return { byVariant, byProduct };
    })();
  }
  return catalogThumbnailsPromise;
}

export interface HomeEsimProduct {
  id: string;
  name: string;
  slug: string;
  locationText: string | null;
  thumbnailUrl: string | null;
  flagUrl: string | null;
  priceFrom: number;
  currency: string;
  isHot: boolean;
  isFeatured: boolean;
}

/** Featured eSIM products for the homepage "Điểm đến nổi bật" section. */
export async function getHomeEsimProducts(): Promise<HomeEsimProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalog/products/home/esim-products`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const json = await response.json();
    const data = json?.data ?? json ?? [];
    return Array.isArray(data) ? (data as HomeEsimProduct[]) : [];
  } catch {
    return [];
  }
}

export async function getEsimCountries(): Promise<EsimCountrySummary[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/catalog/countries/home`
    );
    if (!response.ok) return [];
    const json = await response.json();
    // Unwrap { isSuccess, data: { items } } wrapper
    const payload = json.data ?? json;
    const items: ApiCountryHome[] =
      Array.isArray(payload) ? payload : payload.items ?? [];
    return items.map(mapApiCountryHomeToSummary);
  } catch {
    return [];
  }
}

/** Build a placeholder country (no packages) so the detail page always renders. */
function buildEmptyEsimCountry(slug: string): EsimCountryDetail {
  const displayName = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    slug,
    flag: "",
    name: displayName ? `eSIM ${displayName}` : "eSIM",
    nameEn: slug,
    region: mapRegion(null),
    gradient: "from-blue-500 to-purple-600",
    textColor: "text-white",
    tagBg: "bg-white/20",
    tags: [],
    stats: [
      { label: "Số gói", value: "0" },
      { label: "Giá từ", value: "—" },
    ],
    packages: [],
  };
}

export async function getEsimCountryBySlug(slug: string): Promise<EsimCountryDetail> {
  try {
    // NOTE: the backend currently ignores the ProductSlug/CountrySlug filters and
    // returns every product's variants, so we fetch the full list (large page size)
    // and filter client-side by productSlug.
    const response = await fetch(
      `${API_BASE_URL}/api/catalog/products/variants?pageSize=500`
    );
    const json = response.ok ? await response.json() : null;
    if (json?.isSuccess === false) return buildEmptyEsimCountry(slug);
    const payload = json?.data ?? json;
    const allItems: ApiProductVariant[] = Array.isArray(payload) ? payload : payload?.items ?? [];

    // Match the route slug against the product slug. Country-style slugs
    // (e.g. "han-quoc") map to their product slug ("esim-han-quoc").
    const normalized = slug.trim().toLowerCase();
    let items = allItems.filter((v) => v.productSlug?.toLowerCase() === normalized);
    if (items.length === 0) {
      items = allItems.filter((v) => v.productSlug?.toLowerCase() === `esim-${normalized}`);
    }

    // No matching product: still show the page, just without packages.
    if (items.length === 0) return buildEmptyEsimCountry(slug);

    // Use the first item for product-level info
    const first = items[0];

    const packages: EsimPackage[] = items.map((variant) => {
      const price = variant.salePrice ?? variant.originalPrice ?? 0;
      const oldPrice = variant.originalPrice && variant.originalPrice > price ? variant.originalPrice : undefined;
      const discount = oldPrice ? `-${Math.round((1 - price / oldPrice) * 100)}%` : undefined;

      const features: string[] = (variant.features || [])
        .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
        .map((f: { text: string }) => f.text);

      const quickTags: PackageQuickTag[] = [];
      const nameL = (variant.variantName || "").toLowerCase();
      if (nameL.includes("unlimited") || nameL.includes("không giới hạn")) quickTags.push("unlimited");
      if (variant.isHot) quickTags.push("bestseller");

      return {
        id: variant.productVariantId,
        slug: variant.sku || variant.productVariantId,
        name: variant.variantName || variant.variantShortName || "Gói eSIM",
        image: variant.thumbnailUrl || `https://picsum.photos/seed/${slug}/640/480`,
        productId: variant.productId,
        productVariantId: variant.productVariantId,
        esimPackageId: variant.productVariantId,
        data: nameL.includes("unlimited") || nameL.includes("không giới hạn") ? "∞" : "—",
        dataUnit: nameL.includes("unlimited") || nameL.includes("không giới hạn") ? "Không giới hạn" : "GB",
        subtitle: variant.variantDescription || `${variant.variantShortName}`,
        tag: variant.variantShortName || variant.variantName || "",
        tagType: nameL.includes("unlimited") || nameL.includes("không giới hạn") ? "unlimited" : undefined,
        features,
        price,
        oldPrice,
        discount,
        featured: variant.isFeatured,
        days: extractDays(variant.variantDescription || variant.sku || ""),
        dataGB: nameL.includes("unlimited") || nameL.includes("không giới hạn") ? null : 0,
        quickTags,
        stock: 999,
        rating: 4.5,
        salesCount: variant.soldCount ?? 0,
      };
    });

    return {
      slug,
      flag: first.thumbnailUrl || `https://flagcdn.com/w160/${(first.countryName || "").slice(0, 2).toLowerCase()}.png`,
      name: first.productName || `eSIM ${first.countryName}`,
      nameEn: first.productCode || first.productSlug || slug,
      region: mapRegion(null),
      gradient: "from-blue-500 to-purple-600",
      textColor: "text-white",
      tagBg: "bg-white/20",
      tags: [first.locationText, first.categoryName].filter(Boolean) as string[],
      stats: [
        { label: "Số gói", value: String(packages.length) },
        { label: "Giá từ", value: packages.length > 0 ? `${Math.min(...packages.map(p => p.price)).toLocaleString("vi-VN")}đ` : "—" },
      ],
      packages,
    };
  } catch {
    return buildEmptyEsimCountry(slug);
  }
}

interface ApiProductVariant {
  productId: string;
  productCode: string;
  productName: string;
  productSlug: string;
  productVariantId: string;
  sku: string;
  variantName: string;
  variantShortName: string;
  variantDescription: string;
  categoryId: string;
  categoryName: string;
  countryId: string;
  countryName: string;
  shortDescription: string;
  locationText: string | null;
  thumbnailUrl: string | null;
  originalPrice: number;
  salePrice: number | null;
  currency: string;
  isFeatured: boolean;
  isHot: boolean;
  soldCount: number;
  productSortOrder: number;
  variantSortOrder: number;
  features: { productVariantId: string; text: string; icon: string | null; sortOrder: number }[];
}

function extractDays(text: string): number {
  const match = text.match(/(\d+)\s*(?:ngày|days?|d)/i);
  return match ? parseInt(match[1], 10) : 7;
}

// ─── Pure Utilities (no API call) ─────────────────────────────────────────────

export function getDataRangeForPackage(dataGB: number | null): EsimDataRange {
  if (dataGB === null) return "unlimited";
  if (dataGB <= 3) return "1-3";
  if (dataGB <= 5) return "5";
  if (dataGB <= 10) return "10";
  return "20";
}

export function getPackageCountByQuickTag(packages: EsimPackage[]): Record<PackageQuickTag, number> {
  return packages.reduce<Record<PackageQuickTag, number>>(
    (acc, pkg) => {
      for (const tag of pkg.quickTags ?? []) {
        acc[tag] += 1;
      }
      return acc;
    },
    {
      bestseller: 0,
      cheap: 0,
      "5g": 0,
      unlimited: 0,
      phone: 0,
      hotspot: 0,
    }
  );
}

export function filterEsimPackages(packages: EsimPackage[], filters: EsimPackageFilters): EsimPackage[] {
  const filtered = packages.filter((pkg) => {
    const matchesDay = filters.days.length === 0 || filters.days.includes(pkg.days);
    const matchesDataRange =
      filters.dataRanges.length === 0 || filters.dataRanges.includes(getDataRangeForPackage(pkg.dataGB));
    const matchesFeatureTags =
      filters.featureTags.length === 0 || filters.featureTags.every((tag) => pkg.features?.includes(tag));
    const matchesQuickTag = filters.quickTag === "all" || pkg.quickTags?.includes(filters.quickTag);
    const matchesMin = filters.minPrice === undefined || pkg.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || pkg.price <= filters.maxPrice;
    return matchesDay && matchesDataRange && matchesFeatureTags && matchesQuickTag && matchesMin && matchesMax;
  });

  switch (filters.sort) {
    case "price_asc":
      return filtered.sort((a, b) => a.price - b.price);
    case "price_desc":
      return filtered.sort((a, b) => b.price - a.price);
    case "bestseller":
      return filtered.sort((a, b) => b.salesCount - a.salesCount);
    case "rating":
      return filtered.sort((a, b) => b.rating - a.rating || b.salesCount - a.salesCount);
    case "recommended":
    default:
      return filtered.sort((a, b) => {
        const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDiff !== 0) return featuredDiff;
        return b.salesCount - a.salesCount;
      });
  }
}
