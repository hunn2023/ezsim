import Icon from "@/components/ui/Icon";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

const infoItems: { icon: IconName; title: string; desc: string }[] = [
  { icon: "bolt", title: "Nhận mã trong 30 giây", desc: "Mã thẻ tự động gửi qua email + lưu trong tài khoản EZSIM ngay sau khi thanh toán thành công." },
  { icon: "shield-alt", title: "Bảo hành 100% mã thẻ", desc: "Cam kết mã thẻ chính hãng, sử dụng được. Nếu lỗi → hoàn tiền hoặc đổi thẻ mới ngay lập tức." },
  { icon: "percentage", title: "Tích điểm thưởng", desc: "Mỗi 10.000đ chi tiêu = 1 điểm. Tích điểm đổi thẻ free, giảm giá đơn sau, nâng hạng VIP." },
];

const howtoSteps = [
  { num: 1, title: "Chọn nhà cung cấp", desc: "Click vào logo Viettel, Garena, Zing... muốn mua" },
  { num: 2, title: "Chọn mệnh giá", desc: "10K đến 1 triệu - thấy giá sau chiết khấu ngay lập tức" },
  { num: 3, title: "Thanh toán", desc: "Momo, ZaloPay, VNPay, Banking, QR — chọn cách bạn thích" },
  { num: 4, title: "Nhận mã thẻ", desc: "Mã gửi qua email trong 30 giây, copy & nạp ngay" },
];

export function InfoRow() {
  return (
    <div className="grid grid-cols-3 gap-4 my-8">
      {infoItems.map((item) => (
        <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[22px] shrink-0">
            <Icon icon={item.icon} />
          </div>
          <div>
            <h4 className="text-[15px] font-bold mb-1.5">{item.title}</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HowToBuy() {
  return (
    <div className="bg-white rounded-[20px] p-8 border border-gray-200 mb-8">
      <h2 className="text-2xl font-extrabold tracking-tight mb-5 flex items-center gap-2.5">
        <div className="w-1 h-6 gradient-primary rounded-sm" />
        Mua thẻ online tại EZSIM siêu dễ
      </h2>
      <div className="grid grid-cols-4 gap-6">
        {howtoSteps.map((step) => (
          <div key={step.num} className="text-center">
            <div className="w-14 h-14 rounded-full gradient-primary text-white flex items-center justify-center font-extrabold text-[22px] mx-auto mb-3">
              {step.num}
            </div>
            <h4 className="text-sm font-bold mb-1.5">{step.title}</h4>
            <p className="text-xs text-gray-500">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
