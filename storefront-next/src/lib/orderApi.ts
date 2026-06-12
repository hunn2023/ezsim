import { CheckoutFormData } from "./schemas/checkoutSchema";
import { fetchWithAuth } from "./fetchWithAuth";
import { useAuthStore } from "./authStore";
import type { ApiCreateOrderCommand, ApiCreateOrderItem, OrderItemType } from "@/types/api";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // For API mapping
  itemType?: OrderItemType | number;
  productId?: string;
  productVariantId?: string;
  esimPackageId?: string;
  phoneCardId?: string;
}

export interface CreateOrderPayload {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
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

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  // Map to backend API schema (CreateOrderCommand)
  const apiItems: ApiCreateOrderItem[] = payload.items.map((item) => ({
    itemType: item.itemType ?? 1, // default EsimPackage
    productId: item.productId || item.id,
    productVariantId: item.productVariantId || null,
    esimPackageId: item.esimPackageId || item.id,
    phoneCardId: item.phoneCardId || null,
    productName: item.name,
    variantName: null,
    sku: null,
    quantity: item.quantity,
    unitPrice: item.price,
  }));

  const apiPayload: ApiCreateOrderCommand = {
    customerId: useAuthStore.getState().user?.id,
    customerEmail: payload.customer.email || undefined,
    customerPhone: payload.customer.phone,
    customerName: payload.customer.fullName,
    currency: "VND",
    note: payload.orderNote || undefined,
    items: apiItems,
  };

  try {
    const response = await fetchWithAuth("/api/orders", {
      method: "POST",
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OrderApiError(
        (errorData as { message?: string }).message || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const json = await response.json();
    const data = json.data ?? json;
    // data may be a string (orderId directly) or an object with id/orderId
    const orderId = typeof data === "string" ? data : (data.id || data.orderId);
    return {
      success: true,
      orderId,
      message: "Đặt hàng thành công!",
    };
  } catch (error) {
    if (error instanceof OrderApiError) throw error;
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
    items,
    paymentMethod: formData.paymentMethod,
    orderNote: formData.orderNote || undefined,
    totalAmount,
  };
}

// ─── Payment QR ───────────────────────────────────────────────────────────────

export interface PaymentQrData {
  qrCodeUrl?: string;
  qrDataUrl?: string;
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: number;
  content?: string;
  orderId?: string;
  transactionId?: string;
  expiredAt?: string;
}

export interface PaymentStatusData {
  orderId?: string;
  status?: string | number;
  paymentStatus?: string | number;
  amount?: number;
  paidAt?: string;
  transactionId?: string;
}

export async function confirmOrder(orderId: string, paymentMethod: string = "banking") {
  const response = await fetchWithAuth(`/api/orders/${orderId}/confirm`, {
    method: "POST",
    body: JSON.stringify({ paymentMethod }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new OrderApiError(
      (errorData as { error?: string }).error || `Không thể xác nhận đơn hàng. HTTP ${response.status}`,
      response.status
    );
  }
  const json = await response.json();
  return json.data ?? json;
}

export async function createPaymentQr(orderId: string): Promise<PaymentQrData> {
  const response = await fetchWithAuth("/api/payments/qr", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new OrderApiError(
      (errorData as { error?: string }).error || "Không thể tạo mã QR thanh toán.",
      response.status
    );
  }
  const json = await response.json();
  return json.data ?? json;
}

export async function getPaymentStatus(orderId: string): Promise<PaymentStatusData> {
  const response = await fetchWithAuth(`/api/payments/orders/${orderId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new OrderApiError("Không thể kiểm tra trạng thái thanh toán.", response.status);
  }
  const json = await response.json();
  return json.data ?? json;
}

// ─── Order Detail ─────────────────────────────────────────────────────────────

export async function getOrderDetail(orderId: string) {
  const response = await fetchWithAuth(`/api/orders/${orderId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new OrderApiError("Không tìm thấy đơn hàng.", response.status);
  }
  const json = await response.json();
  return json.data ?? json;
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
  paymentStatus?: string;
  paymentMethod: OrderPaymentMethod;
  totalAmount: number;
  subTotal?: number;
  discountAmount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paidAt?: string;
  items: OrderHistoryLineItem[];
}

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 10;

// Map backend integer status to string (enum starts from 1)
function mapOrderStatus(status: number | string): OrderStatus {
  if (typeof status === "string") {
    const lower = status.toLowerCase();
    if (lower === "pending" || lower === "new") return "pending";
    if (lower === "confirmed") return "confirmed";
    if (lower === "processing") return "processing";
    if (lower === "shipped") return "shipped";
    if (lower === "delivered") return "delivered";
    if (lower === "cancelled") return "cancelled";
    if (lower === "refunded") return "refunded";
    return "pending";
  }
  const map: Record<number, OrderStatus> = {
    1: "pending",
    2: "confirmed",
    3: "processing",
    4: "shipped",
    5: "delivered",
    6: "cancelled",
    7: "refunded",
  };
  return map[status] ?? "pending";
}

function mapPaymentMethod(method: number | string | null | undefined): OrderPaymentMethod {
  if (typeof method === "string") {
    const lower = method.toLowerCase();
    if (lower === "cod") return "cod";
    if (lower === "momo") return "momo";
    if (lower === "vnpay") return "vnpay";
    return "banking";
  }
  // Integer enum: 0=COD, 1=Banking, 2=Momo, 3=VNPay
  if (method === 0) return "cod";
  if (method === 2) return "momo";
  if (method === 3) return "vnpay";
  return "banking";
}

/* eslint-disable */
function mapApiOrderToHistoryItem(apiOrder: any): OrderHistoryItem {
  const items: OrderHistoryLineItem[] = (apiOrder.items || apiOrder.orderItems || []).map(
    (item: any) => ({
      id: item.id || item.productId || "",
      name: item.productName || item.name || "Sản phẩm",
      quantity: item.quantity || 1,
      price: item.unitPrice || item.price || 0,
      image: item.image || item.imageUrl || undefined,
    })
  );

  return {
    id: apiOrder.id,
    orderCode: apiOrder.orderCode || apiOrder.id?.substring(0, 8).toUpperCase() || "",
    createdAt: apiOrder.createdAt || new Date().toISOString(),
    status: mapOrderStatus(apiOrder.status),
    paymentStatus: apiOrder.paymentStatus != null ? String(apiOrder.paymentStatus) : undefined,
    paymentMethod: mapPaymentMethod(apiOrder.paymentMethod),
    totalAmount: apiOrder.totalAmount || 0,
    subTotal: apiOrder.subTotal,
    discountAmount: apiOrder.discountAmount,
    customerName: apiOrder.customerName,
    customerEmail: apiOrder.customerEmail,
    customerPhone: apiOrder.customerPhone,
    paidAt: apiOrder.paidAt,
    items,
  };
}
/* eslint-enable */

export interface OrderFilters {
  customerId?: string;
  keyword?: string;
  status?: number;
  paymentStatus?: number;
}

export async function getMyOrders(page: number = 1, filters: OrderFilters = {}): Promise<OrderHistoryResponse> {
  const params = new URLSearchParams({
    pageIndex: page.toString(),
    pageSize: PAGE_SIZE.toString(),
  });
  if (filters.customerId) params.set("customerId", filters.customerId);
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.status) params.set("status", filters.status.toString());
  if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus.toString());

  const response = await fetchWithAuth(`/api/orders/paged?${params.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new OrderApiError("Không thể tải danh sách đơn hàng.", response.status);
  }

  const json = await response.json();
  const data = json.data ?? json;

  // Handle paged response: { items: [], totalCount, pageIndex, pageSize }
  // or possibly an array directly
  if (Array.isArray(data)) {
    return {
      orders: data.map(mapApiOrderToHistoryItem),
      total: data.length,
      page,
      pageSize: PAGE_SIZE,
    };
  }

  const items = data.items || data.orders || [];
  const total = data.totalCount ?? data.total ?? items.length;

  return {
    orders: items.map(mapApiOrderToHistoryItem),
    total,
    page,
    pageSize: data.pageSize || PAGE_SIZE,
  };
}

export async function getOrderById(id: string): Promise<OrderHistoryItem> {
  const response = await fetchWithAuth(`/api/orders/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new OrderApiError("Không tìm thấy đơn hàng.", response.status);
  }

  const json = await response.json();
  const data = json.data ?? json;
  return mapApiOrderToHistoryItem(data);
}

