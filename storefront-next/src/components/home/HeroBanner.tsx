import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function HeroBanner() {
  return (
    <section className="gradient-primary text-white py-16 md:py-24">
      <div className="max-w-container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Kết nối dễ như <br className="hidden md:block" />chớp mắt
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-[480px] mx-auto md:mx-0">
            eSIM du lịch 200+ quốc gia, thẻ viễn thông, thẻ game, gói Data 4G/5G — tất cả trong 1 nơi.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/esim" className="btn bg-white text-primary font-bold hover:bg-gray-100">
              <Icon icon="globe-asia" /> Mua eSIM ngay
            </Link>
            <Link href="/the-nap" className="btn border-2 border-white text-white hover:bg-white/10">
              <Icon icon="sim-card" /> Nạp thẻ điện thoại
            </Link>
          </div>
          <div className="flex gap-6 mt-8 justify-center md:justify-start text-sm text-white/70">
            <span><Icon icon="bolt" className="text-yellow-300 mr-1" />Kích hoạt tức thì</span>
            <span><Icon icon="shield-alt" className="mr-1" />Bảo hành 100%</span>
            <span><Icon icon="headset" className="mr-1" />Hỗ trợ 24/7</span>
          </div>
        </div>
        {/* Right: floating stat cards */}
        <div className="flex-1 hidden md:flex justify-center items-center relative min-h-[320px]">
          <div className="relative w-[280px] h-[280px]">
            {/* Ambient pulse ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              style={{ animation: "ping 3s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            {/* Central circle */}
            <div className="absolute inset-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <Icon icon="globe-asia" className="text-5xl text-white/50 mb-1" />
                <div className="text-white font-extrabold text-4xl leading-none">200+</div>
                <div className="text-white/60 text-xs mt-1 tracking-widest uppercase">quốc gia</div>
              </div>
            </div>

            {/* Stat: top-left */}
            <div className="absolute -top-3 -left-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2.5 shadow-lg min-w-[128px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="bolt" className="text-yellow-300 text-xs" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-none">Tức thì</div>
                  <div className="text-white/60 text-[10px] mt-0.5">Kích hoạt ngay</div>
                </div>
              </div>
            </div>

            {/* Stat: top-right */}
            <div className="absolute -top-5 -right-6 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2.5 shadow-lg min-w-[128px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-400/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="users" className="text-green-300 text-xs" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-none">10,000+</div>
                  <div className="text-white/60 text-[10px] mt-0.5">khách hàng</div>
                </div>
              </div>
            </div>

            {/* Stat: bottom-right */}
            <div className="absolute -bottom-3 -right-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2.5 shadow-lg min-w-[128px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-yellow-300/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="star" className="text-yellow-300 text-xs" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-none">4.9 ★</div>
                  <div className="text-white/60 text-[10px] mt-0.5">đánh giá</div>
                </div>
              </div>
            </div>

            {/* Stat: bottom-left */}
            <div className="absolute -bottom-5 -left-6 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2.5 shadow-lg min-w-[128px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-300/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="shield-alt" className="text-blue-200 text-xs" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-none">Bảo hành</div>
                  <div className="text-white/60 text-[10px] mt-0.5">100% hoàn tiền</div>
                </div>
              </div>
            </div>
          </div>

          {/* Country flag strip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {["🇯🇵", "🇰🇷", "🇹🇭", "🇸🇬", "🇺🇸", "🇬🇧"].map((flag) => (
              <div
                key={flag}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-base"
              >
                {flag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
