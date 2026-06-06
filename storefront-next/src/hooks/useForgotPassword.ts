"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const OTP_EXPIRES_IN_MS = 5 * 60 * 1000;

type ForgotPasswordStep = "email" | "otp" | "reset";

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

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const router = useRouter();

  const remainingMs = useMemo(() => {
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - Date.now());
  }, [expiresAt, step]);

  const requestOtp = async (nextEmail: string) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const nextOtp = generateOtpCode();
      setEmail(nextEmail);
      setMaskedEmail(maskEmail(nextEmail));
      setOtpCode(nextOtp);
      setExpiresAt(Date.now() + OTP_EXPIRES_IN_MS);
      setStep("otp");

      toast.success("Mã OTP đã được gửi tới email của bạn.");
      if (process.env.NODE_ENV !== "production") {
        toast.info(`Mã OTP demo: ${nextOtp}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    if (!email) return;

    const nextOtp = generateOtpCode();
    setOtpCode(nextOtp);
    setExpiresAt(Date.now() + OTP_EXPIRES_IN_MS);

    toast.success("Đã gửi lại mã OTP.");
    if (process.env.NODE_ENV !== "production") {
      toast.info(`Mã OTP demo mới: ${nextOtp}`);
    }
  };

  const verifyOtp = async (inputOtp: string) => {
    if (isLoading) return false;

    const normalizedOtp = inputOtp.trim();
    if (normalizedOtp.length !== OTP_LENGTH) {
      toast.error("Mã OTP phải gồm 6 chữ số.");
      return false;
    }

    if (!expiresAt || Date.now() > expiresAt) {
      toast.error("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
      return false;
    }

    if (normalizedOtp !== otpCode) {
      toast.error("Mã OTP không chính xác.");
      return false;
    }

    setStep("reset");
    toast.success("Xác thực OTP thành công. Vui lòng đặt mật khẩu mới.");
    return true;
  };

  const resetPassword = async (_password: string) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const backToEmail = () => {
    setStep("email");
    setExpiresAt(null);
  };

  const backToOtp = () => {
    setStep("otp");
  };

  return {
    isLoading,
    step,
    email,
    maskedEmail,
    remainingMs,
    requestOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
    backToEmail,
    backToOtp,
  };
}
