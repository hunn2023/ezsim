import { CheckoutFormData } from "./schemas/checkoutSchema";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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

// ─── Order History ────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderPaymentMethod = "cod" | "banking" | "momo" | "vnpay";

export interface OrderHistoryLineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderHistoryItem {
  id: string;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  totalAmount: number;
  items: OrderHistoryLineItem[];
}

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 4;

const MOCK_ORDER_HISTORY: OrderHistoryItem[] = [
  {
    id: "ord-001",
    orderCode: "EZ241115",
    createdAt: "2024-11-15T08:30:00.000Z",
    status: "delivered",
    paymentMethod: "cod",
    totalAmount: 450000,
    items: [
      { id: "i1", name: "eSIM Nhật Bản 7 ngày 10GB", quantity: 1, price: 250000 },
      { id: "i2", name: "eSIM Hàn Quốc 5 ngày 5GB", quantity: 1, price: 200000 },
    ],
  },
  {
    id: "ord-002",
    orderCode: "EZ241020",
    createdAt: "2024-10-20T14:15:00.000Z",
    status: "shipped",
    paymentMethod: "banking",
    totalAmount: 320000,
    items: [
      { id: "i3", name: "Thẻ Viettel 100.000đ", quantity: 2, price: 100000 },
      { id: "i4", name: "Gói Data 4G Mobifone 30 ngày", quantity: 1, price: 120000 },
    ],
  },
  {
    id: "ord-003",
    orderCode: "EZ241001",
    createdAt: "2024-10-01T09:00:00.000Z",
    status: "cancelled",
    paymentMethod: "cod",
    totalAmount: 150000,
    items: [
      { id: "i5", name: "eSIM Thái Lan 3 ngày 3GB", quantity: 1, price: 150000 },
    ],
  },
  {
    id: "ord-004",
    orderCode: "EZ240915",
    createdAt: "2024-09-15T16:45:00.000Z",
    status: "delivered",
    paymentMethod: "banking",
    totalAmount: 780000,
    items: [
      { id: "i6", name: "eSIM châu Âu 14 ngày 20GB", quantity: 1, price: 580000 },
      { id: "i7", name: "Thẻ game Garena 200.000đ", quantity: 1, price: 200000 },
    ],
  },
  {
    id: "ord-005",
    orderCode: "EZ240830",
    createdAt: "2024-08-30T11:20:00.000Z",
    status: "pending",
    paymentMethod: "banking",
    totalAmount: 290000,
    items: [
      { id: "i8", name: "Thẻ game PUBG Mobile 300 UC", quantity: 1, price: 290000 },
    ],
  },
  {
    id: "ord-006",
    orderCode: "EZ240810",
    createdAt: "2024-08-10T07:55:00.000Z",
    status: "confirmed",
    paymentMethod: "cod",
    totalAmount: 195000,
    items: [
      { id: "i9", name: "Thẻ Vietnamobile 100.000đ", quantity: 1, price: 100000 },
      { id: "i10", name: "Gói Data 4G Vinaphone 30 ngày", quantity: 1, price: 95000 },
    ],
  },
  {
    id: "ord-007",
    orderCode: "EZ240720",
    createdAt: "2024-07-20T13:30:00.000Z",
    status: "delivered",
    paymentMethod: "banking",
    totalAmount: 1200000,
    items: [
      { id: "i11", name: "eSIM Mỹ 30 ngày 30GB Unlimited", quantity: 1, price: 1200000 },
    ],
  },
];

// TODO: replace with real API calls when backend is ready
export async function getMyOrders(page: number = 1): Promise<OrderHistoryResponse> {
  const start = (page - 1) * PAGE_SIZE;
  const orders = MOCK_ORDER_HISTORY.slice(start, start + PAGE_SIZE);
  return {
    orders,
    total: MOCK_ORDER_HISTORY.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getOrderById(id: string): Promise<OrderHistoryItem> {
  const order = MOCK_ORDER_HISTORY.find((o) => o.id === id);
  if (!order) throw new OrderApiError("Không tìm thấy đơn hàng.", 404);
  return order;
}

async function _getMyOrders(page: number = 1): Promise<OrderHistoryResponse> {
  const response = await fetchWithAuth(`/orders/my-orders?page=${page}&pageSize=${PAGE_SIZE}`);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new OrderApiError(
      (data as { message?: string }).message ?? "Không thể tải đơn hàng.",
      response.status
    );
  }
  return response.json() as Promise<OrderHistoryResponse>;
}