"use client";

import { useState } from "react";

const pills = [
  { label: "⚡ Tất cả", count: 12 },
  { label: "🔥 Bán chạy", count: 4 },
  { label: "💰 Giá rẻ", count: 3 },
  { label: "🚀 5G", count: 6 },
  { label: "♾️ Không giới hạn", count: 2 },
  { label: "📞 Có SĐT gọi", count: 3 },
];

export default function QuickPills() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {pills.map((pill, i) => (
        <button
          key={pill.label}
          onClick={() => setActive(i)}
          className={`px-4 py-2 rounded-3xl text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 border-[1.5px] transition ${
            active === i
              ? "bg-primary text-white border-primary"
              : "bg-white text-inherit border-gray-200 hover:border-primary hover:text-primary"
          }`}
        >
          {pill.label}
          <span className={`px-1.5 rounded text-[11px] ${active === i ? "bg-white/25" : "bg-gray-100 text-gray-700"}`}>
            {pill.count}
          </span>
        </button>
      ))}
    </div>
  );
}
