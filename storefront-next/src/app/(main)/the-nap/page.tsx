import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui";
import {
  PageHeader,
  TabSwitcher,
  CardMarketplaceBrowser,
} from "@/components/the-nap";
import { getCardMarketplaceContent } from "@/lib/api/cardMarketplaceApi";
import type { CardMarketplaceTab } from "@/types/cardMarketplace";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Mua thẻ Viễn thông & Thẻ Game online - Chiết khấu cao | EZSIM",
  description:
    "Nạp tiền điện thoại tất cả nhà mạng, mua thẻ game Garena, Zing, Steam, Vcoin... Chiết khấu cao - Nhận mã trong 30 giây.",
};

type Tab = "telecom" | "game" | "data" | "promo";

const TAB_ICONS: Record<Tab, "credit-card" | "gamepad" | "wifi" | "fire"> = {
  telecom: "credit-card",
  game: "gamepad",
  data: "wifi",
  promo: "fire",
};

export default async function TheNapPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = (["telecom", "game", "data", "promo"] as const).includes(rawTab as Tab)
    ? (rawTab as Tab)
    : "telecom";

  const content = await getCardMarketplaceContent(tab as CardMarketplaceTab);

  return (
    <>
      <Breadcrumb items={[{ label: content.breadcrumb }]} />
      <PageHeader
        title={content.pageTitle}
        subtitle={content.pageSubtitle}
        titleIcon={TAB_ICONS[tab]}
      />
      <Suspense fallback={<div className="h-[57px] bg-white border-b border-gray-200" />}>
        <TabSwitcher />
      </Suspense>

      <div className="max-w-container mx-auto px-4 md:px-6" style={{ paddingTop: "32px", paddingBottom: "32px" }}>
        <CardMarketplaceBrowser content={content} />
      </div>
    </>
  );
}
