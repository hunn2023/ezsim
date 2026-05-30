"use client";

import Icon from "@/components/ui/Icon";
import OrderHistoryItem from "@/components/account/OrderHistoryItem";
import { useOrderHistory } from "@/hooks/useOrderHistory";

// ── Skeleton ─────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex gap-3">
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-6 w-28 bg-gray-100 rounded-full" />
            </div>
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="px-5 py-3.5 border-b border-gray-50">
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon icon="shopping-cart" className="text-gray-300 text-2xl" />
      </div>
      <h3 className="font-semibold text-navy mb-1">Chưa có đơn hàng nào</h3>
      <p className="text-sm text-gray-400">
        Khi bạn đặt hàng, đơn hàng sẽ hiển thị tại đây.
      </p>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 px-6 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
        <Icon icon="times" className="text-danger text-lg" />
      </div>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="btn btn-outline btn-sm"
      >
        Thử lại
      </button>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Trang trước"
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Icon icon="chevron-left" className="text-xs" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`w-9 h-9 rounded-xl border text-sm font-semibold transition ${
            p === page
              ? "gradient-primary text-white border-transparent shadow-sm"
              : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Trang sau"
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Icon icon="chevron-right" className="text-xs" />
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OrderHistoryList() {
  const { orders, isLoading, error, page, totalPages, setPage, refetch } = useOrderHistory();

  return (
    <div>
      {isLoading ? (
        <OrderSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderHistoryItem key={order.id} order={order} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
