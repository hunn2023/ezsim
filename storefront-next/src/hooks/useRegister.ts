"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register, AuthApiError } from "@/lib/authApi";
import type { RegisterPayload } from "@/types/auth";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (payload: RegisterPayload) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await register(payload);
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

  return { handleRegister, isLoading };
}
