"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { formatPrice } from "@/lib/product";

export default function CartSummary() {
  const totalAmount = useCartStore((s) => s.getTotalAmount());
  const totalQuantity = useCartStore((s) => s.getTotalQuantity());

  const shippingFee = 0; // Free ship placeholder
  const grandTotal = totalAmount + shippingFee;

  return (
    <div className="bg-gray-50 rounded-xl p-5 md:p-6 space-y-4 sticky top-28">
      <h2 className="text-lg font-bold text-navy">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Tạm tính ({totalQuantity} sản phẩm)</span>
          <span className="font-medium text-navy">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span className="font-medium text-success">Miễn phí</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-semibold text-navy">Tổng cộng</span>
          <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="btn-primary w-full btn-lg mt-4 text-center"
      >
        Thanh toán
      </Link>

      <Link
        href="/esim-du-lich"
        className="block text-center text-sm text-gray-500 hover:text-primary transition mt-2"
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  );
}
