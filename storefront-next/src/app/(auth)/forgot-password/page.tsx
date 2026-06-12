import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Quên mật khẩu | ${SITE.name}`,
  description: "Khôi phục mật khẩu bằng email OTP để truy cập lại tài khoản của bạn.",
};

function ForgotPasswordSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-11 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function ForgotPasswordPage() {
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
              <div className="relative z-10 my-auto">
                <h2 className="text-2xl lg:text-3xl font-bold italic mb-2">Khôi phục tài khoản</h2>
                <p className="text-white/80 text-sm mb-6">
                  Chỉ cần vài bước đơn giản để lấy lại quyền truy cập tài khoản của bạn.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-white/90">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50 flex-shrink-0" />
                    Nhập email đã đăng ký
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/90">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50 flex-shrink-0" />
                    Xác thực mã OTP qua email
                  </li>
                  <li className="flex items-center gap-3 text-sm text-white/90">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50 flex-shrink-0" />
                    Đặt mật khẩu mới an toàn
                  </li>
                </ul>
              </div>

              {/* Copyright */}
              <p className="relative z-10 mt-8 text-xs text-white/50">
                © {new Date().getFullYear()} EZSIM. All rights reserved.
              </p>
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
                <h1 className="text-2xl font-bold text-navy mb-1">Quên mật khẩu</h1>
                <p className="text-sm text-gray-500">
                  Nhập email để nhận OTP, xác thực mã rồi đặt mật khẩu mới.
                </p>
              </div>

              <Suspense fallback={<ForgotPasswordSkeleton />}>
                <ForgotPasswordForm />
              </Suspense>

              <p className="mt-5 text-center text-xs text-gray-400">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 hover:text-primary transition"
                >
                  ‹ Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
