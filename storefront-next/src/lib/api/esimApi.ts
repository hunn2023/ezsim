import type {
  EsimCountryDetail,
  EsimCountrySummary,
  EsimDataRange,
  EsimPackage,
  EsimPackageFilters,
  PackageQuickTag,
} from "@/types/esim";
import type { ApiCountry, ApiEsimPackage, ApiResponse, PaginatedResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiCountryToSummary(country: ApiCountry & { packageCount?: number; startingPrice?: number }): EsimCountrySummary {
  return {
    slug: country.slug,
    flag: country.flagUrl || `https://flagcdn.com/w160/${country.code?.toLowerCase()}.png`,
    name: country.name,
    region: mapRegion(country.region),
    startingPrice: country.startingPrice ?? 0,
    bestseller: country.sortOrder <= 3,
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

export async function getEsimCountries(): Promise<EsimCountrySummary[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/catalog/countries?PageIndex=1&PageSize=50`
    );
    if (!response.ok) return [];
    const json = await response.json();
    // Unwrap { isSuccess, data: { items } } wrapper
    const payload = json.data ?? json;
    const items: (ApiCountry & { packageCount?: number; startingPrice?: number })[] =
      Array.isArray(payload) ? payload : payload.items ?? [];
    return items.map(mapApiCountryToSummary);
  } catch {
    return [];
  }
}

export async function getEsimCountryBySlug(slug: string): Promise<EsimCountryDetail | null> {
  try {
    // First get country info
    const countriesRes = await fetch(
      `${API_BASE_URL}/api/catalog/countries?PageIndex=1&PageSize=100`
    );
    if (!countriesRes.ok) return null;
    const countriesJson = await countriesRes.json();
    const countriesPayload = countriesJson.data ?? countriesJson;
    const countries: ApiCountry[] = Array.isArray(countriesPayload) ? countriesPayload : countriesPayload.items ?? [];
    const country = countries.find((c) => c.slug === slug);
    if (!country) return null;

    // Then get packages for this country
    const pkgRes = await fetch(
      `${API_BASE_URL}/api/catalog/esim-packages?CountryId=${country.id}&PageIndex=1&PageSize=100`
    );
    if (!pkgRes.ok) return null;
    const pkgJson = await pkgRes.json();
    const pkgPayload = pkgJson.data ?? pkgJson;
    const apiPackages: ApiEsimPackage[] = Array.isArray(pkgPayload) ? pkgPayload : pkgPayload.items ?? [];

    const packages = apiPackages.map(mapApiPackageToEsim);

    return {
      slug: country.slug,
      flag: country.flagUrl || `https://flagcdn.com/w160/${country.code?.toLowerCase()}.png`,
      name: country.name,
      nameEn: country.code || country.name,
      region: mapRegion(country.region),
      gradient: "from-blue-500 to-purple-600",
      textColor: "text-white",
      tagBg: "bg-white/20",
      tags: [country.region || "Châu Á"].filter(Boolean) as string[],
      stats: [
        { label: "Số gói", value: String(packages.length) },
        { label: "Giá từ", value: packages.length > 0 ? `${Math.min(...packages.map(p => p.price)).toLocaleString("vi-VN")}đ` : "—" },
      ],
      packages,
    };
  } catch {
    return null;
  }
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
