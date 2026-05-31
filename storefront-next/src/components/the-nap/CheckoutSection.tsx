"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

const paymentMethods: { icon: IconName; label: string }[] = [
  { icon: "mobile-alt", label: "Momo" },
  { icon: "wallet", label: "ZaloPay" },
  { icon: "credit-card", label: "VNPay" },
  { icon: "university", label: "Banking" },
  { icon: "qrcode", label: "QR Code" },
  { icon: "coins", label: "Số dư EZSIM" },
];

export default function CheckoutSection() {
  const [qty, setQty] = useState(2);
  const [payment, setPayment] = useState("Momo");

  return (
    <div className="border-2 border-primary rounded-[20px] p-7 mb-8 grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">Số lượng thẻ</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg border-[1.5px] border-gray-200 bg-white text-lg cursor-pointer font-semibold">−</button>
            <input type="text" value={qty} readOnly className="w-[60px] text-center py-2 border-[1.5px] border-gray-200 rounded-lg font-bold text-base font-sans" />
            <button onClick={() => setQty(Math.min(50, qty + 1))} className="w-9 h-9 rounded-lg border-[1.5px] border-gray-200 bg-white text-lg cursor-pointer font-semibold">+</button>
            <span className="text-[13px] text-gray-500">(tối đa 50 thẻ/đơn)</span>
          </div>
        </div>
        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">Email nhận mã thẻ <span className="text-red-600">*</span></label>
          <input type="email" placeholder="ban@example.com" defaultValue="khachhang@gmail.com" className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-[10px] font-sans text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">Số điện thoại (gửi SMS dự phòng)</label>
          <input type="tel" placeholder="0901 234 567" className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-[10px] font-sans text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">Phương thức thanh toán</label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((pm) => (
              <button
                key={pm.label}
                onClick={() => setPayment(pm.label)}
                className={`py-2.5 border-[1.5px] rounded-lg cursor-pointer text-center text-xs font-semibold transition ${
                  payment === pm.label ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
              >
                <Icon icon={pm.icon} className="text-xl text-primary block mx-auto mb-1" />
                {pm.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-base font-bold mb-4">📋 Tóm tắt đơn hàng</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-700">Sản phẩm</span><span className="font-semibold">Thẻ Viettel</span></div>
          <div className="flex justify-between"><span className="text-gray-700">Mệnh giá</span><span className="font-semibold">100.000đ</span></div>
          <div className="flex justify-between"><span className="text-gray-700">Số lượng</span><span className="font-semibold">{qty} thẻ</span></div>
          <div className="flex justify-between border-t border-dashed border-gray-200 mt-2 pt-4"><span className="text-gray-700">Tạm tính</span><span className="font-semibold">{(100000 * qty).toLocaleString("vi-VN")}đ</span></div>
          <div className="flex justify-between"><span className="text-gray-700">Chiết khấu (8%)</span><span className="text-red-600 font-semibold">−{(8000 * qty).toLocaleString("vi-VN")}đ</span></div>
          <div className="flex justify-between"><span className="text-gray-700">Phí giao dịch</span><span className="text-green-600 font-semibold">Miễn phí</span></div>
          <div className="flex justify-between border-t-2 border-gray-200 mt-3 pt-4 text-lg font-extrabold">
            <span>Tổng cộng</span>
            <span className="text-primary text-2xl">{(92000 * qty).toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
        <button className="w-full gradient-primary text-white py-4 rounded-xl font-bold text-base mt-4 flex items-center justify-center gap-2 cursor-pointer">
          <Icon icon="bolt" /> Thanh toán & nhận mã ngay
        </button>
        <p className="text-center text-xs text-gray-500 mt-3">🔒 Giao dịch an toàn - Mã thẻ gửi ngay sau khi thanh toán</p>
      </div>
    </div>
  );
}
