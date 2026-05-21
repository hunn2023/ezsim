"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration loading
  if (!mounted) {
    return (
      <>
        <Breadcrumb items={[{ label: "Đặt hàng thành công" }]} />
        <section className="max-w-container mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse space-y-4 text-center">
            <div className="h-24 bg-gray-100 rounded-full mx-auto w-24" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
            <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Đặt hàng thành công" }]} />

      <section className="max-w-container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto">
              <Icon icon="check" className="text-4xl text-success" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">
            Đặt hàng thành công!
          </h1>

          {/* Order ID */}
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Mã đơn hàng: <span className="font-semibold text-navy">{orderId}</span>
            </p>
          )}

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.
            Bạn sẽ nhận được thông báo qua SMS/Email khi đơn hàng được giao.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="btn-primary w-full inline-flex items-center justify-center"
            >
              Tiếp tục mua hàng
            </Link>

            {orderId && (
              <Link
                href={`/orders/${orderId}`}
                className="btn-outline w-full inline-flex items-center justify-center"
              >
                Xem chi tiết đơn hàng
              </Link>
            )}
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 rounded-xl bg-gray-50 text-sm text-gray-500">
            <p className="font-medium text-navy mb-2">Cần hỗ trợ?</p>
            <p>
              Hotline: <span className="text-primary font-semibold">1900-xxxx</span>
              <br />
              Email: <span className="text-primary font-semibold">support@ezsim.vn</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}