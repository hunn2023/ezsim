import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import RegisterForm from "@/components/auth/RegisterForm";
import { SITE } from "@/lib/constants";
import { LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);

  return {
    title: language === "vi" ? `Tạo tài khoản | ${SITE.name}` : `Create account | ${SITE.name}`,
    description:
      language === "vi"
        ? "Tạo tài khoản để mua sắm, theo dõi đơn hàng và nhận ưu đãi thành viên."
        : "Create an account to shop, track orders, and receive member benefits.",
  };
}

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
  const language = normalizeLanguage(cookies().get(LANGUAGE_COOKIE)?.value);
  const text = {
    heading: language === "vi" ? "Tạo tài khoản mới ✨" : "Create a new account ✨",
    subheading:
      language === "vi"
        ? "Điền thông tin bên dưới để bắt đầu mua sắm"
        : "Fill in the details below to start shopping",
    backHome: language === "vi" ? "Quay lại trang chủ" : "Back to homepage",
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 md:py-16">
      {/* Auth background image with subtle blur so form stays prominent */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/auth/background-auth-ezim.jpg')" }}
      />
      <div aria-hidden className="absolute inset-0 bg-white/68" />
      <div
        aria-hidden
        className="absolute inset-0 bg-black/35 backdrop-blur-[3px]"
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[640px]">
        <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/80">
          <div className="bg-white/95 flex flex-col justify-center px-6 py-10 sm:px-8 md:px-10">
            <div className="flex items-center justify-center mb-8">
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
              <h1 className="text-2xl font-bold text-navy mb-1">{text.heading}</h1>
              <p className="text-sm text-gray-500">
                {text.subheading}
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
                {text.backHome}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
