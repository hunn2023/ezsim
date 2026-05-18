import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import {
  PageHeader,
  TabSwitcher,
  ProviderGrid,
  DenominationGrid,
  CheckoutSection,
  InfoRow,
  HowToBuy,
} from "@/components/the-nap";

export const metadata: Metadata = {
  title: "Mua thẻ Viễn thông & Thẻ Game online - Chiết khấu cao | EZSIM",
};

export default function TheNapPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Mua thẻ Viễn thông & Thẻ Game" }]} />
      <PageHeader />
      <TabSwitcher />
      <div className="max-w-container mx-auto px-6 py-8">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-2.5">
          <div className="w-1 h-6 gradient-primary rounded-sm" />
          Bước 1: Chọn nhà mạng / nhà cung cấp
        </h2>
        <p className="text-gray-500 text-sm mb-5">Tất cả nhà mạng & game hot tại Việt Nam đều có ở đây</p>
        <ProviderGrid />

        <h2 className="text-2xl font-extrabold tracking-tight mt-10 mb-2 flex items-center gap-2.5">
          <div className="w-1 h-6 gradient-primary rounded-sm" />
          Bước 2: Chọn mệnh giá thẻ Viettel
        </h2>
        <p className="text-gray-500 text-sm mb-5">Bạn được giảm giá ngay khi mua - giá thanh toán đã bao gồm chiết khấu 8%</p>
        <DenominationGrid />

        <h2 className="text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2.5">
          <div className="w-1 h-6 gradient-primary rounded-sm" />
          Bước 3: Hoàn tất đơn hàng
        </h2>
        <CheckoutSection />

        <InfoRow />
        <HowToBuy />
      </div>
    </>
  );
}
