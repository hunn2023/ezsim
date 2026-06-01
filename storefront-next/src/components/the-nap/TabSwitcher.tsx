"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@fortawesome/fontawesome-svg-core";
import { getCardTabCounts } from "@/lib/api/cardMarketplaceApi";

export type CardTab = "telecom" | "game" | "data" | "promo";

interface TabConfig {
  key: CardTab;
  label: string;
  icon: IconName;
  count: number;
}

const counts = getCardTabCounts();

const tabs: TabConfig[] = [
  { key: "telecom", label: "Thẻ Viễn thông", icon: "sim-card", count: counts.telecom },
  { key: "game", label: "Thẻ Game", icon: "gamepad", count: counts.game },
  { key: "data", label: "Data 4G/5G", icon: "wifi", count: counts.data },
  { key: "promo", label: "Khuyến mãi", icon: "fire", count: counts.promo },
];

export default function TabSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as CardTab) || "telecom";

  return (
    <div className="bg-white border-b border-gray-200 sticky z-50" style={{ top: "64px" }}>
      <div className="max-w-container mx-auto px-4 md:px-6 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const active = currentTab === tab.key;
          const href = `${pathname}?tab=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              scroll={false}
              className={`font-semibold flex items-center gap-2 transition no-underline whitespace-nowrap ${
                active ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
              style={{
                padding: "16px 24px",
                fontSize: "14px",
                borderBottom: active ? "3px solid #0066FF" : "3px solid transparent",
                marginBottom: "-1px",
              }}
            >
              <Icon icon={tab.icon} /> {tab.label}
              <span
                className="font-bold"
                style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  background: active ? "#0066FF" : "#F1F5F9",
                  color: active ? "white" : "#334155",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
