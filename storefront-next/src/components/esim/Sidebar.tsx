"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

const dayOptions = ["3 ngày", "7 ngày", "10 ngày", "15 ngày", "30 ngày"];

const dataOptions = [
  { label: "1 - 3 GB", count: 3 },
  { label: "5 GB", count: 4, checked: true },
  { label: "10 GB", count: 3, checked: true },
  { label: "20 GB", count: 2 },
  { label: "Không giới hạn", count: 2 },
];

const featureOptions = [
  { label: "Hỗ trợ Hotspot", count: 9, checked: true },
  { label: "5G", count: 6 },
  { label: "Có SĐT gọi", count: 3 },
];

export default function Sidebar() {
  const [activeDay, setActiveDay] = useState("7 ngày");

  return (
    <aside className="bg-white rounded-2xl p-6 border border-gray-200 h-fit sticky top-[120px]">
      <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
        <Icon icon="filter" /> Lọc gói
      </h3>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="font-bold text-sm mb-3">Số ngày sử dụng</div>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 border-[1.5px] rounded-full text-xs cursor-pointer font-medium transition ${
                activeDay === d
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="font-bold text-sm mb-3">Dung lượng data</div>
        <div className="flex flex-col gap-2.5">
          {dataOptions.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked={opt.checked} className="w-4 h-4 accent-primary" />
              {opt.label}
              <span className="ml-auto text-gray-500 text-xs">{opt.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="font-bold text-sm mb-3">Khoảng giá (VNĐ)</div>
        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="Từ" defaultValue="50.000" className="flex-1 py-2 px-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-sans" />
          <input type="text" placeholder="Đến" defaultValue="500.000" className="flex-1 py-2 px-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-sans" />
        </div>
      </div>

      <div className="mb-6">
        <div className="font-bold text-sm mb-3">Tính năng</div>
        <div className="flex flex-col gap-2.5">
          {featureOptions.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked={opt.checked} className="w-4 h-4 accent-primary" />
              {opt.label}
              <span className="ml-auto text-gray-500 text-xs">{opt.count}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full gradient-primary text-white py-3 rounded-[10px] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
        <Icon icon="check-circle" /> Áp dụng bộ lọc
      </button>
    </aside>
  );
}
