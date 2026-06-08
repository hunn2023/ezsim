import type {
  EsimCountryDetail,
  EsimCountrySummary,
  EsimDataRange,
  EsimPackage,
  EsimPackageFilters,
  PackageQuickTag,
} from "@/types/esim";

const buildPackage = (countrySlug: string, pkg: Omit<EsimPackage, "id" | "slug" | "name" | "image" | "stock"> & { idSuffix: string; stock?: number }) => ({
  ...pkg,
  id: `${countrySlug}-${pkg.idSuffix}`,
  slug: `${countrySlug}-${pkg.idSuffix}`,
  name: `eSIM ${countrySlug.replace(/-/g, " ")} ${pkg.data}${pkg.dataUnit === "GB" ? "GB" : ""} ${pkg.days} ngày`,
  image: `https://picsum.photos/seed/${countrySlug}-${pkg.idSuffix}/640/480`,
  stock: pkg.stock ?? 999,
});

const EXTRA_PACKAGE_BASE_PRICE: Record<string, number> = {
  "nhat-ban": 85000,
  "han-quoc": 90000,
  "thai-lan": 70000,
  "chau-au": 220000,
  "my": 180000,
};

const EXTRA_PACKAGE_BLUEPRINTS: Array<{
  idSuffix: string;
  data: string;
  dataUnit: EsimPackage["dataUnit"];
  days: number;
  dataGB: number | null;
  deltaPrice: number;
  tag: string;
  subtitle: string;
  quickTags: EsimPackage["quickTags"];
  tagType?: EsimPackage["tagType"];
}> = [
  { idSuffix: "mock-2gb-4d", data: "2", dataUnit: "GB", days: 4, dataGB: 2, deltaPrice: 0, tag: "4 NGAY", subtitle: "Goi linh hoat", quickTags: ["cheap"] },
  { idSuffix: "mock-4gb-5d", data: "4", dataUnit: "GB", days: 5, dataGB: 4, deltaPrice: 20000, tag: "5 NGAY", subtitle: "Du dung du lich ngan", quickTags: ["cheap", "hotspot"] },
  { idSuffix: "mock-6gb-7d", data: "6", dataUnit: "GB", days: 7, dataGB: 6, deltaPrice: 45000, tag: "7 NGAY", subtitle: "Pho bien nhat", quickTags: ["bestseller", "5g", "hotspot"] },
  { idSuffix: "mock-8gb-8d", data: "8", dataUnit: "GB", days: 8, dataGB: 8, deltaPrice: 65000, tag: "8 NGAY", subtitle: "Lich trinh tu tuc", quickTags: ["5g", "hotspot"] },
  { idSuffix: "mock-12gb-10d", data: "12", dataUnit: "GB", days: 10, dataGB: 12, deltaPrice: 90000, tag: "10 NGAY", subtitle: "Cong tac, du lich dai hon", quickTags: ["5g", "hotspot"] },
  { idSuffix: "mock-15gb-12d", data: "15", dataUnit: "GB", days: 12, dataGB: 15, deltaPrice: 120000, tag: "12 NGAY", subtitle: "Data cao cho nguoi dung nhieu", quickTags: ["5g", "hotspot"] },
  { idSuffix: "mock-20gb-14d", data: "20", dataUnit: "GB", days: 14, dataGB: 20, deltaPrice: 155000, tag: "14 NGAY", subtitle: "Du lich 2 tuan", quickTags: ["5g", "hotspot", "bestseller"] },
  { idSuffix: "mock-25gb-20d", data: "25", dataUnit: "GB", days: 20, dataGB: 25, deltaPrice: 205000, tag: "20 NGAY", subtitle: "Luu tru dai ngay", quickTags: ["5g", "hotspot"] },
  { idSuffix: "mock-30gb-30d", data: "30", dataUnit: "GB", days: 30, dataGB: 30, deltaPrice: 265000, tag: "30 NGAY", subtitle: "Su dung thoai mai 1 thang", quickTags: ["5g", "hotspot", "phone"], tagType: "popular" },
  { idSuffix: "mock-unlimited-15d", data: "∞", dataUnit: "Khong gioi han", days: 15, dataGB: null, deltaPrice: 320000, tag: "UNLIMITED", subtitle: "Toc do cao moi ngay", quickTags: ["unlimited", "hotspot", "5g"], tagType: "unlimited" },
  { idSuffix: "mock-3gb-6d", data: "3", dataUnit: "GB", days: 6, dataGB: 3, deltaPrice: 12000, tag: "6 NGAY", subtitle: "Nhe va tiet kiem", quickTags: ["cheap"] },
  { idSuffix: "mock-7gb-9d", data: "7", dataUnit: "GB", days: 9, dataGB: 7, deltaPrice: 58000, tag: "9 NGAY", subtitle: "Can bang toc do va chi phi", quickTags: ["hotspot", "5g"] },
  { idSuffix: "mock-18gb-18d", data: "18", dataUnit: "GB", days: 18, dataGB: 18, deltaPrice: 165000, tag: "18 NGAY", subtitle: "Phu hop lich trinh dai", quickTags: ["hotspot", "5g", "bestseller"] },
  { idSuffix: "mock-35gb-30d", data: "35", dataUnit: "GB", days: 30, dataGB: 35, deltaPrice: 305000, tag: "30 NGAY", subtitle: "Luong data cao cho 1 thang", quickTags: ["5g", "hotspot", "phone"], tagType: "popular" },
  { idSuffix: "mock-40gb-45d", data: "40", dataUnit: "GB", days: 45, dataGB: 40, deltaPrice: 365000, tag: "45 NGAY", subtitle: "Cong tac va du lich ket hop", quickTags: ["5g", "hotspot"] },
  { idSuffix: "mock-unlimited-30d", data: "∞", dataUnit: "Khong gioi han", days: 30, dataGB: null, deltaPrice: 460000, tag: "UNLIMITED 30", subtitle: "Khong lo het data ca thang", quickTags: ["unlimited", "hotspot", "5g"], tagType: "unlimited" },
];

function createExtraMockPackages(countrySlug: string): EsimPackage[] {
  const basePrice = EXTRA_PACKAGE_BASE_PRICE[countrySlug] ?? 100000;

  return EXTRA_PACKAGE_BLUEPRINTS.map((blueprint, index) => {
    const price = basePrice + blueprint.deltaPrice;
    const oldPrice = Math.round(price * 1.15);

    return buildPackage(countrySlug, {
      idSuffix: blueprint.idSuffix,
      data: blueprint.data,
      dataUnit: blueprint.dataUnit,
      subtitle: blueprint.subtitle,
      tag: blueprint.tag,
      tagType: blueprint.tagType,
      features: [
        "Kich hoat nhanh bang QR",
        "Ho tro hotspot",
        "Mang on dinh tai diem du lich",
        "Ho tro 24/7",
      ],
      price,
      oldPrice,
      discount: "-13%",
      days: blueprint.days,
      dataGB: blueprint.dataGB,
      quickTags: blueprint.quickTags,
      rating: 4.6 + (index % 4) * 0.1,
      salesCount: 900 + index * 210,
      featured: index === 2 || index === 6,
      featuredLabel: index === 2 ? "GOI DE XUAT" : index === 6 ? "DUNG LUONG CAO" : undefined,
    });
  });
}

const ONE_GB_DAY_STEPS = [1, 2, 3, 5, 7, 10, 15, 20, 30, 45, 60, 90, 120, 180, 365];

function createOneGbTimelinePackages(countrySlug: string): EsimPackage[] {
  const basePrice = Math.max(39000, Math.round((EXTRA_PACKAGE_BASE_PRICE[countrySlug] ?? 100000) * 0.45));

  const oneGbPackages = ONE_GB_DAY_STEPS.map((days, index) => {
    const price = basePrice + days * 3500 + index * 1500;
    const oldPrice = Math.round(price * 1.12);

    return buildPackage(countrySlug, {
      idSuffix: `mock-1gb-${days}d`,
      data: "1",
      dataUnit: "GB",
      subtitle: `Goi 1GB trong ${days} ngay`,
      tag: `${days} NGAY`,
      features: [
        "1GB toc do cao",
        "Kich hoat QR nhanh",
        "Du dung map, chat, web",
        "Ho tro 24/7",
      ],
      price,
      oldPrice,
      discount: "-10%",
      days,
      dataGB: 1,
      quickTags: days <= 7 ? ["cheap"] : ["cheap", "hotspot"],
      rating: 4.5 + (index % 5) * 0.08,
      salesCount: 1200 + index * 170,
      featured: days === 30,
      featuredLabel: days === 30 ? "GOI 1GB PHO BIEN" : undefined,
    });
  });

  const unlimitedDurationOneGb = buildPackage(countrySlug, {
    idSuffix: "mock-1gb-unlimited-duration",
    data: "1",
    dataUnit: "GB",
    subtitle: "1GB moi ngay, thoi han vo han",
    tag: "VO HAN",
    tagType: "unlimited",
    features: [
      "Moi ngay 1GB toc do cao",
      "Het 1GB van tiep tuc dung duoc",
      "Phu hop su dung lau dai",
      "Ho tro hotspot",
    ],
    price: basePrice + 699000,
    oldPrice: basePrice + 769000,
    discount: "-9%",
    days: 9999,
    dataGB: 1,
    quickTags: ["unlimited", "hotspot"],
    rating: 4.9,
    salesCount: 980,
    featured: true,
    featuredLabel: "1GB VO HAN",
  });

  return [...oneGbPackages, unlimitedDurationOneGb];
}

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
        idSuffix: "1gb-1d",
        data: "1",
        dataUnit: "GB",
        subtitle: "Đi trong ngày, tiết kiệm",
        tag: "1 NGÀY",
        features: ["Mạng 4G ổn định", "Dùng map và chat cơ bản", "Nhận QR ngay", "Kích hoạt nhanh"],
        price: 29000,
        oldPrice: 39000,
        days: 1,
        dataGB: 1,
        quickTags: ["cheap"],
        rating: 4.6,
        salesCount: 2360,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "2gb-2d",
        data: "2",
        dataUnit: "GB",
        subtitle: "Chuyến đi ngắn cuối tuần",
        tag: "2 NGÀY",
        features: ["Mạng 4G/5G linh hoạt", "Đủ dùng MXH, bản đồ", "Hỗ trợ hotspot", "Không cần đổi SIM vật lý"],
        price: 49000,
        oldPrice: 59000,
        days: 2,
        dataGB: 2,
        quickTags: ["cheap", "hotspot"],
        rating: 4.7,
        salesCount: 3520,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "3gb-3d",
        data: "3",
        dataUnit: "GB",
        subtitle: "Du lịch ngắn 2-3 ngày",
        tag: "3 NGÀY",
        features: ["Mạng SoftBank ổn định", "Gọi video nhẹ mượt", "Có hotspot", "Dễ cài đặt"],
        price: 69000,
        oldPrice: 79000,
        days: 3,
        dataGB: 3,
        quickTags: ["cheap", "hotspot"],
        rating: 4.7,
        salesCount: 4980,
      }),
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
        idSuffix: "5gb-16d",
        data: "5",
        dataUnit: "GB",
        subtitle: "Lịch trình dài hơn, ưu tiên tiết kiệm",
        tag: "16 NGÀY",
        features: ["Mạng 4G/5G ổn định", "Duy trì kết nối lâu dài", "Có thể chia sẻ hotspot", "Phù hợp đi dài ngày"],
        price: 139000,
        oldPrice: 169000,
        days: 16,
        dataGB: 5,
        quickTags: ["hotspot"],
        rating: 4.8,
        salesCount: 1880,
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
        idSuffix: "10gb-30d",
        data: "10",
        dataUnit: "GB",
        subtitle: "Ở lâu, vẫn cần tốc độ cao",
        tag: "30 NGÀY",
        features: ["Mạng 5G/4G LTE", "Dùng ổn định 1 tháng", "Có hotspot", "Phù hợp công tác dài ngày"],
        price: 249000,
        oldPrice: 289000,
        days: 30,
        dataGB: 10,
        quickTags: ["5g", "hotspot"],
        rating: 4.8,
        salesCount: 2310,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "20gb-30d",
        data: "20",
        dataUnit: "GB",
        subtitle: "Data lớn cho 1 tháng trọn vẹn",
        tag: "30 NGÀY",
        features: ["20GB tốc độ cao", "Mạng 5G ổn định", "Chia sẻ hotspot thoải mái", "Phù hợp du học ngắn hạn"],
        price: 359000,
        oldPrice: 419000,
        days: 30,
        dataGB: 20,
        quickTags: ["5g", "hotspot"],
        rating: 4.9,
        salesCount: 1740,
      }),
      buildPackage("nhat-ban", {
        idSuffix: "unlimited-30d",
        data: "∞",
        dataUnit: "Không giới hạn",
        subtitle: "Lưu trú dài ngày, dùng không lo hết data",
        tag: "⭐ UNLIMITED",
        tagType: "unlimited",
        features: ["3GB tốc độ cao/ngày", "Sau đó giảm tốc vẫn dùng", "Hotspot ổn định", "Phù hợp công việc di động"],
        price: 599000,
        oldPrice: 699000,
        days: 30,
        dataGB: null,
        quickTags: ["unlimited", "5g", "hotspot"],
        rating: 4.9,
        salesCount: 980,
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
    region: "Châu Âu",
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

const countriesWithExtraPackages: EsimCountryDetail[] = countries.map((country) => ({
  ...country,
  packages: [
    ...country.packages,
    ...createExtraMockPackages(country.slug),
    ...createOneGbTimelinePackages(country.slug),
  ],
}));

export async function getEsimCountries(): Promise<EsimCountrySummary[]> {
  return countriesWithExtraPackages.map((country) => ({
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
  return countriesWithExtraPackages.find((country) => country.slug === slug) ?? null;
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
