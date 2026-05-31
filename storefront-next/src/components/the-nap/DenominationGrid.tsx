"use client";

import { useState } from "react";

const denominations = [
  { face: 10000, pay: 9200 },
  { face: 20000, pay: 18400 },
  { face: 30000, pay: 27600 },
  { face: 50000, pay: 46000 },
  { face: 100000, pay: 92000 },
  { face: 200000, pay: 184000 },
  { face: 300000, pay: 276000 },
  { face: 500000, pay: 460000 },
];

export default function DenominationGrid() {
  const [selected, setSelected] = useState(100000);

  return (
    <div className="bg-white rounded-[20px] p-7 border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-5">
        <div className="text-lg font-bold flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ED1C24] flex items-center justify-center text-white font-extrabold text-sm">V</div>
          Mệnh giá thẻ Viettel
        </div>
        <span className="bg-red-100 text-red-800 px-3.5 py-1.5 rounded-lg font-bold text-[13px]">
          Giảm 8% đồng giá
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {denominations.map((d) => (
          <button
            key={d.face}
            onClick={() => setSelected(d.face)}
            className={`bg-white border-2 rounded-xl p-4 text-center cursor-pointer transition ${
              selected === d.face
                ? "border-primary bg-gradient-to-br from-primary/5 to-cyan/5"
                : "border-gray-200 hover:border-primary"
            }`}
          >
            <div className="text-[11px] text-gray-500 mb-1">Mệnh giá</div>
            <div className="text-[22px] font-extrabold text-navy tracking-tight mb-1">
              {d.face.toLocaleString("vi-VN")}đ
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md text-[11px] font-bold inline-block">
              Trả: {d.pay.toLocaleString("vi-VN")}đ
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
