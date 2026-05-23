import { Suspense } from "react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SuccessCard from "@/components/order-success/SuccessCard";
import OrderSummary from "@/components/order-success/OrderSummary";
import SuccessActions from "@/components/order-success/SuccessActions";

export const metadata: Metadata = {
  title: "Đặt hàng thành công | EZSIM",
  robots: "noindex",
};

type SearchParam = string | string[] | undefined;

function safeString(val: SearchParam): string | undefined {
  if (typeof val !== "string" || val.trim() === "") return undefined;
  return val.trim();
}

function safeTotal(val: SearchParam): number | undefined {
  const s = safeString(val);
  if (!s) return undefined;
  const n = parseFloat(s);
  return isNaN(n) || n < 0 ? undefined : n;
}

interface PageProps {
  searchParams: {
    orderId?: SearchParam;
    orderCode?: SearchParam;
    total?: SearchParam;
    paymentMethod?: SearchParam;
  };
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const orderId = safeString(searchParams.orderId);
  const orderCode = safeString(searchParams.orderCode) ?? orderId;
  const total = safeTotal(searchParams.total);
  const paymentMethod = safeString(searchParams.paymentMethod);

  const hasOrderInfo =
    orderCode !== undefined ||
    total !== undefined ||
    paymentMethod !== undefined;

  return (
    <>
      <Breadcrumb items={[{ label: "Đặt hàng thành công" }]} />
      <main
        className="min-h-[60vh] flex items-center justify-center px-4 py-10 md:py-16"
        aria-label="Trang đặt hàng thành công"
      >
        <Suspense>
          <div className="w-full max-w-lg space-y-3">
            <SuccessCard />
            {hasOrderInfo && (
              <OrderSummary
                orderCode={orderCode}
                total={total}
                paymentMethod={paymentMethod}
              />
            )}
            <SuccessActions />
          </div>
        </Suspense>
      </main>
    </>
  );
}
