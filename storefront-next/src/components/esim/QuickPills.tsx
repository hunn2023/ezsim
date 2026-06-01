"use client";

import type { EsimPackage, PackageQuickTag } from "@/types/esim";
import { getPackageCountByQuickTag } from "@/lib/api/esimApi";

const pillConfig: Array<{ key: PackageQuickTag | "all"; label: string }> = [
  { key: "all", label: "⚡ Tất cả" },
  { key: "bestseller", label: "🔥 Bán chạy" },
  { key: "cheap", label: "💰 Giá rẻ" },
  { key: "5g", label: "🚀 5G" },
  { key: "unlimited", label: "♾️ Không giới hạn" },
  { key: "phone", label: "📞 Có SĐT gọi" },
];

interface QuickPillsProps {
  packages: EsimPackage[];
  activeTag: PackageQuickTag | "all";
  onSelect: (tag: PackageQuickTag | "all") => void;
}

export default function QuickPills({ packages, activeTag, onSelect }: QuickPillsProps) {
  const counts = getPackageCountByQuickTag(packages);

  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {pillConfig.map((pill) => {
        const isActive = activeTag === pill.key;
        const count = pill.key === "all" ? packages.length : counts[pill.key];

        return (
        <button
          key={pill.key}
          onClick={() => onSelect(pill.key)}
          className={`px-4 py-2 rounded-3xl text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 border-[1.5px] transition ${
            isActive
              ? "bg-primary text-white border-primary"
              : "bg-white text-inherit border-gray-200 hover:border-primary hover:text-primary"
          }`}
        >
          {pill.label}
          <span className={`px-1.5 rounded text-[11px] ${isActive ? "bg-white/25" : "bg-gray-100 text-gray-700"}`}>
            {count}
          </span>
        </button>
        );
      })}
    </div>
  );
}
