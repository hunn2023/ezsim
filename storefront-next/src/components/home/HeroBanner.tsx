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
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-[320px] h-[320px] rounded-full bg-white/10 flex items-center justify-center">
            <Icon icon="globe-asia" className="text-[120px] text-white/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
