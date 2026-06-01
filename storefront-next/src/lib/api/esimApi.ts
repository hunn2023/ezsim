import type {
  EsimCountryDetail,
  EsimCountrySummary,
  EsimDataRange,
  EsimPackage,
  EsimPackageFilters,
  PackageQuickTag,
} from "@/types/esim";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildPackage = (countrySlug: string, pkg: Omit<EsimPackage, "id" | "slug" | "name" | "image" | "stock"> & { idSuffix: string; stock?: number }) => ({
  ...pkg,
  id: `${countrySlug}-${pkg.idSuffix}`,
  slug: `${countrySlug}-${pkg.idSuffix}`,
  name: `eSIM ${countrySlug.replace(/-/g, " ")} ${pkg.data}${pkg.dataUnit === "GB" ? "GB" : ""} ${pkg.days} ngày`,
  image: `https://picsum.photos/seed/${countrySlug}-${pkg.idSuffix}/640/480`,
  stock: pkg.stock ?? 999,
});

const countries: EsimCountryDetail[] = [
  {
    slug: "nhat-ban",
    flag: "🇯🇵",
    name: "eSIM Nhật Bản",
    nameEn: "Japan eSIM • Tokyo, Osaka, Kyoto, Hokkaido...",
    region: "Châu Á",
    gradient: "linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)",
    textColor: "#7F1D1D",
    tagBg: "rgba(255,255,255,0.7)",
    tags: ["🔥 #1 Bán chạy", "⚡ Kích hoạt 30s", "📶 NTT Docomo & SoftBank", "🎌 12 gói data"],
    stats: [
      { label: "Nhà mạng", value: "Docomo / SoftBank" },
      { label: "Tốc độ", value: "5G / 4G LTE" },
      { label: "Phủ sóng", value: "99% diện tích" },
      { label: "Hotspot", value: "✅ Hỗ trợ chia sẻ" },
      { label: "Đã bán", value: "38.420 gói" },
    ],
    packages: [
      buildPackage("nhat-ban", {
        idSuffix: "5gb-7d",
        data: "5",
        dataUnit: "GB",
        subtitle: "Tốc độ cao toàn thời gian",
        tag: "7 NGÀY",
        features: ["Mạng 5G NTT Docomo", "Hỗ trợ chia sẻ Hotspot", "Kích hoạt khi đặt chân Nhật", "Không cần đăng ký giấy tờ"],
        price: 99000,
        oldPrice: 120000,
        discount: "-18%",
        featured: true,
        featuredLabel: "🔥 BÁN CHẠY #1",
        days: 7,
        dataGB: 5,
        quickTags: ["bestseller", "cheap", "5g", "hotspot"],
        rating: 4.9,
        salesCount: 12450,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "10gb-10d",
        data: "10",
        dataUnit: "GB",
        subtitle: "Phù hợp đi 7-10 ngày",
        tag: "10 NGÀY",
        features: ["Mạng 5G/4G LTE", "Hỗ trợ chia sẻ Hotspot", "Tự động chuyển mạng tốt nhất", "Hết 10GB giảm tốc vẫn dùng được"],
        price: 149000,
        oldPrice: 180000,
        days: 10,
        dataGB: 10,
        quickTags: ["5g", "hotspot"],
        rating: 4.8,
        salesCount: 9320,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "unlimited-7d",
        data: "∞",
        dataUnit: "Không giới hạn",
        subtitle: "2GB/ngày tốc độ cao",
        tag: "⭐ UNLIMITED",
        tagType: "unlimited",
        features: ["2GB/ngày tốc độ tối đa", "Sau đó vẫn dùng, giảm tốc", "Phù hợp đi nhóm, gia đình", "Chia sẻ Hotspot thoải mái"],
        price: 299000,
        oldPrice: 350000,
        days: 7,
        dataGB: null,
        quickTags: ["unlimited", "hotspot", "5g"],
        rating: 4.9,
        salesCount: 6100,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "3gb-5d",
        data: "3",
        dataUnit: "GB",
        subtitle: "Đi ngắn ngày, công tác",
        tag: "5 NGÀY",
        features: ["Mạng SoftBank 4G LTE", "Hỗ trợ Hotspot", "Phù hợp dùng map, mạng xã hội", "Tốc độ 100Mbps+"],
        price: 79000,
        days: 5,
        dataGB: 3,
        quickTags: ["cheap", "hotspot"],
        rating: 4.7,
        salesCount: 4820,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "20gb-15d",
        data: "20",
        dataUnit: "GB",
        subtitle: "Đi dài ngày, tour 2 tuần",
        tag: "15 NGÀY",
        features: ["Mạng 5G/4G+ chuẩn", "Hỗ trợ Hotspot", "Đủ dùng livestream, video call", "Trung bình 1.3GB/ngày"],
        price: 229000,
        oldPrice: 280000,
        days: 15,
        dataGB: 20,
        quickTags: ["5g", "hotspot"],
        rating: 4.8,
        salesCount: 4050,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "30gb-phone-30d",
        data: "30",
        dataUnit: "GB",
        subtitle: "Du học, công tác dài hạn",
        tag: "📞 CÓ SĐT",
        tagType: "popular",
        features: ["30GB tốc độ cao", "Có số điện thoại gọi, nhắn tin", "Đăng ký được tài khoản dịch vụ Nhật", "Phù hợp ở 1 tháng+"],
        price: 449000,
        days: 30,
        dataGB: 30,
        quickTags: ["phone", "5g"],
        rating: 4.9,
        salesCount: 2880,
      }),
    ],
  },
  {
    slug: "han-quoc",
    flag: "🇰🇷",
    name: "eSIM Hàn Quốc",
    nameEn: "South Korea eSIM • Seoul, Busan, Jeju...",
    region: "Châu Á",
    gradient: "linear-gradient(135deg, #E0F2FE 0%, #BFDBFE 100%)",
    textColor: "#1E3A8A",
    tagBg: "rgba(255,255,255,0.75)",
    tags: ["🔥 Phổ biến", "📶 SK Telecom", "⚡ Kích hoạt tức thì", "🛜 5G toàn quốc"],
    stats: [
      { label: "Nhà mạng", value: "SKT / KT / LG U+" },
      { label: "Tốc độ", value: "5G / LTE" },
      { label: "Phủ sóng", value: "Seoul, Busan, Jeju" },
      { label: "Hotspot", value: "✅ Có hỗ trợ" },
      { label: "Đã bán", value: "24.860 gói" },
    ],
    packages: [
      buildPackage("han-quoc", { idSuffix: "daily-5d", data: "1", dataUnit: "GB/ngày", subtitle: "Chuyến đi ngắn", tag: "5 NGÀY", features: ["Dùng ngay tại sân bay", "Mạng SK Telecom", "Chia sẻ hotspot", "Không roaming"], price: 89000, oldPrice: 109000, days: 5, dataGB: 5, quickTags: ["cheap", "5g", "hotspot"], rating: 4.8, salesCount: 7220 }),
      buildPackage("han-quoc", { idSuffix: "10gb-10d", data: "10", dataUnit: "GB", subtitle: "Du lịch tự túc 1 tuần+", tag: "10 NGÀY", features: ["5G ổn định", "Xem video, bản đồ mượt", "Hỗ trợ hotspot", "Nhận QR sau thanh toán"], price: 139000, days: 10, dataGB: 10, quickTags: ["5g", "hotspot", "bestseller"], rating: 4.9, salesCount: 10120, featured: true, featuredLabel: "⭐ PHÙ HỢP NHẤT" }),
      buildPackage("han-quoc", { idSuffix: "unlimited-7d", data: "∞", dataUnit: "Không giới hạn", subtitle: "Data thả ga 3GB/ngày", tag: "UNLIMITED", tagType: "unlimited", features: ["3GB tốc độ cao mỗi ngày", "Sau đó giảm tốc", "Phù hợp TikTok, livestream", "Hotspot ổn định"], price: 259000, oldPrice: 309000, days: 7, dataGB: null, quickTags: ["unlimited", "hotspot"], rating: 4.7, salesCount: 3310 }),
      buildPackage("han-quoc", { idSuffix: "phone-15d", data: "15", dataUnit: "GB", subtitle: "Có thêm số Hàn", tag: "CÓ SĐT", tagType: "popular", features: ["Nghe gọi nội địa", "Nhận OTP dịch vụ Hàn", "Phù hợp công tác", "Mạng KT ổn định"], price: 319000, days: 15, dataGB: 15, quickTags: ["phone", "5g"], rating: 4.9, salesCount: 2140 }),
    ],
  },
  {
    slug: "thai-lan",
    flag: "🇹🇭",
    name: "eSIM Thái Lan",
    nameEn: "Thailand eSIM • Bangkok, Pattaya, Phuket...",
    region: "Châu Á",
    gradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    textColor: "#92400E",
    tagBg: "rgba(255,255,255,0.78)",
    tags: ["💰 Giá tốt", "🏖️ Phù hợp nghỉ dưỡng", "📶 AIS / DTAC", "⚡ QR tức thì"],
    stats: [
      { label: "Nhà mạng", value: "AIS / DTAC / True" },
      { label: "Tốc độ", value: "5G / 4G LTE" },
      { label: "Phủ sóng", value: "Bangkok, Phuket" },
      { label: "Hotspot", value: "✅ Có hỗ trợ" },
      { label: "Đã bán", value: "17.530 gói" },
    ],
    packages: [
      buildPackage("thai-lan", { idSuffix: "3gb-3d", data: "3", dataUnit: "GB", subtitle: "Đi cuối tuần", tag: "3 NGÀY", features: ["Giá tốt", "Nhận QR nhanh", "Dùng map thoải mái", "Hỗ trợ hotspot"], price: 69000, days: 3, dataGB: 3, quickTags: ["cheap", "hotspot"], rating: 4.7, salesCount: 3820 }),
      buildPackage("thai-lan", { idSuffix: "5gb-7d", data: "5", dataUnit: "GB", subtitle: "Phổ biến nhất", tag: "7 NGÀY", features: ["Mạng AIS 5G", "Video call ổn định", "Tự kích hoạt", "Có hướng dẫn tiếng Việt"], price: 99000, oldPrice: 119000, days: 7, dataGB: 5, quickTags: ["bestseller", "5g", "hotspot"], rating: 4.9, salesCount: 6680, featured: true, featuredLabel: "🔥 BÁN CHẠY" }),
      buildPackage("thai-lan", { idSuffix: "15gb-10d", data: "15", dataUnit: "GB", subtitle: "Cho lịch trình dài hơn", tag: "10 NGÀY", features: ["5G/4G linh hoạt", "Đủ dùng mạng xã hội", "Có hotspot", "Hết data có thể mua thêm"], price: 149000, days: 10, dataGB: 15, quickTags: ["5g", "hotspot"], rating: 4.8, salesCount: 2950 }),
    ],
  },
  {
    slug: "chau-au",
    flag: "🇪🇺",
    name: "eSIM Châu Âu",
    nameEn: "Europe eSIM • 30+ quốc gia EU",
    region: "Khu vực",
    gradient: "linear-gradient(135deg, #DBEAFE 0%, #DDD6FE 100%)",
    textColor: "#312E81",
    tagBg: "rgba(255,255,255,0.78)",
    tags: ["🌍 30+ quốc gia", "🚄 Di chuyển liên quốc gia", "📶 Orange / Vodafone", "🔥 Best seller EU"],
    stats: [
      { label: "Nhà mạng", value: "Orange / Vodafone" },
      { label: "Tốc độ", value: "5G / LTE" },
      { label: "Phủ sóng", value: "30+ quốc gia" },
      { label: "Hotspot", value: "✅ Có hỗ trợ" },
      { label: "Đã bán", value: "9.830 gói" },
    ],
    packages: [
      buildPackage("chau-au", { idSuffix: "10gb-15d", data: "10", dataUnit: "GB", subtitle: "Du lịch 2 tuần Châu Âu", tag: "15 NGÀY", features: ["Dùng tại 30+ nước", "Không đổi QR khi qua biên giới", "Hỗ trợ hotspot", "Mạng lớn EU"], price: 249000, oldPrice: 299000, days: 15, dataGB: 10, quickTags: ["bestseller", "hotspot", "5g"], rating: 4.8, salesCount: 4180, featured: true, featuredLabel: "🌍 PHỔ BIẾN" }),
      buildPackage("chau-au", { idSuffix: "20gb-30d", data: "20", dataUnit: "GB", subtitle: "Roadtrip, công tác dài ngày", tag: "30 NGÀY", features: ["Ổn định xuyên châu Âu", "5G tại thành phố lớn", "Hotspot", "Hỗ trợ nhiều thiết bị"], price: 399000, days: 30, dataGB: 20, quickTags: ["5g", "hotspot"], rating: 4.9, salesCount: 2330 }),
      buildPackage("chau-au", { idSuffix: "unlimited-15d", data: "∞", dataUnit: "Không giới hạn", subtitle: "Làm việc từ xa, video liên tục", tag: "UNLIMITED", tagType: "unlimited", features: ["3GB tốc độ cao/ngày", "Sau đó giảm tốc", "Phù hợp nhóm đi dài ngày", "Chia sẻ hotspot"], price: 529000, days: 15, dataGB: null, quickTags: ["unlimited", "hotspot"], rating: 4.7, salesCount: 980 }),
    ],
  },
  {
    slug: "my",
    flag: "🇺🇸",
    name: "eSIM Mỹ",
    nameEn: "USA eSIM • New York, California, Texas...",
    region: "Châu Mỹ",
    gradient: "linear-gradient(135deg, #FEE2E2 0%, #DBEAFE 100%)",
    textColor: "#1F2937",
    tagBg: "rgba(255,255,255,0.78)",
    tags: ["🇺🇸 T-Mobile / AT&T", "📞 Có gói có số", "⚡ Kích hoạt trong 1 phút", "🛣️ Roadtrip friendly"],
    stats: [
      { label: "Nhà mạng", value: "T-Mobile / AT&T" },
      { label: "Tốc độ", value: "5G / LTE" },
      { label: "Phủ sóng", value: "Toàn nước Mỹ" },
      { label: "Hotspot", value: "✅ Có hỗ trợ" },
      { label: "Đã bán", value: "11.210 gói" },
    ],
    packages: [
      buildPackage("my", { idSuffix: "5gb-7d", data: "5", dataUnit: "GB", subtitle: "Đi công tác ngắn ngày", tag: "7 NGÀY", features: ["Mạng mạnh ở thành phố", "Hotspot", "Google Maps, mail ổn định", "Kích hoạt tức thì"], price: 199000, days: 7, dataGB: 5, quickTags: ["hotspot", "5g"], rating: 4.8, salesCount: 3020 }),
      buildPackage("my", { idSuffix: "20gb-15d", data: "20", dataUnit: "GB", subtitle: "Roadtrip, làm việc từ xa", tag: "15 NGÀY", features: ["Tốc độ cao", "Hỗ trợ hotspot", "Tối ưu cho video call", "Tự kích hoạt dễ dàng"], price: 349000, oldPrice: 399000, days: 15, dataGB: 20, quickTags: ["5g", "hotspot", "bestseller"], rating: 4.9, salesCount: 4410, featured: true, featuredLabel: "🚀 ROADTRIP" }),
      buildPackage("my", { idSuffix: "phone-30d", data: "25", dataUnit: "GB", subtitle: "Có số Mỹ nhận OTP", tag: "CÓ SĐT", tagType: "popular", features: ["Có số Mỹ", "Nhắn tin, nghe gọi", "Phù hợp du học, công tác", "Data tốc độ cao"], price: 499000, days: 30, dataGB: 25, quickTags: ["phone", "5g"], rating: 4.8, salesCount: 1650 }),
    ],
  },
];

export async function getEsimCountries(): Promise<EsimCountrySummary[]> {
  await delay(120);
  return countries.map((country) => ({
    slug: country.slug,
    flag: country.flag,
    name: country.name.replace(/^eSIM\s+/, ""),
    region: country.region,
    startingPrice: Math.min(...country.packages.map((pkg) => pkg.price)),
    bestseller: country.packages.some((pkg) => pkg.featured),
    packageCount: country.packages.length,
  }));
}

export async function getEsimCountryBySlug(slug: string): Promise<EsimCountryDetail | null> {
  await delay(120);
  return countries.find((country) => country.slug === slug) ?? null;
}

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
      filters.featureTags.length === 0 || filters.featureTags.every((tag) => pkg.quickTags?.includes(tag));
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
