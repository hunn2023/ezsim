"use client";

import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Logo from "./Logo";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import HeaderUserMenu from "./HeaderUserMenu";
import { useCartAnimation } from "@/components/ui/CartAnimation";
import { useAuth } from "@/hooks/useAuth";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

interface MainMenuItem {
  label: string;
  href: string;
  icon: IconName;
  /** Match this URL exactly (or as prefix for subpaths). */
  matchPath: string;
  /** Optionally require ?tab=value to match. */
  matchTab?: string;
  /** Custom class for special promo highlight. */
  highlight?: boolean;
}

const MAIN_MENU: MainMenuItem[] = [
  { label: "Trang chủ",      icon: "home",       href: "/",                       matchPath: "/" },
  { label: "eSIM Du lịch",   icon: "globe-asia", href: "/esim-du-lich",           matchPath: "/esim-du-lich" },
  { label: "Thẻ Viễn thông", icon: "mobile-alt", href: "/the-nap?tab=telecom",    matchPath: "/the-nap", matchTab: "telecom" },
  { label: "Thẻ Game",       icon: "gamepad",    href: "/the-nap?tab=game",       matchPath: "/the-nap", matchTab: "game" },
  { label: "Data 4G/5G",     icon: "wifi",       href: "/the-nap?tab=data",       matchPath: "/the-nap", matchTab: "data" },
  { label: "Khuyến mãi",     icon: "tag",        href: "/the-nap?tab=promo",      matchPath: "/the-nap", matchTab: "promo", highlight: true },
];

function isMenuActive(item: MainMenuItem, pathname: string, currentTab: string | null): boolean {
  if (item.matchPath === "/") return pathname === "/";

  const pathMatches =
    pathname === item.matchPath || pathname.startsWith(item.matchPath + "/");
  if (!pathMatches) return false;

  if (item.matchTab) {
    // Treat no-query as "telecom" default for /the-nap
    const effectiveTab = currentTab ?? (item.matchPath === "/the-nap" ? "telecom" : null);
    return effectiveTab === item.matchTab;
  }

  // No tab requirement — pathname match is enough, but ensure not over-matching
  // (eg /esim-du-lich without tab on a /the-nap entry handled above)
  return true;
}

export default function Header() {
  const { cartIconRef } = useCartAnimation();
  const { initialized, isAuthenticated } = useAuth();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-navy" style={{ color: "#94A3B8", fontSize: "13px", padding: "8px 0" }}>
        <div className="max-w-container mx-auto px-6 flex justify-end items-center">
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-cyan transition hidden md:flex items-center gap-1.5">
              <Icon icon="mobile-alt" />
              Tải app EZSIM
            </a>
            <a href="#" className="hover:text-cyan transition hidden md:flex items-center gap-1.5">
              <Icon icon="globe" />
              Tiếng Việt
            </a>
            {initialized && !isAuthenticated && (
              <Link href="/login" className="hover:text-cyan transition flex items-center gap-1.5">
                <Icon icon="user" />
                Đăng nhập / Đăng ký
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
        <div className="max-w-container mx-auto px-6 py-4 flex items-center gap-8">
          <MobileMenu />
          <Logo />

          {/* Search bar */}
          <div className="hidden md:block flex-1 max-w-[480px] relative">
            <Icon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm quốc gia, gói data, thẻ game..."
              className="w-full py-3 pl-11 pr-4 border-[1.5px] border-gray-200 rounded-xl text-sm font-sans outline-none focus:border-primary transition"
            />
          </div>

          {/* Right nav */}
          <nav className="flex gap-6 items-center ml-auto">
            <HeaderUserMenu />
            <CartIcon ref={cartIconRef} />
          </nav>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Icon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full py-2.5 pl-9 pr-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition"
            />
          </div>
        </div>
      </header>

      {/* MAIN MENU */}
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-container mx-auto px-6">
          <nav className="flex gap-8">
            {MAIN_MENU.map((item) => {
              const active = isMenuActive(item, pathname, currentTab);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-medium text-sm flex items-center gap-1.5 transition"
                  style={{
                    padding: "14px 0",
                    color: active
                      ? "#0066FF"
                      : item.highlight
                        ? "#F59E0B"
                        : "#334155",
                    borderBottom: active
                      ? "2px solid #0066FF"
                      : "2px solid transparent",
                  }}
                >
                  <Icon icon={item.icon} className="text-sm" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
