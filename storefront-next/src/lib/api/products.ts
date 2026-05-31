import { Product, ProductDetail } from "@/types/product";

const productDetails: ProductDetail[] = [
  {
    id: "1",
    name: "eSIM Nhật Bản 7 ngày - 3GB/ngày",
    slug: "esim-nhat-ban-7-ngay-3gb",
    image: "https://picsum.photos/seed/esim-japan/600/600",
    images: [
      "https://picsum.photos/seed/esim-japan/600/600",
      "https://picsum.photos/seed/esim-japan-2/600/600",
      "https://picsum.photos/seed/esim-japan-3/600/600",
      "https://picsum.photos/seed/esim-japan-4/600/600",
    ],
    sku: "ESIM-JP-7D-3GB",
    price: 200000,
    salePrice: 150000,
    originalPrice: 200000,
    stock: 50,
    category: "eSIM Du lịch",
    categoryId: "esim",
    inStock: true,
    badge: "-25%",
    description: "Gói eSIM du lịch Nhật Bản 7 ngày với 3GB data tốc độ cao mỗi ngày. Kích hoạt tức thì, không cần đổi SIM.",
    longDescription: "Trải nghiệm kết nối internet tốc độ cao tại Nhật Bản với gói eSIM 7 ngày. Mỗi ngày bạn được sử dụng 3GB data 4G/LTE tốc độ cao, sau đó giảm tốc độ xuống 128Kbps. Hỗ trợ tất cả các thiết bị tương thích eSIM. Kích hoạt đơn giản qua QR code, không cần đổi SIM vật lý. Phủ sóng toàn bộ lãnh thổ Nhật Bản bao gồm Tokyo, Osaka, Kyoto và các vùng nông thôn.",
  },
  {
    id: "2",
    name: "eSIM Hàn Quốc 5 ngày - Unlimited",
    slug: "esim-han-quoc-5-ngay",
    image: "https://picsum.photos/seed/esim-korea/600/600",
    images: [
      "https://picsum.photos/seed/esim-korea/600/600",
      "https://picsum.photos/seed/esim-korea-2/600/600",
      "https://picsum.photos/seed/esim-korea-3/600/600",
    ],
    sku: "ESIM-KR-5D-UNL",
    price: 250000,
    stock: 30,
    category: "eSIM Du lịch",
    categoryId: "esim",
    inStock: true,
    badge: "Hot",
    description: "Data không giới hạn tại Hàn Quốc trong 5 ngày. Tốc độ 4G LTE ổn định, phủ sóng toàn quốc.",
    longDescription: "Gói eSIM Hàn Quốc 5 ngày Unlimited mang đến trải nghiệm internet không giới hạn. Sử dụng mạng 4G LTE của SK Telecom - nhà mạng lớn nhất Hàn Quốc. Phù hợp cho du lịch, công tác, livestream và sử dụng bản đồ. Kích hoạt ngay khi quét QR code tại sân bay.",
  },
  {
    id: "3",
    name: "Thẻ Viettel 100K",
    slug: "the-viettel-100k",
    image: "https://picsum.photos/seed/viettel100/600/600",
    images: [
      "https://picsum.photos/seed/viettel100/600/600",
      "https://picsum.photos/seed/viettel100-2/600/600",
    ],
    sku: "VTT-100K",
    price: 100000,
    salePrice: 95000,
    originalPrice: 100000,
    stock: 200,
    category: "Thẻ Viễn thông",
    categoryId: "the-nap",
    inStock: true,
    description: "Thẻ nạp Viettel mệnh giá 100.000đ. Nhận mã thẻ ngay sau khi thanh toán.",
    longDescription: "Thẻ nạp Viettel mệnh giá 100.000đ dùng để nạp tiền vào tài khoản di động Viettel. Mã thẻ được gửi tức thì qua email và SMS sau khi thanh toán thành công. Có thể sử dụng để nạp cho bất kỳ số thuê bao Viettel nào.",
  },
  {
    id: "4",
    name: "eSIM Thái Lan 10 ngày - 5GB/ngày",
    slug: "esim-thai-lan-10-ngay",
    image: "https://picsum.photos/seed/esim-thai/600/600",
    images: [
      "https://picsum.photos/seed/esim-thai/600/600",
      "https://picsum.photos/seed/esim-thai-2/600/600",
      "https://picsum.photos/seed/esim-thai-3/600/600",
    ],
    sku: "ESIM-TH-10D-5GB",
    price: 320000,
    stock: 0,
    category: "eSIM Du lịch",
    categoryId: "esim",
    inStock: false,
    description: "Gói eSIM Thái Lan 10 ngày, 5GB data mỗi ngày. Phủ sóng Bangkok, Phuket, Chiang Mai.",
    longDescription: "Khám phá Thái Lan với gói eSIM 10 ngày - 5GB/ngày. Tốc độ 4G LTE ổn định trên mạng AIS và DTAC. Phủ sóng toàn bộ các điểm du lịch nổi tiếng: Bangkok, Phuket, Chiang Mai, Pattaya. Hỗ trợ hotspot chia sẻ.",
  },
  {
    id: "5",
    name: "Thẻ Game Garena 200K",
    slug: "the-game-garena-200k",
    image: "https://picsum.photos/seed/garena200/600/600",
    images: [
      "https://picsum.photos/seed/garena200/600/600",
      "https://picsum.photos/seed/garena200-2/600/600",
    ],
    sku: "GRN-200K",
    price: 200000,
    stock: 0,
    category: "Thẻ Game",
    categoryId: "the-game",
    inStock: false,
    description: "Thẻ nạp Garena 200K dùng cho Liên Quân Mobile, Free Fire và các game Garena khác.",
    longDescription: "Thẻ Garena mệnh giá 200.000đ. Sử dụng để nạp Garena Shells, dùng trong Liên Quân Mobile, Free Fire, FIFA Online 4 và tất cả game trên nền tảng Garena. Mã thẻ gửi ngay sau thanh toán.",
  },
];

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  await new Promise((r) => setTimeout(r, 100));
  return productDetails.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string
): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 100));
  return productDetails
    .filter((p) => p.categoryId === categoryId && p.id !== excludeId)
    .slice(0, 4)
    .map(({ images, sku, salePrice, stock, categoryId, longDescription, ...product }) => product);
}
