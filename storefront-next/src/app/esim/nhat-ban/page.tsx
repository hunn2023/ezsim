import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { CountryHero, Sidebar, QuickPills, PackageCard, InfoTabs } from "@/components/esim";
import type { PackageData } from "@/components/esim/PackageCard";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "eSIM Du lịch Nhật Bản - Kết nối ngay khi đặt chân | EZSIM",
};

const packages: PackageData[] = [
  {
    data: "5", dataUnit: "GB", subtitle: "Tốc độ cao toàn thời gian",
    tag: "7 NGÀY", features: ["Mạng 5G NTT Docomo", "Hỗ trợ chia sẻ Hotspot", "Kích hoạt khi đặt chân Nhật", "Không cần đăng ký giấy tờ"],
    price: 99000, oldPrice: 120000, discount: "-18%", featured: true, featuredLabel: "🔥 BÁN CHẠY #1",
  },
  {
    data: "10", dataUnit: "GB", subtitle: "Phù hợp đi 7-10 ngày",
    tag: "10 NGÀY", features: ["Mạng 5G/4G LTE", "Hỗ trợ chia sẻ Hotspot", "Tự động chuyển mạng tốt nhất", "Hết 10GB → giảm tốc, vẫn dùng được"],
    price: 149000, oldPrice: 180000,
  },
  {
    data: "∞", dataUnit: "Không giới hạn", subtitle: "2GB/ngày tốc độ cao",
    tag: "⭐ UNLIMITED", tagType: "unlimited",
    features: ["2GB/ngày tốc độ tối đa", "Sau đó vẫn dùng - giảm tốc", "Phù hợp đi nhóm, gia đình", "Chia sẻ Hotspot thoải mái"],
    price: 299000, oldPrice: 350000,
  },
  {
    data: "3", dataUnit: "GB", subtitle: "Đi ngắn ngày, công tác",
    tag: "5 NGÀY", features: ["Mạng SoftBank 4G LTE", "Hỗ trợ Hotspot", "Phù hợp dùng map, mạng XH", "Tốc độ 100Mbps+"],
    price: 79000,
  },
  {
    data: "20", dataUnit: "GB", subtitle: "Đi dài ngày, tour 2 tuần",
    tag: "15 NGÀY", features: ["Mạng 5G/4G+ chuẩn", "Hỗ trợ Hotspot", "Đủ dùng livestream, video call", "Trung bình 1.3GB/ngày"],
    price: 229000, oldPrice: 280000,
  },
  {
    data: "30", dataUnit: "GB", subtitle: "Du học, công tác dài hạn",
    tag: "📞 CÓ SĐT", tagType: "popular",
    features: ["30GB tốc độ cao", "Có số điện thoại gọi/nhắn tin", "Đăng ký được tài khoản dịch vụ Nhật", "Phù hợp ở 1 tháng+"],
    price: 449000,
  },
];

export default function EsimNhatBanPage() {
  return (
    <>
      <Breadcrumb items={[
        { label: "eSIM Du lịch", href: "#" },
        { label: "Châu Á", href: "#" },
        { label: "Nhật Bản" },
      ]} />
      <CountryHero />
      <div className="max-w-container mx-auto px-6 py-8 grid grid-cols-[280px_1fr] gap-6">
        <Sidebar />
        <main>
          <QuickPills />
          <div className="bg-white py-4 px-5 rounded-xl border border-gray-200 flex justify-between items-center mb-5">
            <div className="text-sm text-gray-700">
              Hiển thị <b>1-12</b> trong tổng số <b>12 gói</b> eSIM Nhật Bản
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span>Sắp xếp:</span>
              <select className="py-2 px-3 border-[1.5px] border-gray-200 rounded-lg font-sans text-sm bg-white cursor-pointer">
                <option>Phù hợp nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
                <option>Bán chạy nhất</option>
              </select>
              <div className="flex gap-1">
                <button className="w-9 h-9 border-[1.5px] border-primary bg-primary text-white rounded-lg">
                  <Icon icon="th-large" />
                </button>
                <button className="w-9 h-9 border-[1.5px] border-gray-200 bg-white text-gray-500 rounded-lg">
                  <Icon icon="list" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {packages.map((pkg, i) => (
              <PackageCard key={i} pkg={pkg} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="gradient-primary text-white py-3 px-6 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
              <Icon icon="plus" /> Xem thêm 6 gói
            </button>
          </div>
          <InfoTabs />
        </main>
      </div>
    </>
  );
}
