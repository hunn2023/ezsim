"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  // Hydration guard: chờ client mount xong mới render cart content
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <>
        <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
        <section className="max-w-container mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-24 bg-gray-100 rounded-xl" />
            <div className="h-24 bg-gray-100 rounded-xl" />
          </div>
        </section>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
        <section className="max-w-container mx-auto px-4 md:px-6 py-16 text-center">
          <Icon icon="shopping-cart" className="text-6xl text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-navy mb-3">Giỏ hàng trống</h1>
          <p className="text-gray-500 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>
          <Link href="/esim-du-lich" className="btn-primary">
            Tiếp tục mua hàng
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} />

      <section className="max-w-container mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-navy">
            Giỏ hàng ({items.length} sản phẩm)
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-danger transition"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </section>
    </>
  );
}
