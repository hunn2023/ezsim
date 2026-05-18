"use client";

import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Logo from "./Logo";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
      <div className="max-w-container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-4 md:gap-8">
        {/* Mobile menu toggle */}
        <MobileMenu />

        {/* Logo */}
        <Logo />

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-[480px] relative">
          <Icon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm quốc gia, gói data, thẻ game..."
            className="w-full py-3 pl-11 pr-4 border-[1.5px] border-gray-200 rounded-xl text-sm font-sans outline-none focus:border-primary transition"
          />
        </div>

        {/* Right actions */}
        <nav className="flex gap-3 md:gap-6 items-center ml-auto">
          <Link
            href="/ho-tro"
            className="hidden lg:flex text-gray-700 font-medium text-sm items-center gap-1.5 hover:text-primary transition"
          >
            <Icon icon="headset" /> Hỗ trợ
          </Link>
          <Link
            href="/dang-nhap"
            className="hidden lg:flex text-gray-700 font-medium text-sm items-center gap-1.5 hover:text-primary transition"
          >
            <Icon icon="user" /> Đăng nhập
          </Link>
          <CartIcon count={2} />
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
  );
}
