"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCartStore } from "@/lib/cartStore";
import { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/product";
import QuantityControl from "./QuantityControl";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
          unoptimized
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            className="text-sm font-semibold text-navy line-clamp-2 hover:text-primary transition"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-danger hover:bg-danger-light transition"
          >
            <FontAwesomeIcon icon={faTrash} className="text-sm" />
          </button>
        </div>

        <p className="text-sm text-primary font-medium mt-1">{formatPrice(item.price)}</p>

        {/* Bottom row: quantity + subtotal */}
        <div className="flex items-center justify-between mt-3">
          <QuantityControl
            productId={item.id}
            quantity={item.quantity}
            stock={item.stock}
          />
          <p className="text-sm font-bold text-navy">{formatPrice(subtotal)}</p>
        </div>
      </div>
    </div>
  );
}
