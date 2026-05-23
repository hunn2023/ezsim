import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import LoginForm from "@/components/auth/LoginForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Đăng nhập | ${SITE.name}`,
  description: "Đăng nhập để quản lý đơn hàng và trải nghiệm mua sắm tốt hơn.",
};

const BRAND_FEATURES = [
  "Theo dõi đơn hàng theo thời gian thực",
  "Lưu địa chỉ giao hàng yêu thích",
  "Ưu đãi độc quyền dành cho thành viên",
];

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

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 px-4 py-12 md:py-16">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/6 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/3 blur-3xl pointer-events-none"
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[900px]">
        <div className="flex rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/80">

          {/* ── Left: Brand panel (desktop only) ── */}
          <div className="hidden lg:flex lg:w-[420px] flex-shrink-0 flex-col justify-between gradient-primary p-10 text-white relative overflow-hidden">
            {/* Background rings */}
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10"
            />
            <div
              aria-hidden
              className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden
              className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"
            />

            {/* Logo */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white/30 transition">
                  <Icon icon="bolt" className="text-sm" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">
                  {SITE.name}
                </span>
              </Link>
            </div>

            {/* Center content */}
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-snug mb-2">
                  {SITE.tagline}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Đăng nhập để trải nghiệm mua sắm tiện lợi và nhanh chóng hơn.
                </p>
              </div>
              <ul className="space-y-3">
                {BRAND_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon icon="check-circle" className="text-[10px]" />
                    </span>
                    <span className="text-white/85 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <p className="relative z-10 text-white/40 text-xs">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>

          {/* ── Right: Form panel ── */}
          <div className="flex-1 bg-white flex flex-col justify-center px-6 py-10 sm:px-8 md:px-10">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white">
                  <Icon icon="bolt" className="text-xs" />
                </div>
                <span className="text-xl font-extrabold text-navy">
                  ez<span className="gradient-text">sim</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-navy mb-1">
                Chào mừng trở lại 👋
              </h1>
              <p className="text-sm text-gray-500">
                Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng
              </p>
            </div>

            {/* Form */}
            <Suspense fallback={<LoginSkeleton />}>
              <LoginForm />
            </Suspense>

            {/* Back to home */}
            <p className="mt-6 text-center text-xs text-gray-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-primary transition"
              >
                <Icon icon="chevron-left" className="text-[10px]" />
                Quay lại trang chủ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
