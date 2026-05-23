import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import RegisterForm from "@/components/auth/RegisterForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Tạo tài khoản | ${SITE.name}`,
  description: "Tạo tài khoản để mua sắm, theo dõi đơn hàng và nhận ưu đãi thành viên.",
};

const BRAND_FEATURES = [
  "Theo dõi đơn hàng theo thời gian thực",
  "Lưu địa chỉ & thanh toán nhanh hơn",
  "Ưu đãi và mã giảm giá riêng cho thành viên",
  "Lịch sử mua hàng đầy đủ, tiện tra cứu",
];

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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-11 bg-gray-100 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-11 bg-gray-100 rounded-lg" />
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 px-4 py-12 md:py-16">
      {/* Decorative blobs */}
      <div aria-hidden className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/6 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/3 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[960px]">
        <div className="flex rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/80">

          {/* ── Left: Brand panel (desktop only) ── */}
          <div className="hidden lg:flex lg:w-[380px] flex-shrink-0 flex-col justify-between gradient-primary p-10 text-white relative overflow-hidden">
            <div aria-hidden className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10" />
            <div aria-hidden className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full border border-white/10" />
            <div aria-hidden className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />

            {/* Logo */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                  <Icon icon="bolt" className="text-sm" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">{SITE.name}</span>
              </Link>
            </div>

            {/* Center content */}
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-snug mb-2">
                  Tham gia cộng đồng {SITE.name}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Tạo tài khoản miễn phí và khám phá hàng nghìn gói eSIM, thẻ data hấp dẫn.
                </p>
              </div>
              <ul className="space-y-3">
                {BRAND_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon icon="check-circle" className="text-[10px]" />
                    </span>
                    <span className="text-white/85 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative z-10 text-white/40 text-xs">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>

          {/* ── Right: Form panel ── */}
          <div className="flex-1 bg-white flex flex-col justify-center px-6 py-10 sm:px-8 md:px-10">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white">
                  <Icon icon="bolt" className="text-xs" />
                </div>
                <span className="text-xl font-extrabold text-navy">
                  ez<span className="gradient-text">sim</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-navy mb-1">Tạo tài khoản mới ✨</h1>
              <p className="text-sm text-gray-500">
                Điền thông tin bên dưới để bắt đầu mua sắm
              </p>
            </div>

            {/* Form */}
            <Suspense fallback={<RegisterSkeleton />}>
              <RegisterForm />
            </Suspense>

            {/* Back to home */}
            <p className="mt-6 text-center text-xs text-gray-400">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-primary transition">
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
