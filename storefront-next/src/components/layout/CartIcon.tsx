"use client";

import Icon from "@/components/ui/Icon";
import Link from "next/link";

export default function CartIcon({ count = 0 }: { count?: number }) {
  return (
    <Link
      href="/gio-hang"
      className="relative w-10 h-10 rounded-[10px] bg-gray-100 flex items-center justify-center text-navy hover:bg-primary/10 transition"
      aria-label={`Giỏ hàng (${count} sản phẩm)`}
    >
      <Icon icon="shopping-cart" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white w-[18px] h-[18px] rounded-full text-[11px] font-bold flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
