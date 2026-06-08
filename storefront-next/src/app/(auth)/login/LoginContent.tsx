"use client";

import { Suspense } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import LoginForm from "@/components/auth/LoginForm";
import { useLanguage } from "@/hooks/useLanguage";

function LoginSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-11 bg-gray-100 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-11 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function LoginContent() {
  const { language } = useLanguage();
  const text = {
    heading: language === "vi" ? "Chào mừng trở lại 👋" : "Welcome back 👋",
    subheading:
      language === "vi"
        ? "Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng"
        : "Sign in to continue shopping and manage your orders",
    backHome: language === "vi" ? "Quay lại trang chủ" : "Back to home",
  };

  return (
    <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden px-4 py-4 md:py-6">
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/auth/background-auth-ezim.jpg')" }}
      />
      <div aria-hidden className="hidden md:block absolute inset-0 bg-white/68" />
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 bg-black/35 backdrop-blur-[3px]"
      />

      <div className="relative z-10 w-full max-w-[560px]">
        <div className="md:rounded-2xl md:overflow-hidden md:shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] md:border md:border-gray-100/80">
          <div className="bg-white flex flex-col justify-center px-5 py-7 sm:px-7 sm:py-8 md:bg-white/95 md:px-8 md:py-8 lg:px-10 lg:py-10">
            <div className="flex items-center justify-center gap-2 mb-6 md:mb-7">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white">
                  <Icon icon="bolt" className="text-xs" />
                </div>
                <span className="text-xl font-extrabold text-navy">
                  ez<span className="gradient-text">sim</span>
                </span>
              </Link>
            </div>

            <div className="mb-6 md:mb-7">
              <h1 className="text-2xl font-bold text-navy mb-1">{text.heading}</h1>
              <p className="text-sm text-gray-500">{text.subheading}</p>
            </div>

            <Suspense fallback={<LoginSkeleton />}>
              <LoginForm />
            </Suspense>

            <p className="mt-5 text-center text-xs text-gray-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-primary transition"
              >
                <Icon icon="chevron-left" className="text-[10px]" />
                {text.backHome}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
