"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Icon from "@/components/ui/Icon";
import { ProductFilter, ProductSort, ProductGrid } from "@/components/product";
import type { Product } from "@/components/product/ProductGrid";

// Mock data — will be replaced by API call
const allProducts: Product[] = [
  { id: "1", name: "eSIM Nhật Bản 7 ngày - 3GB/ngày", slug: "esim-nhat-ban-7-ngay-3gb", image: "https://picsum.photos/seed/esim-japan/400/300", price: 150000, originalPrice: 200000, badge: "-25%", category: "eSIM Du lịch" },
  { id: "2", name: "eSIM Hàn Quốc 5 ngày - Unlimited", slug: "esim-han-quoc-5-ngay", image: "https://picsum.photos/seed/esim-korea/400/300", price: 250000, badge: "Hot", category: "eSIM Du lịch" },
  { id: "3", name: "Thẻ Viettel 100K", slug: "the-viettel-100k", image: "https://picsum.photos/seed/viettel100/400/300", price: 95000, originalPrice: 100000, category: "Thẻ Viễn thông" },
  { id: "4", name: "eSIM Thái Lan 10 ngày - 5GB/ngày", slug: "esim-thai-lan-10-ngay", image: "https://picsum.photos/seed/esim-thai/400/300", price: 320000, category: "eSIM Du lịch" },
  { id: "5", name: "Thẻ Game Garena 200K", slug: "the-game-garena-200k", image: "https://picsum.photos/seed/garena200/400/300", price: 200000, category: "Thẻ Game" },
  { id: "6", name: "eSIM Singapore 3 ngày - Unlimited", slug: "esim-singapore-3-ngay-unlimited", image: "https://picsum.photos/seed/esim-sg/400/300", price: 180000, badge: "Mới", category: "eSIM Du lịch" },
  { id: "7", name: "Data Mobifone 30GB/tháng", slug: "data-mobifone-30gb", image: "https://picsum.photos/seed/mobifone/400/300", price: 77000, originalPrice: 90000, category: "Data 4G/5G" },
  { id: "8", name: "eSIM Đài Loan 7 ngày - Unlimited", slug: "esim-dai-loan-7-ngay", image: "https://picsum.photos/seed/esim-taiwan/400/300", price: 179000, category: "eSIM Du lịch" },
  { id: "9", name: "Thẻ Vinaphone 200K", slug: "the-vinaphone-200k", image: "https://picsum.photos/seed/vinaphone/400/300", price: 190000, category: "Thẻ Viễn thông" },
  { id: "10", name: "Thẻ Game Steam 500K", slug: "the-steam-500k", image: "https://picsum.photos/seed/steam/400/300", price: 475000, category: "Thẻ Game" },
  { id: "11", name: "eSIM Châu Âu 15 ngày - 5GB/ngày", slug: "esim-chau-au-15-ngay", image: "https://picsum.photos/seed/esim-eu/400/300", price: 399000, category: "eSIM Du lịch" },
  { id: "12", name: "eSIM Úc 10 ngày - 4GB/ngày", slug: "esim-uc-10-ngay", image: "https://picsum.photos/seed/esim-aus/400/300", price: 249000, category: "eSIM Du lịch" },
];

const PAGE_SIZE = 9;

const categoryMap: Record<string, string> = {
  esim: "eSIM Du lịch",
  "the-nap": "Thẻ Viễn thông",
  "the-game": "Thẻ Game",
  data: "Data 4G/5G",
};

function ProductsContent() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const minPrice = Number(searchParams.get("minPrice") || "0");
  const maxPrice = Number(searchParams.get("maxPrice") || "0");
  const sort = searchParams.get("sort") || "newest";
  const pageIndex = Number(searchParams.get("pageIndex") || "1");

  // Filter
  let filtered = allProducts.filter((p) => {
    if (keyword && !p.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (categoryId && p.category !== categoryMap[categoryId]) return false;
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice && p.price > maxPrice) return false;
    return true;
  });

  // Sort
  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);

  // Paginate
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const products = filtered.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE);

  return (
    <div className="max-w-container mx-auto px-4 md:px-6 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar defaultValue={keyword} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-[220px] shrink-0">
          <ProductFilter />
        </div>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{filtered.length} sản phẩm</p>
            <ProductSort />
          </div>
          <ProductGrid products={products} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

function SearchBar({ defaultValue }: { defaultValue: string }) {
  return (
    <form action="/products" className="relative max-w-[500px]">
      <Icon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name="keyword"
        defaultValue={defaultValue}
        placeholder="Tìm kiếm sản phẩm..."
        className="input pl-11"
      />
    </form>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
