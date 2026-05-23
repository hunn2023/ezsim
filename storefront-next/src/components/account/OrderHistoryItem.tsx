"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { OrderHistoryItem as OrderHistoryItemType, OrderStatus, OrderPaymentMethod } from "@/lib/orderApi";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: "Chờ xác nhận", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed:  { label: "Đã xác nhận",  className: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "Đang xử lý",   className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  shipped:    { label: "Đang giao",     className: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered:  { label: "Đã giao",      className: "bg-green-50 text-green-700 border-green-200" },
  cancelled:  { label: "Đã hủy",       className: "bg-red-50 text-red-700 border-red-200" },
  refunded:   { label: "Hoàn tiền",    className: "bg-orange-50 text-orange-700 border-orange-200" },
};

const PAYMENT_LABELS: Record<OrderPaymentMethod, string> = {
  cod:     "COD",
  banking: "Chuyển khoản",
  momo:    "MoMo",
  vnpay:   "VNPay",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

interface Props {
  order: OrderHistoryItemType;
}

export default function OrderHistoryItem({ order }: Props) {
  const status = STATUS_CONFIG[order.status];
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full shrink-0">
            #{order.orderCode}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
            <Icon icon="clock" className="text-[10px]" />
            {formatDate(order.createdAt)}
          </span>
        </div>
        <span
          className={`text-[11px] font-semibold border px-2.5 py-1 rounded-full whitespace-nowrap ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Items preview */}
      <div className="px-5 py-3.5 border-b border-gray-50">
        <p className="text-sm text-navy font-medium line-clamp-1">
          {firstItem.name}
          {firstItem.quantity > 1 && (
            <span className="text-gray-400 font-normal ml-1">x{firstItem.quantity}</span>
          )}
        </p>
        {extraCount > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            + {extraCount} sản phẩm khác
          </p>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between px-5 py-3.5 gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Icon icon="credit-card" className="text-gray-400 text-[10px]" />
            {PAYMENT_LABELS[order.paymentMethod]}
          </span>
          <span className="text-navy font-bold text-sm">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition shrink-0"
        >
          Xem chi tiết
          <Icon icon="chevron-right" className="text-[10px]" />
        </Link>
      </div>
    </article>
  );
}
