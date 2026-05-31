import Icon from "@/components/ui/Icon";

export default function PageHeader() {
  const stats = [
    { icon: "percentage" as const, label: "Chiết khấu", value: "Lên đến 15%" },
    { icon: "bolt" as const, label: "Nhận mã", value: "30 giây" },
    { icon: "shield-alt" as const, label: "Bảo hành", value: "100% mã thẻ" },
    { icon: "headset" as const, label: "Hỗ trợ", value: "24/7" },
  ];

  return (
    <section className="bg-gradient-to-br from-[#1E1B4B] via-[#4338CA] to-[#7C3AED] py-12 text-white relative overflow-hidden">
      <div className="absolute -top-1/2 -right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.4),transparent_70%)] rounded-full" />
      <div className="max-w-container mx-auto px-6 relative">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-[28px]">
            <Icon icon="credit-card" />
          </div>
          Mua thẻ điện thoại & thẻ game online
        </h1>
        <p className="text-base text-white/85 max-w-[700px]">
          Nạp tiền điện thoại tất cả nhà mạng, mua thẻ game Garena, Zing, Steam, Vcoin... Chiết khấu cao - Nhận mã trong 30 giây.
        </p>
        <div className="flex gap-6 mt-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl py-3 px-5 flex items-center gap-3">
              <Icon icon={s.icon} className="text-xl text-[#FFE66D]" />
              <div className="text-[13px]">
                {s.label}
                <b className="block text-base">{s.value}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
