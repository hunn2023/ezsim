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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 md:py-16">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/auth/background-auth-ezim.jpg')" }}
      />
      <div aria-hidden className="absolute inset-0 bg-white/68" />
      <div aria-hidden className="absolute inset-0 bg-black/35 backdrop-blur-[3px]" />

      <div className="relative z-10 w-full max-w-[560px]">
        <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="bg-white/95 flex flex-col justify-center px-6 py-10 sm:px-8 md:px-10">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white">
                  <Icon icon="bolt" className="text-xs" />
                </div>
                <span className="text-xl font-extrabold text-navy">
                  ez<span className="gradient-text">sim</span>
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-navy mb-1">Quên mật khẩu</h1>
              <p className="text-sm text-gray-500">
                Nhập email để nhận OTP, xác thực mã rồi đặt mật khẩu mới.
              </p>
            </div>

            <Suspense fallback={<ForgotPasswordSkeleton />}>
              <ForgotPasswordForm />
            </Suspense>

            <p className="mt-6 text-center text-xs text-gray-400">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 hover:text-primary transition"
              >
                <Icon icon="chevron-left" className="text-[10px]" />
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
