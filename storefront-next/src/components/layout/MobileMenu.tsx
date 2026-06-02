"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { IconName } from "@fortawesome/fontawesome-svg-core";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuItem {
  label: string;
  icon: IconName;
  href: string;
  matchPath: string;
  matchTab?: string;
}

const menuItems: MobileMenuItem[] = [
  { label: "Trang chủ", icon: "home", href: "/", matchPath: "/" },
  { label: "eSIM Du lịch", icon: "globe-asia", href: "/esim-du-lich", matchPath: "/esim-du-lich" },
  { label: "Thẻ Viễn thông", icon: "mobile-alt", href: "/the-nap?tab=telecom", matchPath: "/the-nap", matchTab: "telecom" },
  { label: "Thẻ Game", icon: "gamepad", href: "/the-nap?tab=game", matchPath: "/the-nap", matchTab: "game" },
  { label: "Data 4G/5G", icon: "wifi", href: "/the-nap?tab=data", matchPath: "/the-nap", matchTab: "data" },
  { label: "Khuyến mãi", icon: "tag", href: "/the-nap?tab=promo", matchPath: "/the-nap", matchTab: "promo" },
];

function isMenuActive(item: MobileMenuItem, pathname: string, currentTab: string | null): boolean {
  if (item.matchPath === "/") return pathname === "/";

  const pathMatches = pathname === item.matchPath || pathname.startsWith(item.matchPath + "/");
  if (!pathMatches) return false;

  if (item.matchTab) {
    const effectiveTab = currentTab ?? (item.matchPath === "/the-nap" ? "telecom" : null);
    return effectiveTab === item.matchTab;
  }

  return true;
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const { user, isAuthenticated } = useAuth();

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
            const isActive = isMenuActive(item, pathname ?? "", currentTab);
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
          {isAuthenticated && user ? (
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()}
              </div>
              <span className="truncate">{user.name}</span>
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-200 transition"
              >
                <Icon icon="user" className="w-4" />
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center px-3 py-3 rounded-lg text-sm font-medium text-white gradient-primary transition"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
