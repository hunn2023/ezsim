"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

const menuItems: { label: string; icon: IconName; href: string }[] = [
  { label: "Trang chủ", icon: "home", href: "/" },
  { label: "Sản phẩm", icon: "list", href: "/products" },
  { label: "eSIM Du lịch", icon: "globe-asia", href: "/products?categoryId=esim" },
  { label: "Thẻ Viễn thông", icon: "sim-card", href: "/products?categoryId=the-nap" },
  { label: "Thẻ Game", icon: "gamepad", href: "/products?categoryId=the-game" },
  { label: "Data 4G/5G", icon: "wifi", href: "/products?categoryId=data" },
  { label: "Khuyến mãi", icon: "tag", href: "/khuyen-mai" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden w-10 h-10 flex items-center justify-center text-navy"
        aria-label="Mở menu"
      >
        <Icon icon="bars" className="text-xl" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[200] lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[201] transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-navy">Menu</span>
          <button onClick={() => setOpen(false)} aria-label="Đóng menu">
            <Icon icon="times" className="text-xl text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon icon={item.icon} className="w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
          <Link
            href="/dang-nhap"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <Icon icon="user" className="w-4" />
            Đăng nhập / Đăng ký
          </Link>
          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <Icon icon="headset" className="w-4" />
            Hỗ trợ: 1900 1881
          </Link>
        </div>
      </div>
    </>
  );
}
