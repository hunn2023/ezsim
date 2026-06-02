import Icon from "@/components/ui/Icon";

const bestsellers = [
  "Nhật 7 ngày 5GB",
  "Hàn 10 ngày 10GB",
  "Thái Lan 15GB",
  "Châu Âu 30 nước",
  "Mỹ 30 ngày Unl.",
  "Toàn cầu 100+",
];

export default function HeroBanner() {
  return (
    <section className="gradient-primary text-white relative overflow-hidden" style={{ padding: "64px 0" }}>
      {/* Decorative radial circle - mockup exact */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-50%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="max-w-container mx-auto px-6 relative">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Left: content */}
          <div>
            <h1 className="text-white mb-5">
              Kết nối <span style={{ color: "#FFE66D" }}>dễ như chớp mắt</span>
              <br />
              cho mọi chuyến đi
            </h1>
            <p className="text-white/90 mb-8 max-w-[520px]" style={{ fontSize: "18px" }}>
              eSIM du lịch 200+ quốc gia, thẻ viễn thông trong nước, thẻ game, gói Data 4G/5G — tất cả trong 1 nơi. Kích hoạt trong 30 giây.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              <div>
                <div className="text-white font-extrabold leading-none" style={{ fontSize: "32px" }}>200+</div>
                <div className="text-white/85" style={{ fontSize: "13px" }}>Quốc gia phủ sóng</div>
              </div>
              <div>
                <div className="text-white font-extrabold leading-none" style={{ fontSize: "32px" }}>100K+</div>
                <div className="text-white/85" style={{ fontSize: "13px" }}>Khách hàng tin dùng</div>
              </div>
              <div>
                <div className="text-white font-extrabold leading-none" style={{ fontSize: "32px" }}>4.9★</div>
                <div className="text-white/85" style={{ fontSize: "13px" }}>Đánh giá trung bình</div>
              </div>
            </div>

            {/* Hero search */}
            <form
              action="/esim-du-lich"
              method="GET"
              className="bg-white flex flex-col sm:flex-row gap-2 max-w-[600px]"
              style={{
                borderRadius: "16px",
                padding: "8px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <input
                type="text"
                name="q"
                placeholder="Bạn đang đi đâu? Nhật Bản, Hàn Quốc, Mỹ..."
                className="flex-1 border-none outline-none text-navy font-sans min-w-0"
                style={{ padding: "12px 14px", fontSize: "14px" }}
              />
              <button
                type="submit"
                className="bg-navy text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 whitespace-nowrap"
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "14px",
                }}
              >
                <Icon icon="search" />
                <span className="sm:hidden">Tìm gói</span>
                <span className="hidden sm:inline">Tìm gói cho tôi</span>
              </button>
            </form>
          </div>

          {/* Right: bestseller card - mockup exact */}
          <div
            className="hidden md:block text-white"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontSize: "18px" }}>
              <Icon icon="fire" /> Bán chạy nhất tuần này
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {bestsellers.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 font-medium"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "16px",
                    fontSize: "14px",
                  }}
                >
                  <Icon icon="bolt" style={{ color: "#FFE66D", fontSize: "20px" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
