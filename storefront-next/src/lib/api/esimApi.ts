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
  packageCount?: number;
}

function matchesProductSlug(productSlug: string | null | undefined, slug: string): boolean {
  const normalizedProductSlug = productSlug?.trim().toLowerCase();
  const normalizedRouteSlug = slug.trim().toLowerCase();
  return (
    normalizedProductSlug === normalizedRouteSlug ||
    normalizedProductSlug === `esim-${normalizedRouteSlug}` ||
    `esim-${normalizedProductSlug}` === normalizedRouteSlug
  );
}

/** Featured eSIM products for the homepage "Điểm đến nổi bật" section. */
export async function getHomeEsimProducts(): Promise<HomeEsimProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalog/products/home/esim-products`);
    if (!response.ok) return [];
    const json = await response.json();
    const data = json?.data ?? json ?? [];
    return Array.isArray(data) ? (data as HomeEsimProduct[]) : [];
  } catch {
    return [];
  }
}

async function getHomeEsimProductBySlug(slug: string): Promise<HomeEsimProduct | null> {
  const products = await getHomeEsimProducts();
  return products.find((product) => matchesProductSlug(product.slug, slug)) ?? null;
}

// TODO: mock tạm để test khi API chưa có data — bỏ khi backend trả về dữ liệu thật.
const MOCK_DESTINATIONS: EsimCountrySummary[] = [
  { slug: "nhat-ban", flag: "https://flagcdn.com/w160/jp.png", name: "Nhật Bản", region: "Châu Á", startingPrice: 99000, bestseller: true, packageCount: 12 },
  { slug: "han-quoc", flag: "https://flagcdn.com/w160/kr.png", name: "Hàn Quốc", region: "Châu Á", startingPrice: 89000, bestseller: false, packageCount: 8 },
  { slug: "thai-lan", flag: "https://flagcdn.com/w160/th.png", name: "Thái Lan", region: "Châu Á", startingPrice: 79000, bestseller: false, packageCount: 6 },
];

// Backend caps PageSize at 100; loop pages so every country is returned.
const COUNTRIES_PAGE_SIZE = 100;

/**
 * Maps each countryId to its canonical product slug (e.g. "esim-nhat-ban").
 * The variants catalog is the only endpoint that carries both countryId and
 * productSlug, so it's the reliable join between countries/home and products.
 */
async function getProductSlugByCountryId(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalog/products/variants?pageSize=500`);
    if (!response.ok) return map;
    const json = await response.json();
    const payload = json?.data ?? json;
    const items: ApiProductVariant[] = Array.isArray(payload) ? payload : payload?.items ?? [];
    for (const item of items) {
      const productSlug = item.productSlug?.trim();
      if (item.countryId && productSlug && !map.has(item.countryId)) {
        map.set(item.countryId, productSlug);
      }
    }
  } catch {
    /* ignore — countries without a resolved product are dropped by the caller */
  }
  return map;
}

export async function getEsimCountries(): Promise<EsimCountrySummary[]> {
  try {
    const all: ApiCountryHome[] = [];
    let pageIndex = 1;

    while (true) {
      const response = await fetch(
        `${API_BASE_URL}/api/catalog/countries/home?PageIndex=${pageIndex}&PageSize=${COUNTRIES_PAGE_SIZE}`
      );
      if (!response.ok) break;
      const json = await response.json();
      // Unwrap { isSuccess, data: { items, totalPages, hasNextPage } } wrapper
      const payload = json.data ?? json;
      const items: ApiCountryHome[] =
        Array.isArray(payload) ? payload : payload.items ?? [];
      all.push(...items);

      const hasNext = Array.isArray(payload)
        ? items.length === COUNTRIES_PAGE_SIZE
        : payload.hasNextPage ?? pageIndex < (payload.totalPages ?? 1);
      if (!hasNext || items.length === 0) break;
      pageIndex += 1;
    }

    if (all.length === 0) return MOCK_DESTINATIONS;

    // Listing links must use the canonical product slug ("esim-nhat-ban"), not the
    // country slug ("nhat-ban"), so every card points at the one prerendered detail
    // page. Countries with no resolved product have no detail page and are dropped.
    const productSlugByCountryId = await getProductSlugByCountryId();
    return all.reduce<EsimCountrySummary[]>((acc, country) => {
      const productSlug = productSlugByCountryId.get(country.countryId);
      if (!productSlug) return acc;
      acc.push({ ...mapApiCountryHomeToSummary(country), slug: productSlug });
      return acc;
    }, []);
  } catch {
    return MOCK_DESTINATIONS;
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
    let items = allItems.filter((v) => matchesProductSlug(v.productSlug, slug));

    // No matching product: still show the page, just without packages.
    if (items.length === 0) {
      const product = await getHomeEsimProductBySlug(slug);
      if (!product) return buildEmptyEsimCountry(slug);

      return {
        productId: product.id,
        slug: product.slug,
        flag: product.flagUrl || product.thumbnailUrl || "",
        name: product.name,
        nameEn: product.slug,
        region: mapRegion(null),
        gradient: "from-blue-500 to-purple-600",
        textColor: "text-white",
        tagBg: "bg-white/20",
        tags: [product.locationText].filter(Boolean) as string[],
        stats: [
          { label: "Số gói", value: String(product.packageCount ?? 0) },
          { label: "Giá từ", value: product.priceFrom ? `${product.priceFrom.toLocaleString("vi-VN")}đ` : "—" },
        ],
        packages: [],
      };
    }

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
      const searchableText = [
        variant.variantName,
        variant.variantShortName,
        variant.variantDescription,
        variant.sku,
      ].filter(Boolean).join(" ");
      const nameL = searchableText.toLowerCase();
      const isUnlimited = nameL.includes("unlimited") || nameL.includes("không giới hạn") || nameL.includes("vô hạn");
      const dataInfo = extractDataInfo(searchableText);
      const days = extractDays(searchableText);
      if (isUnlimited) quickTags.push("unlimited");
      if (variant.isHot) quickTags.push("bestseller");

      return {
        id: variant.productVariantId,
        slug: variant.sku || variant.productVariantId,
        name: variant.variantShortName || variant.variantName || "Gói eSIM",
        image: variant.thumbnailUrl || `https://picsum.photos/seed/${slug}/640/480`,
        productId: variant.productId,
        productVariantId: variant.productVariantId,
        esimPackageId: variant.productVariantId,
        data: isUnlimited ? "∞" : dataInfo.amount,
        dataUnit: isUnlimited ? "Không giới hạn" : dataInfo.unit,
        subtitle: variant.variantShortName || variant.variantName || variant.variantDescription || "Gói eSIM",
        tag: days > 0 ? `${days} NGÀY` : "",
        tagType: isUnlimited ? "unlimited" : undefined,
        features,
        price,
        oldPrice,
        discount,
        featured: variant.isFeatured,
        days,
        dataGB: isUnlimited ? null : dataInfo.dataGB,
        quickTags,
        stock: 999,
        rating: 4.5,
        salesCount: variant.soldCount ?? 0,
      };
    });

    return {
      productId: first.productId,
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
  variantDescription: string | null;
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

function extractDataInfo(text: string): { amount: string; unit: string; dataGB: number } {
  const normalized = text.replace(",", ".").trim();
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(GB|MB)\b/i);
  if (!match) return { amount: "—", unit: "GB", dataGB: 0 };

  const value = Number(match[1]);
  const unit = match[2].toUpperCase();
  if (!Number.isFinite(value)) return { amount: "—", unit: "GB", dataGB: 0 };

  return {
    amount: Number.isInteger(value) ? String(value) : String(value),
    unit,
    dataGB: unit === "MB" ? value / 1024 : value,
  };
}

function extractDays(text: string): number {
  const match = text.match(/(\d+)\s*(?:ngày|days?|d)\b/i);
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
