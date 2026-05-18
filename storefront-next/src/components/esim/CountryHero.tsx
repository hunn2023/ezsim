export default function CountryHero() {
  const stats = [
    { label: "Nhà mạng", value: "Docomo / SoftBank" },
    { label: "Tốc độ", value: "5G / 4G LTE" },
    { label: "Phủ sóng", value: "99% diện tích" },
    { label: "Hotspot", value: "✅ Hỗ trợ chia sẻ" },
    { label: "Đã bán", value: "38.420 gói" },
  ];

  return (
    <section className="bg-gradient-to-br from-rose-100 to-pink-200 py-12 relative overflow-hidden">
      <div className="max-w-container mx-auto px-6 grid grid-cols-[2fr_1fr] gap-12 items-center relative">
        <div className="flex gap-6 items-center">
          <div className="w-[100px] h-[100px] rounded-3xl bg-white flex items-center justify-center text-[64px] shadow-lg">
            🇯🇵
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-red-900 mb-1 tracking-tight">eSIM Nhật Bản</h1>
            <p className="text-base text-red-800 font-medium">Japan eSIM • Tokyo, Osaka, Kyoto, Hokkaido...</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {["🔥 #1 Bán chạy", "⚡ Kích hoạt 30s", "📶 NTT Docomo & SoftBank", "🎌 12 gói data"].map((tag) => (
                <span key={tag} className="bg-white/70 text-red-900 px-3 py-1 rounded-md text-xs font-semibold">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex justify-between py-2 text-[13px] ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <span className="text-gray-500">{s.label}</span>
              <span className="font-bold text-navy">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
