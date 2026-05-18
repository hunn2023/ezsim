"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

const tabs: { label: string; icon: IconName; count: number }[] = [
  { label: "Thẻ Viễn thông", icon: "sim-card", count: 4 },
  { label: "Thẻ Game", icon: "gamepad", count: 8 },
  { label: "Data 4G/5G", icon: "wifi", count: 12 },
  { label: "Khuyến mãi", icon: "fire", count: 5 },
];

export default function TabSwitcher() {
  const [active, setActive] = useState(0);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-50">
      <div className="max-w-container mx-auto px-6 flex gap-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`py-4 px-6 font-semibold text-sm cursor-pointer border-b-[3px] -mb-px flex items-center gap-2 transition bg-transparent ${
              active === i ? "text-primary border-primary" : "text-gray-500 border-transparent hover:text-primary"
            }`}
          >
            <Icon icon={tab.icon} /> {tab.label}
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              active === i ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
