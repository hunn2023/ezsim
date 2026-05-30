import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Logo from "./Logo";

const footerLinks = {
  products: [
    { label: "eSIM Du lịch", href: "/esim" },
    { label: "Thẻ Viễn thông", href: "/the-nap" },
    { label: "Thẻ Game", href: "/the-game" },
    { label: "Data 4G/5G", href: "/data" },
    { label: "Khuyến mãi", href: "/khuyen-mai" },
  ],
  support: [
    { label: "Cài đặt eSIM", href: "/huong-dan/cai-dat-esim" },
    { label: "Kiểm tra thiết bị", href: "/kiem-tra-thiet-bi" },
    { label: "Câu hỏi thường gặp", href: "/faq" },
    { label: "Liên hệ", href: "/lien-he" },
    { label: "Blog", href: "/blog" },
  ],
  policies: [
    { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { label: "Điều khoản sử dụng", href: "/dieu-khoan" },
    { label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
    { label: "Chính sách thanh toán", href: "/chinh-sach-thanh-toan" },
    { label: "Giới thiệu", href: "/gioi-thieu" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-400 pt-12 md:pt-16 pb-6">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4"><Logo /></div>
            <p className="text-sm leading-7 max-w-[320px]">
              Kết nối dễ như chớp mắt — Connect in a Flash. Nền tảng cung cấp eSIM du lịch, thẻ viễn thông, thẻ game và gói Data hàng đầu Việt Nam.
            </p>
            <div className="mt-5 flex gap-3">
              {(["facebook-f", "tiktok", "youtube", "instagram"] as const).map((icon) => (
                <Link
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition"
                >
                  <Icon icon={["fab", icon]} />
                </Link>
              ))}
            </div>
          </div>

          {/* Sản phẩm */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-4">Sản phẩm</h4>
            <ul className="space-y-2.5">
              {footerLinks.products.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] text-slate-400 hover:text-secondary transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-4">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] text-slate-400 hover:text-secondary transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-4">Chính sách</h4>
            <ul className="space-y-2.5">
              {footerLinks.policies.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] text-slate-400 hover:text-secondary transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="text-white font-bold text-[15px] mb-4">Liên hệ</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Icon icon="phone" className="mr-2" />1900 1881</li>
              <li><Icon icon="envelope" className="mr-2" />hello@ezsim.vn</li>
              <li><Icon icon="map-marker-alt" className="mr-2" />Hà Nội, Việt Nam</li>
              <li><Icon icon="clock" className="mr-2" />24/7 - 365 ngày</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-[13px]">
          <div>© 2026 EZSIM Vietnam. All rights reserved.</div>
          <div className="flex flex-wrap gap-2">
            <Link href="/chinh-sach-bao-mat" className="text-slate-400 hover:text-secondary">Chính sách bảo mật</Link>
            <span>•</span>
            <Link href="/dieu-khoan" className="text-slate-400 hover:text-secondary">Điều khoản</Link>
            <span>•</span>
            <Link href="#" className="text-slate-400 hover:text-secondary">Đã thông báo Bộ Công Thương</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
