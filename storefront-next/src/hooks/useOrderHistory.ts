"use client";

import { useState, useEffect, useCallback } from "react";
import { getMyOrders } from "@/lib/orderApi";
import type { OrderHistoryItem } from "@/lib/orderApi";
import type { Language } from "@/lib/i18n";

interface UseOrderHistoryReturn {
  orders: OrderHistoryItem[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useOrderHistory(language: Language = "vi"): UseOrderHistoryReturn {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (p: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyOrders(p);
      setOrders(result.orders);
      setTotalPages(Math.ceil(result.total / result.pageSize));
    } catch {
      setError(
        language === "vi"
          ? "Không thể tải danh sách đơn hàng. Vui lòng thử lại."
          : "Unable to load order history. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    page,
    totalPages,
    setPage,
    refetch: () => fetchOrders(page),
  };
}
