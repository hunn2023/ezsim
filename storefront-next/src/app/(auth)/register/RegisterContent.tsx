"use client";

import { Suspense } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import RegisterForm from "@/components/auth/RegisterForm";
import { useLanguage } from "@/hooks/useLanguage";

function RegisterSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-11 bg-gray-100 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-11 bg-gray-100 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-11 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function RegisterContent() {
  const { language } = useLanguage();
  const text = {
    heading: language === "vi" ? "Tạo tài khoản mới ✨" : "Create a new account ✨",
    subheading:
      language === "vi"
        ? "Điền thông tin bên dưới để bắt đầu mua sắm"
        : "Fill in your details below to get started",
    backHome: language === "vi" ? "‹ Quay lại trang chủ" : "‹ Back to home",
    tagline:
      language === "vi"
        ? "Kết nối dễ như chớp mắt"
        : "Connect in a blink",
    taglineDesc:
      language === "vi"
        ? "Tạo tài khoản để tận hưởng mọi tiện ích mua sắm và ưu đãi đặc biệt."
        : "Create an account to enjoy all shopping benefits and exclusive offers.",
    feature1: language === "vi" ? "Theo dõi đơn hàng theo thời gian thực" : "Track orders in real time",
    feature2: language === "vi" ? "Lưu địa chỉ giao hàng yêu thích" : "Save favorite delivery addresses",
    feature3: language === "vi" ? "Ưu đãi độc quyền dành cho thành viên" : "Exclusive member-only offers",
    copyright: `© ${new Date().getFullYear()} EZSIM. All rights reserved.`,
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4 py-6 bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="relative z-10 w-full max-w-[960px]">
        <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/80 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left — Branding Panel */}
            <div className="hidden md:flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white relative overflow-hidden">
              {/* Logo */}
              <div className="relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon icon="bolt" className="text-white text-sm" />
                  </div>
                  <span className="text-xl font-extrabold text-white tracking-tight">EZSIM</span>
                </Link>
              </div>

              {/* Tagline + features */}
              <div className="relative z-10 mt-auto">
                <h2 className="text-2xl lg:text-3xl font-bold italic mb-2">{text.tagline}</h2>
                <p className="text-white/80 text-sm mb-6">{text.taglineDesc}</p>
                <ul className="space-y-3">
                  {[text.feature1, text.feature2, text.feature3].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/50 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Copyright */}
              <p className="relative z-10 mt-8 text-xs text-white/50">{text.copyright}</p>
            </div>

            {/* Right — Form */}
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              {/* Mobile logo */}
              <div className="flex items-center justify-center gap-2 mb-6 md:hidden">
                <Link href="/" className="inline-flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white">
                    <Icon icon="bolt" className="text-xs" />
                  </div>
                  <span className="text-xl font-extrabold text-navy">
                    ez<span className="gradient-text">sim</span>
                  </span>
                </Link>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy mb-1">{text.heading}</h1>
                <p className="text-sm text-gray-500">{text.subheading}</p>
              </div>

              <Suspense fallback={<RegisterSkeleton />}>
                <RegisterForm />
              </Suspense>

              <p className="mt-5 text-center text-xs text-gray-400">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 hover:text-primary transition"
                >
                  {text.backHome}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
