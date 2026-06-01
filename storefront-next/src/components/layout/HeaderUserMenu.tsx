"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/hooks/useAuth";

export default function HeaderUserMenu() {
  const { user, isAuthenticated, initialized } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const firstName = user.name.split(" ").at(-1) ?? user.name;

  return (
    <Link
      href="/account"
      className="hidden lg:flex items-center gap-2 hover:text-primary transition"
      title={user.name}
    >
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {initials}
      </div>
      <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate hover:text-primary transition">
        {firstName}
      </span>
    </Link>
  );
}
