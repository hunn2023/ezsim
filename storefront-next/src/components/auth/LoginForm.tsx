"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { loginSchema, type LoginFormData } from "@/lib/schemas/loginSchema";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const fillTestAccount = () => {
    setValue("email", "test@ezsim.vn", { shouldValidate: true });
    setValue("password", "123456", { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      noValidate
      className="space-y-5"
    >
      {/* Test account notice — TEMP, gỡ khi backend thật sẵn sàng */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 font-bold mt-0.5" aria-hidden>ℹ</span>
          <div className="flex-1">
            <div className="font-semibold text-amber-900">Tài khoản test tạm thời</div>
            <div className="mt-1 text-amber-800">
              Email: <code className="bg-white/60 px-1.5 py-0.5 rounded font-mono">test@ezsim.vn</code>
              {" · "}
              Mật khẩu: <code className="bg-white/60 px-1.5 py-0.5 rounded font-mono">123456</code>
            </div>
            <button
              type="button"
              onClick={fillTestAccount}
              className="mt-2 text-xs font-semibold text-amber-900 hover:text-amber-700 underline underline-offset-2"
            >
              Điền sẵn tài khoản test
            </button>
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-navy mb-1.5"
        >
          Email
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon icon="envelope" className="text-sm" />
          </span>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            {...register("email")}
            className={`input pl-10 ${errors.email ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <span>⚠</span> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-navy"
          >
            Mật khẩu
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:text-primary-dark hover:underline transition"
            tabIndex={0}
          >
            Quên mật khẩu?
          </Link>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon icon="lock" className="text-sm" />
          </span>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
            className={`input pl-10 pr-12 ${errors.password ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            tabIndex={0}
          >
            <Icon icon={showPassword ? "eye-slash" : "eye"} className="text-sm" />
          </button>
        </div>
        {errors.password && (
          <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <span>⚠</span> {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="btn btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang đăng nhập...
          </>
        ) : (
          <>
            Đăng nhập
            <Icon icon="arrow-right" className="text-sm" />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 whitespace-nowrap">chưa có tài khoản?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Register link */}
      <Link
        href="/register"
        className="btn btn-outline w-full py-3 text-sm hover:shadow-btn transition"
      >
        Tạo tài khoản mới
      </Link>
    </form>
  );
}
