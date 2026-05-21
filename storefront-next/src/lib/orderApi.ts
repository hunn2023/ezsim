import { CheckoutFormData } from "./schemas/checkoutSchema";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CreateOrderPayload {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  shipping: {
    province: string;
    district: string;
    ward: string;
    addressDetail: string;
  };
  items: OrderItem[];
  paymentMethod: "cod" | "banking";
  orderNote?: string;
  totalAmount: number;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

export class OrderApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "OrderApiError";
    this.statusCode = statusCode;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const TIMEOUT_MS = 30000;

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OrderApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof OrderApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new OrderApiError("Yêu cầu bị timeout", 408);
      }
      throw new OrderApiError(error.message, 500);
    }

    throw new OrderApiError("Lỗi không xác định", 500);
  }
}

export function mapFormDataToPayload(
  formData: CheckoutFormData,
  items: OrderItem[],
  totalAmount: number
): CreateOrderPayload {
  return {
    customer: {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || undefined,
    },
    shipping: {
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      addressDetail: formData.addressDetail,
    },
    items,
    paymentMethod: formData.paymentMethod,
    orderNote: formData.orderNote || undefined,
    totalAmount,
  };
}