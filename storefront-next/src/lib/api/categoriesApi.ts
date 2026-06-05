import { Category, Product, PaginatedProducts, ProductQueryParams } from "@/types/product";

const PAGE_SIZE = 9;

const categories: Category[] = [
  {
    id: "1",
    name: "eSIM Du lịch",
    slug: "esim",
    description: "Các gói eSIM du lịch quốc tế, kết nối internet tốc độ cao tại hơn 100 quốc gia. Kích hoạt nhanh, không cần đổi SIM vật lý.",
  },
  {
    id: "2",
    name: "Thẻ Viễn thông",
    slug: "the-nap",
    description: "Thẻ nạp các nhà mạng Viettel, Mobifone, Vinaphone với chiết khấu hấp dẫn. Nạp nhanh, nhận mã tức thì.",
  },
  {
    id: "3",
    name: "Thẻ Game",
    slug: "the-game",
    description: "Thẻ nạp game Garena, Google Play, Steam và nhiều nền tảng khác. Giao dịch an toàn, mã thẻ gửi ngay.",
  },
  {
    id: "4",
    name: "Data 4G/5G",
    slug: "data",
    description: "Gói data 4G/5G tốc độ cao cho các nhà mạng trong nước. Đăng ký dễ dàng, sử dụng ngay.",
  },
];

const allProducts: Product[] = [
  {
    id: "1",
    name: "eSIM Nhật Bản 7 ngày - 3GB/ngày",
    slug: "esim-nhat-ban-7-ngay-3gb",
    image: "https://picsum.photos/seed/esim-japan/400/300",
    price: 150000,
    originalPrice: 200000,
    category: "esim",
    inStock: true,
  },
  {
    id: "2",
    name: "eSIM Hàn Quốc 5 ngày - Unlimited",
    slug: "esim-han-quoc-5-ngay",
    image: "https://picsum.photos/seed/esim-korea/400/300",
    price: 250000,
    originalPrice: 300000,
    category: "esim",
    inStock: true,
    badge: "Hot",
  },
  {
    id: "3",
    name: "eSIM Thái Lan 10 ngày - 5GB/ngày",
    slug: "esim-thai-lan-10-ngay",
    image: "https://picsum.photos/seed/esim-thai/400/300",
    price: 320000,
    category: "esim",
    inStock: true,
  },
  {
    id: "4",
    name: "eSIM Châu Âu 15 ngày - 10GB",
    slug: "esim-chau-au-15-ngay",
    image: "https://picsum.photos/seed/esim-eu/400/300",
    price: 450000,
    originalPrice: 550000,
    category: "esim",
    inStock: true,
  },
  {
    id: "5",
    name: "eSIM Singapore 3 ngày - Unlimited",
    slug: "esim-singapore-3-ngay",
    image: "https://picsum.photos/seed/esim-sg/400/300",
    price: 180000,
    category: "esim",
    inStock: true,
    badge: "Mới",
  },
  {
    id: "6",
    name: "Thẻ Viettel 100K",
    slug: "the-viettel-100k",
    image: "https://picsum.photos/seed/viettel100/400/300",
    price: 95000,
    originalPrice: 100000,
    category: "the-nap",
    inStock: true,
  },
  {
    id: "7",
    name: "Thẻ Mobifone 50K",
    slug: "the-mobifone-50k",
    image: "https://picsum.photos/seed/mobi50/400/300",
    price: 47000,
    originalPrice: 50000,
    category: "the-nap",
    inStock: true,
  },
  {
    id: "8",
    name: "Thẻ Vinaphone 200K",
    slug: "the-vinaphone-200k",
    image: "https://picsum.photos/seed/vina200/400/300",
    price: 190000,
    originalPrice: 200000,
    category: "the-nap",
    inStock: true,
  },
  {
    id: "9",
    name: "Thẻ Viettel 500K",
    slug: "the-viettel-500k",
    image: "https://picsum.photos/seed/viettel500/400/300",
    price: 475000,
    originalPrice: 500000,
    category: "the-nap",
    inStock: false,
  },
  {
    id: "10",
    name: "Data Viettel 30 ngày - 2GB/ngày",
    slug: "data-viettel-30-ngay-2gb",
    image: "https://picsum.photos/seed/data-vt/400/300",
    price: 120000,
    category: "data",
    inStock: true,
  },
  {
    id: "11",
    name: "Data Mobifone 7 ngày - 5GB/ngày",
    slug: "data-mobi-7-ngay-5gb",
    image: "https://picsum.photos/seed/data-mobi/400/300",
    price: 80000,
    originalPrice: 100000,
    category: "data",
    inStock: true,
  },
  {
    id: "12",
    name: "Data Vinaphone 30 ngày - Unlimited",
    slug: "data-vina-30-ngay-unlimited",
    image: "https://picsum.photos/seed/data-vina/400/300",
    price: 200000,
    category: "data",
    inStock: true,
    badge: "Best seller",
  },
];

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // Simulate API: GET /api/categories/{slug}
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categorySlug: string,
  params: ProductQueryParams = {}
): Promise<PaginatedProducts> {
  // Simulate API: GET /api/products?categorySlug={slug}&sort=...&minPrice=...&maxPrice=...&pageIndex=...
  let filtered = allProducts.filter((p) => p.category === categorySlug);

  // Price filter
  if (params.minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(params.maxPrice));
  }

  // Sort
  switch (params.sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    default:
      break;
  }

  // Pagination
  const page = Math.max(1, Number(params.pageIndex) || 1);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const products = filtered.slice(start, start + PAGE_SIZE);

  return { products, totalPages };
}
