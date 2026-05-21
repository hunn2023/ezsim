"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  badge?: string;
}

const mockProducts: Product[] = [
  { id: "1", name: "eSIM Nhật Bản 7 ngày - 3GB/ngày", slug: "esim-nhat-ban-7-ngay-3gb", image: "https://picsum.photos/seed/esim-japan/400/300", price: 150000, originalPrice: 200000, badge: "-25%" },
  { id: "2", name: "eSIM Hàn Quốc 5 ngày - Unlimited", slug: "esim-han-quoc-5-ngay", image: "https://picsum.photos/seed/esim-korea/400/300", price: 250000, badge: "Hot" },
  { id: "3", name: "Thẻ Viettel 100K", slug: "the-viettel-100k", image: "https://picsum.photos/seed/viettel100/400/300", price: 95000, originalPrice: 100000 },
  { id: "4", name: "eSIM Thái Lan 10 ngày - 5GB/ngày", slug: "esim-thai-lan-10-ngay", image: "https://picsum.photos/seed/esim-thai/400/300", price: 320000 },
  { id: "5", name: "Thẻ Game Garena 200K", slug: "the-game-garena-200k", image: "https://picsum.photos/seed/garena200/400/300", price: 200000 },
  { id: "6", name: "eSIM Singapore 3 ngày - Unlimited", slug: "esim-singapore-3-ngay-unlimited", image: "https://picsum.photos/seed/esim-sg/400/300", price: 180000, badge: "Mới" },
  { id: "7", name: "Data Mobifone 30GB/tháng", slug: "data-mobifone-30gb", image: "https://picsum.photos/seed/mobifone/400/300", price: 77000, originalPrice: 90000 },
  { id: "8", name: "eSIM Đài Loan 7 ngày - Unlimited", slug: "esim-dai-loan-7-ngay", image: "https://picsum.photos/seed/esim-taiwan/400/300", price: 179000 },
];

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function FeaturedProducts() {
  const handleAddToCart = (product: Product) => {
    // TODO: integrate with cart state
    alert(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2>Sản phẩm nổi bật</h2>
          <Link href="/products" className="text-primary text-sm font-semibold hover:underline">
            Xem tất cả <Icon icon="arrow-right" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map((p) => (
            <div key={p.id} className="product-card">
              <Link href={`/products/${p.slug}`} className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="product-card-img bg-gray-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
                />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-danger text-white text-xs font-bold px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                )}
              </Link>
              <div className="product-card-body">
                <Link href={`/products/${p.slug}`}>
                  <h3 className="product-card-title">{p.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="product-card-price">{formatPrice(p.price)}</span>
                  {p.originalPrice && (
                    <span className="text-gray-400 text-xs line-through">{formatPrice(p.originalPrice)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="btn-primary w-full mt-3 text-xs py-2"
                >
                  <Icon icon="shopping-cart" /> Thêm giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
