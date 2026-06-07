"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useLanguage } from "@/hooks/useLanguage";
import type { EsimPackage } from "@/types/esim";

interface PackageCardProps {
  pkg: EsimPackage;
  onBuy?: (pkg: EsimPackage, quantity: number, triggerElement: HTMLElement | null) => void;
}

export default function PackageCard({ pkg, onBuy }: PackageCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { language } = useLanguage();
  const tagStyles: Record<NonNullable<EsimPackage["tagType"]>, { bg: string; color: string }> = {
    default:   { bg: "rgba(0,102,255,0.1)", color: "#0066FF" },
    unlimited: { bg: "#FEF3C7",              color: "#92400E" },
    popular:   { bg: "#DCFCE7",              color: "#166534" },
  };
  const tagStyle = tagStyles[pkg.tagType || "default"];
  const maxQuantity = Math.max(1, Math.min(pkg.stock, 99));
  const totalPrice = pkg.price * quantity;
  const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
  const text = {
    unitPrice: language === "vi" ? "Đơn giá" : "Unit price",
    quantity: language === "vi" ? "Số lượng" : "Quantity",
    subtotal: language === "vi" ? "Tạm tính" : "Subtotal",
    decreaseQuantity: language === "vi" ? "Giảm số lượng" : "Decrease quantity",
    increaseQuantity: language === "vi" ? "Tăng số lượng" : "Increase quantity",
    addToCart: language === "vi" ? "Thêm vào giỏ hàng" : "Add to cart",
  };

  const translateText = (value: string) => {
    if (language === "vi") return value;

    const map: Record<string, string> = {
      "Tốc độ cao toàn thời gian": "High-speed data at all times",
      "Phù hợp đi 7-10 ngày": "Ideal for 7-10 day trips",
      "2GB/ngày tốc độ cao": "2GB/day high-speed data",
      "Đi ngắn ngày, công tác": "Short trips and business travel",
      "Đi dài ngày, tour 2 tuần": "Long stays and 2-week tours",
      "Du học, công tác dài hạn": "Study abroad and long-term business trips",
      "Mạng 5G NTT Docomo": "NTT Docomo 5G network",
      "Hỗ trợ chia sẻ Hotspot": "Hotspot sharing supported",
      "Kích hoạt khi đặt chân Nhật": "Activates on arrival in Japan",
      "Không cần đăng ký giấy tờ": "No paperwork required",
      "Mạng 5G/4G LTE": "5G/4G LTE network",
      "Tự động chuyển mạng tốt nhất": "Auto-switch to best network",
      "Hết 10GB giảm tốc vẫn dùng được": "After 10GB, speed reduced but still usable",
      "2GB tốc độ cao mỗi ngày": "2GB high-speed each day",
      "Sau đó vẫn dùng, giảm tốc": "Then unlimited at reduced speed",
      "Phù hợp đi nhóm, gia đình": "Ideal for groups and families",
      "Chia sẻ Hotspot thoải mái": "Freely share via hotspot",
      "Mạng SoftBank 4G LTE": "SoftBank 4G LTE network",
      "Phù hợp dùng map, mạng xã hội": "Great for maps and social apps",
      "Tốc độ 100Mbps+": "100Mbps+ speed",
      "Mạng 5G/4G+ chuẩn": "Stable 5G/4G+ connectivity",
      "Đủ dùng livestream, video call": "Enough for livestream and video calls",
      "Trung bình 1.3GB/ngày": "Average 1.3GB/day",
      "30GB tốc độ cao": "30GB high-speed data",
      "Có số điện thoại gọi, nhắn tin": "Includes phone number for calls and SMS",
      "Đăng ký được tài khoản dịch vụ Nhật": "Supports local service registration",
      "Phù hợp ở 1 tháng+": "Ideal for stays over 1 month",
      "7 NGÀY": "7 DAYS",
      "10 NGÀY": "10 DAYS",
      "5 NGÀY": "5 DAYS",
      "15 NGÀY": "15 DAYS",
      "⭐ UNLIMITED": "⭐ UNLIMITED",
      "📞 CÓ SĐT": "📞 WITH PHONE NUMBER",
    };

    return map[value] ?? value;
  };

  const changeQuantity = (next: number) => {
    setQuantity(Math.max(1, Math.min(next, maxQuantity)));
  };

  return (
    <div
      className="bg-white relative transition-all flex flex-col group hover:-translate-y-0.5"
      style={{
        borderRadius: "16px",
        padding: "24px",
        border: pkg.featured ? "2px solid #0066FF" : "1.5px solid #E2E8F0",
      }}
    >
      {pkg.featuredLabel && (
        <span
          className="absolute text-white font-bold"
          style={{
            top: "-12px",
            left: "24px",
            background: "#0066FF",
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "11px",
          }}
        >
          {pkg.featuredLabel}
        </span>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div
            className="font-extrabold text-navy"
            style={{ fontSize: "28px", letterSpacing: "-0.5px" }}
          >
            {pkg.data}{" "}
            <span className="text-gray-500 font-medium" style={{ fontSize: "14px" }}>
              {pkg.dataUnit}
            </span>
          </div>
          <div className="text-gray-500" style={{ fontSize: "13px", marginTop: "4px" }}>
            {translateText(pkg.subtitle)}
          </div>
        </div>
        <span
          className="font-bold"
          style={{
            background: tagStyle.bg,
            color: tagStyle.color,
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
          }}
        >
          {translateText(pkg.tag)}
        </span>
      </div>

      {/* Features */}
      <ul className="list-none flex-grow" style={{ margin: "16px 0" }}>
        {pkg.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-gray-700"
            style={{ fontSize: "13px", padding: "4px 0" }}
          >
            <Icon icon="check-circle" className="text-primary" style={{ width: "16px" }} /> {translateText(f)}
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #F1F5F9", margin: "16px 0" }} />

      {/* Footer */}
      <div className="mt-1 flex flex-col gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{text.unitPrice}</p>
          {pkg.oldPrice && (
            <div
              className="line-through text-gray-500"
              style={{ fontSize: "12px", marginBottom: "1px" }}
            >
              {formatPrice(pkg.oldPrice)}
            </div>
          )}
          <div className="flex items-end justify-between gap-3">
            <span className="font-extrabold text-navy" style={{ fontSize: "24px", letterSpacing: "-0.5px" }}>
              {formatPrice(pkg.price)}
            </span>
            {pkg.discount && (
              <span
                className="font-bold"
                style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                {pkg.discount}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{text.quantity}</p>
            <p className="text-sm font-semibold text-navy">{text.subtotal} x{quantity}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={text.decreaseQuantity}
            >
              <Icon icon="minus" className="text-xs" />
            </button>
            <span className="min-w-7 text-center text-sm font-bold text-navy">{quantity}</span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              disabled={quantity >= maxQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={text.increaseQuantity}
            >
              <Icon icon="plus" className="text-xs" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5">
          <p className="text-xs font-semibold text-slate-600">
            {formatPrice(pkg.price)} x {quantity}
          </p>
          <p className="text-lg font-extrabold text-primary">{formatPrice(totalPrice)}</p>
        </div>

        <button
          type="button"
          onClick={(event) => onBuy?.(pkg, quantity, event.currentTarget)}
          className="gradient-primary text-white font-bold no-underline flex items-center justify-center gap-2 transition hover:brightness-105"
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          <Icon icon="shopping-cart" /> {text.addToCart}
        </button>
      </div>
    </div>
  );
}
