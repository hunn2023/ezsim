"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/hooks/useAuth";
import AccountSkeleton from "@/components/account/AccountSkeleton";
import AccountInfo from "@/components/account/AccountInfo";
import OrderHistoryList from "@/components/account/OrderHistoryList";

export default function OrdersPage() {
  const { initialized, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login?returnUrl=/account/orders");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized || !isAuthenticated) {
    return <AccountSkeleton />;
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 px-4 py-10 md:py-14 overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/4 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl"
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/account"
              className="text-xs text-gray-400 hover:text-primary transition flex items-center gap-1"
            >
              <Icon icon="chevron-left" className="text-[10px]" />
              Tài khoản
            </Link>
          </div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Cổng thành viên
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-navy leading-tight">
            Lịch sử đơn hàng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem và theo dõi tất cả các đơn hàng của bạn
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: profile summary */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <AccountInfo />
          </div>

          {/* Right: order list */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8">
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon icon="list" className="text-white text-xs" />
                </div>
                <div>
                  <h2 className="font-bold text-navy text-base leading-tight">
                    Đơn hàng của tôi
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Danh sách các đơn hàng đã đặt
                  </p>
                </div>
              </div>

              <OrderHistoryList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
