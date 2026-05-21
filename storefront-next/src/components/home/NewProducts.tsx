import Link from "next/link";
import Icon from "@/components/ui/Icon";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
}

const mockNewProducts: Product[] = [
  { id: "n1", name: "eSIM Úc 10 ngày - 4GB/ngày", slug: "esim-uc-10-ngay", image: "https://picsum.photos/seed/esim-aus/400/300", price: 249000, category: "eSIM Du lịch" },
  { id: "n2", name: "Thẻ Vinaphone 200K", slug: "the-vinaphone-200k", image: "https://picsum.photos/seed/vinaphone/400/300", price: 190000, category: "Thẻ Viễn thông" },
  { id: "n3", name: "eSIM Châu Âu 15 ngày - 5GB/ngày", slug: "esim-chau-au-15-ngay", image: "https://picsum.photos/seed/esim-eu/400/300", price: 399000, category: "eSIM Du lịch" },
  { id: "n4", name: "Thẻ Game Steam 500K", slug: "the-steam-500k", image: "https://picsum.photos/seed/steam/400/300", price: 475000, category: "Thẻ Game" },
];

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function NewProducts() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2>Sản phẩm mới</h2>
          <Link href="/products?sort=newest" className="text-primary text-sm font-semibold hover:underline">
            Xem tất cả <Icon icon="arrow-right" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {mockNewProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="product-card">
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="product-card-img bg-gray-100"
                />
                <span className="absolute top-2 left-2 bg-success text-white text-xs font-bold px-2 py-0.5 rounded">
                  Mới
                </span>
              </div>
              <div className="product-card-body">
                <span className="text-xs text-gray-500 mb-1">{p.category}</span>
                <h3 className="product-card-title">{p.name}</h3>
                <span className="product-card-price">{formatPrice(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
