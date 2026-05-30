"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/registerSchema";
import { useRegister } from "@/hooks/useRegister";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { handleRegister, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(handleRegister)} noValidate className="space-y-4">

      {/* Name + Phone — 2 columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="reg-name" label="Họ và tên" error={errors.name?.message}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="user" className="text-sm" />
            </span>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              disabled={isLoading}
              {...register("name")}
              className={`input pl-10 ${errors.name ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
        </Field>

        <Field id="reg-phone" label="Số điện thoại" error={errors.phone?.message}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="phone" className="text-sm" />
            </span>
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              placeholder="0987 654 321"
              disabled={isLoading}
              {...register("phone")}
              className={`input pl-10 ${errors.phone ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
        </Field>
      </div>

      {/* Email */}
      <Field id="reg-email" label="Email" error={errors.email?.message}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon icon="envelope" className="text-sm" />
          </span>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            {...register("email")}
            className={`input pl-10 ${errors.email ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
        </div>
      </Field>

      {/* Password + Confirm — 2 columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="reg-password" label="Mật khẩu" error={errors.password?.message}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="lock" className="text-sm" />
            </span>
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
            >
              <Icon icon={showPassword ? "eye-slash" : "eye"} className="text-sm" />
            </button>
          </div>
        </Field>

        <Field id="reg-confirm" label="Xác nhận mật khẩu" error={errors.confirmPassword?.message}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="lock" className="text-sm" />
            </span>
            <input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("confirmPassword")}
              className={`input pl-10 pr-12 ${errors.confirmPassword ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
              aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <Icon icon={showConfirm ? "eye-slash" : "eye"} className="text-sm" />
            </button>
          </div>
        </Field>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="btn btn-primary w-full py-3.5 text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang tạo tài khoản...
          </>
        ) : (
          <>
            Tạo tài khoản
            <Icon icon="arrow-right" className="text-sm" />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 whitespace-nowrap">đã có tài khoản?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Login link */}
      <Link
        href="/login"
        className="btn btn-outline w-full py-3 text-sm hover:shadow-btn transition"
      >
        Đăng nhập
      </Link>
    </form>
  );
}
