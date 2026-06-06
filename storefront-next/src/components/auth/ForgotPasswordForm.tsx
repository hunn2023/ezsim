"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import {
  forgotPasswordEmailSchema,
  forgotPasswordOtpSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailFormData,
  type ForgotPasswordOtpFormData,
  type ResetPasswordFormData,
} from "@/lib/schemas/forgotPasswordSchema";

export default function ForgotPasswordForm() {
  const {
    step,
    maskedEmail,
    isLoading,
    remainingMs,
    requestOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
    backToEmail,
    backToOtp,
  } = useForgotPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    mode: "onBlur",
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<ForgotPasswordOtpFormData>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    mode: "onBlur",
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const [countdownMs, setCountdownMs] = useState(remainingMs);

  useEffect(() => {
    setCountdownMs(remainingMs);
  }, [remainingMs, step]);

  useEffect(() => {
    if (step !== "otp") return;
    const timer = window.setInterval(() => {
      setCountdownMs((current) => Math.max(0, current - 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step]);

  const countdownLabel = useMemo(() => {
    const minutes = Math.floor(countdownMs / 60000);
    const seconds = Math.floor((countdownMs % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [countdownMs]);

  if (step === "email") {
    return (
      <form onSubmit={handleEmailSubmit((data) => requestOtp(data.email))} noValidate className="space-y-5">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-navy mb-1.5">
            Email tài khoản
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="envelope" className="text-sm" />
            </span>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isLoading}
              {...registerEmail("email")}
              className={`input pl-10 ${emailErrors.email ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
          {emailErrors.email && (
            <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
              <span aria-hidden>⚠</span> {emailErrors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang gửi OTP..." : "Nhận mã OTP"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Đã nhớ mật khẩu?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
            Quay lại đăng nhập
          </Link>
        </p>
      </form>
    );
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit((data) => verifyOtp(data.otp))} noValidate className="space-y-5">
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-sm font-semibold text-navy">Nhập mã OTP đã gửi về email</p>
          <p className="mt-1 text-sm text-slate-600">
            Chúng tôi đã gửi mã OTP tới <span className="font-semibold text-navy">{maskedEmail}</span>.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Mã còn hiệu lực: <span className={`font-semibold ${countdownMs > 0 ? "text-primary" : "text-danger"}`}>{countdownMs > 0 ? countdownLabel : "Đã hết hạn"}</span>
          </p>
        </div>

        <div>
          <label htmlFor="forgot-otp" className="block text-sm font-medium text-navy mb-1.5">
            Mã OTP (6 số)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon icon="shield-alt" className="text-sm" />
            </span>
            <input
              id="forgot-otp"
              type="text"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="Nhập mã OTP"
              disabled={isLoading}
              {...registerOtp("otp")}
              className={`input pl-10 tracking-[0.3em] ${otpErrors.otp ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
            />
          </div>
          {otpErrors.otp && (
            <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
              <span aria-hidden>⚠</span> {otpErrors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Xác thực OTP
        </button>

        <div className="flex items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={resendOtp}
            disabled={isLoading}
            className="font-semibold text-primary hover:text-primary-dark transition disabled:opacity-60"
          >
            Gửi lại mã
          </button>
          <button
            type="button"
            onClick={backToEmail}
            disabled={isLoading}
            className="font-semibold text-gray-500 hover:text-navy transition disabled:opacity-60"
          >
            Đổi email khác
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetSubmit((data) => resetPassword(data.password))} noValidate className="space-y-5">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        OTP hợp lệ. Hãy đặt mật khẩu mới cho tài khoản của bạn.
      </div>

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-navy mb-1.5">
          Mật khẩu mới
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon icon="lock" className="text-sm" />
          </span>
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isLoading}
            {...registerReset("password")}
            className={`input pl-10 pr-12 ${resetErrors.password ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Icon icon={showPassword ? "eye-slash" : "eye"} className="text-sm" />
          </button>
        </div>
        {resetErrors.password && (
          <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <span aria-hidden>⚠</span> {resetErrors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-navy mb-1.5">
          Xác nhận mật khẩu mới
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon icon="lock" className="text-sm" />
          </span>
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isLoading}
            {...registerReset("confirmPassword")}
            className={`input pl-10 pr-12 ${resetErrors.confirmPassword ? "input-error" : ""} disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition"
            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Icon icon={showConfirmPassword ? "eye-slash" : "eye"} className="text-sm" />
          </button>
        </div>
        {resetErrors.confirmPassword && (
          <p role="alert" className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <span aria-hidden>⚠</span> {resetErrors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Đang cập nhật..." : "Đặt mật khẩu mới"}
      </button>

      <button
        type="button"
        onClick={backToOtp}
        disabled={isLoading}
        className="btn btn-outline w-full py-3 text-sm"
      >
        Quay lại bước OTP
      </button>
    </form>
  );
}
