"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCartStore } from "@/lib/cartStore";

interface Props {
  productId: string;
  quantity: number;
  stock: number;
}

export default function QuantityControl({ productId, quantity, stock }: Props) {
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (isNaN(val)) return;
    updateQuantity(productId, val);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => decreaseQuantity(productId)}
        disabled={quantity <= 1}
        aria-label="Giảm số lượng"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FontAwesomeIcon icon={faMinus} className="text-xs" />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={stock}
        aria-label="Số lượng sản phẩm"
        className="w-12 h-8 text-center border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-primary"
      />
      <button
        type="button"
        onClick={() => increaseQuantity(productId)}
        disabled={quantity >= stock}
        aria-label="Tăng số lượng"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FontAwesomeIcon icon={faPlus} className="text-xs" />
      </button>
    </div>
  );
}
