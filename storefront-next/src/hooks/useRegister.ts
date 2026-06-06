"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register, AuthApiError } from "@/lib/authApi";
import type { RegisterPayload } from "@/types/auth";

const OTP_LENGTH = 6;
const OTP_EXPIRES_IN_MS = 5 * 60 * 1000;

interface RegisterOtpSession {
  email: string;
  maskedEmail: string;
  code: string;
  expiresAt: number;
  payload: RegisterPayload;
}

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function maskEmail(email: string): string {
  const [localPart, domain = ""] = email.split("@");
  if (!localPart) return email;

  const start = localPart.slice(0, 2);
  const end = localPart.length > 2 ? localPart.slice(-1) : "";
  const masked = "*".repeat(Math.max(localPart.length - 3, 2));
  return `${start}${masked}${end}@${domain}`;
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSession, setOtpSession] = useState<RegisterOtpSession | null>(null);
  const router = useRouter();

  const requestOtp = async (payload: RegisterPayload) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const code = generateOtpCode();
      const nextSession: RegisterOtpSession = {
        email: payload.email,
        maskedEmail: maskEmail(payload.email),
        code,
        expiresAt: Date.now() + OTP_EXPIRES_IN_MS,
        payload,
      };

      setOtpSession(nextSession);
      toast.success(`Mã OTP đã được gửi tới ${nextSession.maskedEmail}.`);
      if (process.env.NODE_ENV !== "production") {
        toast.info(`Mã OTP demo: ${code}`);
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    if (!otpSession) return;

    const nextCode = generateOtpCode();
    const nextSession = {
      ...otpSession,
      code: nextCode,
      expiresAt: Date.now() + OTP_EXPIRES_IN_MS,
    };

    setOtpSession(nextSession);
    toast.success(`Đã gửi lại mã OTP tới ${nextSession.maskedEmail}.`);
    if (process.env.NODE_ENV !== "production") {
      toast.info(`Mã OTP demo mới: ${nextCode}`);
    }
  };

  const cancelOtp = () => {
    setOtpSession(null);
  };

  const verifyOtpAndRegister = async (otpCode: string) => {
    if (isLoading || !otpSession) return;

    const normalizedCode = otpCode.trim();

    if (normalizedCode.length !== OTP_LENGTH) {
      toast.error("Mã OTP phải gồm 6 chữ số.");
      return;
    }

    if (Date.now() > otpSession.expiresAt) {
      toast.error("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
      return;
    }

    if (normalizedCode !== otpSession.code) {
      toast.error("Mã OTP không chính xác.");
      return;
    }

    setIsLoading(true);

    try {
      await register(otpSession.payload);
      setOtpSession(null);
      toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestOtp,
    verifyOtpAndRegister,
    resendOtp,
    cancelOtp,
    otpSession,
    isLoading,
  };
}
