"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { getDataRangeForPackage } from "@/lib/api/esimApi";
import type { EsimDataRange, EsimPackage, PackageQuickTag } from "@/types/esim";

const dataRangeLabels: Record<EsimDataRange, string> = {
  "1-3": "1 - 3 GB",
  "5": "5 GB",
  "10": "10 GB",
  "20": "20 GB trở lên",
  unlimited: "Không giới hạn",
};

const featureLabels: Array<{ key: PackageQuickTag; label: string }> = [
  { key: "hotspot", label: "Hỗ trợ Hotspot" },
  { key: "5g", label: "5G" },
  { key: "phone", label: "Có SĐT gọi" },
];

interface SidebarFilters {
  days: number[];
  dataRanges: EsimDataRange[];
  featureTags: PackageQuickTag[];
  minPrice?: number;
  maxPrice?: number;
}

interface SidebarProps {
  packages: EsimPackage[];
  appliedFilters: SidebarFilters;
  onApply: (filters: SidebarFilters) => void;
  onReset: () => void;
}

export default function Sidebar({ packages, appliedFilters, onApply, onReset }: SidebarProps) {
  const [days, setDays] = useState<number[]>(appliedFilters.days);
  const [dataRanges, setDataRanges] = useState<EsimDataRange[]>(appliedFilters.dataRanges);
  const [featureTags, setFeatureTags] = useState<PackageQuickTag[]>(appliedFilters.featureTags);
  const [minPrice, setMinPrice] = useState(appliedFilters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(appliedFilters.maxPrice?.toString() ?? "");

  useEffect(() => {
    setDays(appliedFilters.days);
    setDataRanges(appliedFilters.dataRanges);
    setFeatureTags(appliedFilters.featureTags);
    setMinPrice(appliedFilters.minPrice?.toString() ?? "");
    setMaxPrice(appliedFilters.maxPrice?.toString() ?? "");
  }, [appliedFilters]);

  const dayOptions = useMemo(
    () => Array.from(new Set(packages.map((pkg) => pkg.days))).sort((a, b) => a - b),
    [packages]
  );

  const dataOptions = useMemo(() => {
    const counts = packages.reduce<Record<EsimDataRange, number>>(
      (acc, pkg) => {
        acc[getDataRangeForPackage(pkg.dataGB)] += 1;
        return acc;
      },
      { "1-3": 0, "5": 0, "10": 0, "20": 0, unlimited: 0 }
    );

    return (Object.keys(counts) as EsimDataRange[])
      .filter((key) => counts[key] > 0)
      .map((key) => ({ key, label: dataRangeLabels[key], count: counts[key] }));
  }, [packages]);

  const featureOptions = useMemo(
    () => featureLabels.map((feature) => ({
      ...feature,
      count: packages.filter((pkg) => pkg.quickTags?.includes(feature.key)).length,
    })),
    [packages]
  );

  const toggleArrayValue = <T,>(current: T[], value: T) =>
    current.includes(value) ? current.filter((item) => item !== value) : [...current, value];

  const handleApply = () => {
    onApply({
      days,
      dataRanges,
      featureTags,
      minPrice: minPrice ? Number(minPrice.replace(/\D/g, "")) : undefined,
      maxPrice: maxPrice ? Number(maxPrice.replace(/\D/g, "")) : undefined,
    });
  };

  return (
    <aside className="bg-white rounded-2xl p-6 border border-gray-200 h-fit lg:sticky lg:top-[120px]">
      <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
        <Icon icon="filter" /> Lọc gói
      </h3>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="font-bold text-sm mb-3">Số ngày sử dụng</div>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map((day) => (
            <button
              key={day}
              onClick={() => setDays((current) => toggleArrayValue(current, day))}
              className={`px-3 py-1.5 border-[1.5px] rounded-full text-xs cursor-pointer font-medium transition ${
                days.includes(day)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {day} ngày
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="font-bold text-sm mb-3">Dung lượng data</div>
        <div className="flex flex-col gap-2.5">
          {dataOptions.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={dataRanges.includes(opt.key)}
                onChange={() => setDataRanges((current) => toggleArrayValue(current, opt.key))}
                className="w-4 h-4 accent-primary"
              />
              {opt.label}
              <span className="ml-auto text-gray-500 text-xs">{opt.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="font-bold text-sm mb-3">Khoảng giá (VNĐ)</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Từ"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="w-full min-w-0 py-2 px-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-sans"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Đến"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="w-full min-w-0 py-2 px-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-sans"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="font-bold text-sm mb-3">Tính năng</div>
        <div className="flex flex-col gap-2.5">
          {featureOptions.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={featureTags.includes(opt.key)}
                onChange={() => setFeatureTags((current) => toggleArrayValue(current, opt.key))}
                className="w-4 h-4 accent-primary"
              />
              {opt.label}
              <span className="ml-auto text-gray-500 text-xs">{opt.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="w-full gradient-primary text-white py-3 rounded-[10px] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon icon="check-circle" /> Áp dụng bộ lọc
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full bg-gray-50 text-gray-700 py-3 rounded-[10px] font-bold text-sm border border-gray-200 cursor-pointer"
        >
          Xóa bộ lọc
        </button>
      </div>
    </aside>
  );
}
