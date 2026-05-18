"use client";

import { useState } from "react";

interface Provider {
  name: string;
  letter: string;
  bg: string;
  discount: string;
}

const telecom: Provider[] = [
  { name: "Viettel", letter: "V", bg: "bg-[#ED1C24]", discount: "Chiết khấu 8%" },
  { name: "Vinaphone", letter: "V", bg: "bg-[#0066B2]", discount: "Chiết khấu 7%" },
  { name: "Mobifone", letter: "M", bg: "bg-[#E40520]", discount: "Chiết khấu 7%" },
  { name: "Vietnamobile", letter: "V", bg: "bg-[#FFA500]", discount: "Chiết khấu 10%" },
];

const games: Provider[] = [
  { name: "Garena", letter: "G", bg: "bg-[#FF7700]", discount: "Chiết khấu 10%" },
  { name: "Zing", letter: "Z", bg: "bg-[#006FE6]", discount: "Chiết khấu 12%" },
  { name: "Vcoin (VTC)", letter: "V", bg: "bg-[#DC2626]", discount: "Chiết khấu 10%" },
  { name: "Gate", letter: "G", bg: "bg-[#00A651]", discount: "Chiết khấu 11%" },
  { name: "Steam Wallet", letter: "S", bg: "bg-[#1B2838]", discount: "Chiết khấu 5%" },
  { name: "Riot (LoL)", letter: "R", bg: "bg-[#D13639]", discount: "Chiết khấu 7%" },
  { name: "MyCard", letter: "M", bg: "bg-[#F5C518]", discount: "Chiết khấu 8%" },
  { name: "BIT", letter: "B", bg: "bg-[#7C3AED]", discount: "Chiết khấu 13%" },
];

export default function ProviderGrid({ onSelect }: { onSelect?: (name: string) => void }) {
  const [selected, setSelected] = useState("Viettel");

  const handleSelect = (name: string) => {
    setSelected(name);
    onSelect?.(name);
  };

  const renderCard = (p: Provider) => (
    <button
      key={p.name}
      onClick={() => handleSelect(p.name)}
      className={`bg-white rounded-2xl border-2 p-6 text-center cursor-pointer transition relative ${
        selected === p.name
          ? "border-primary bg-primary/[0.04]"
          : "border-gray-200 hover:border-primary hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {selected === p.name && (
        <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-extrabold">✓</span>
      )}
      <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-[28px] font-extrabold text-white ${p.bg}`}>
        {p.letter}
      </div>
      <div className="font-bold text-[15px] mb-1">{p.name}</div>
      <div className="text-red-600 text-xs font-bold">{p.discount}</div>
    </button>
  );

  return (
    <div>
      <h3 className="text-base mb-3 text-gray-700">📱 Nhà mạng viễn thông</h3>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {telecom.map(renderCard)}
      </div>
      <h3 className="text-base mb-3 text-gray-700">🎮 Thẻ game phổ biến</h3>
      <div className="grid grid-cols-4 gap-4">
        {games.map(renderCard)}
      </div>
    </div>
  );
}
