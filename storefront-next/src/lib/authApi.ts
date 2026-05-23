import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";
import type { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const TIMEOUT_MS = 30_000;

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit,
  getErrorMessage: (status: number) => string
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new AuthApiError(
        (data as { message?: string }).message ?? getErrorMessage(response.status),
        response.status
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof AuthApiError) throw error;
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new AuthApiError("Yêu cầu bị timeout. Vui lòng thử lại.", 408);
      }
      throw new AuthApiError(error.message, 500);
    }
    throw new AuthApiError("Lỗi không xác định.", 500);
  }
}

const MOCK_USER: User = {
  id: "1",
  name: "Nguyễn Test",
  email: "test@ezsim.vn",
  phone: "0987654321",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
};

// TODO: replace with real API calls when backend is ready
export async function getMe(_token: string): Promise<User> {
  return MOCK_USER;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (payload.email === "test@ezsim.vn" && payload.password === "123456") {
    return { accessToken: "mock-token-123", user: MOCK_USER };
  }
  throw new AuthApiError("Email hoặc mật khẩu không chính xác.", 401);
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    (status) => {
      if (status === 409) return "Email này đã được sử dụng. Vui lòng dùng email khác.";
      if (status === 422) return "Thông tin đăng ký không hợp lệ.";
      if (status === 429) return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
      if (status >= 500) return "Server đang gặp sự cố. Vui lòng thử lại sau.";
      return "Đăng ký thất bại. Vui lòng thử lại.";
    }
  );
}
