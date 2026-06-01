 export type PackageQuickTag =
  | "bestseller"
  | "cheap"
  | "5g"
  | "unlimited"
  | "phone"
  | "hotspot";

export type EsimPackageTagType = "default" | "unlimited" | "popular";
export type EsimSortOption = "recommended" | "price_asc" | "price_desc" | "bestseller" | "rating";
export type EsimDataRange = "1-3" | "5" | "10" | "20" | "unlimited";

export interface EsimPackage {
  id: string;
  slug: string;
  name: string;
  image: string;
  data: string;
  dataUnit: string;
  subtitle: string;
  tag: string;
  tagType?: EsimPackageTagType;
  features: string[];
  price: number;
  oldPrice?: number;
  discount?: string;
  featured?: boolean;
  featuredLabel?: string;
  days: number;
  dataGB: number | null;
  quickTags?: PackageQuickTag[];
  stock: number;
  rating: number;
  salesCount: number;
}

export interface EsimCountryStat {
  label: string;
  value: string;
}

export interface EsimCountryDetail {
  slug: string;
  flag: string;
  name: string;
  nameEn: string;
  region: "Châu Á" | "Châu Âu" | "Châu Mỹ" | "Châu Đại Dương" | "Khu vực";
  gradient: string;
  textColor: string;
  tagBg: string;
  tags: string[];
  stats: EsimCountryStat[];
  packages: EsimPackage[];
}

export interface EsimCountrySummary {
  slug: string;
  flag: string;
  name: string;
  region: EsimCountryDetail["region"];
  startingPrice: number;
  bestseller: boolean;
  packageCount: number;
}

export interface EsimPackageFilters {
  days: number[];
  dataRanges: EsimDataRange[];
  featureTags: PackageQuickTag[];
  quickTag: PackageQuickTag | "all";
  minPrice?: number;
  maxPrice?: number;
  sort: EsimSortOption;
}
