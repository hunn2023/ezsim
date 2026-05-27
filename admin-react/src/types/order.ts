export type OrderPaymentStatus = 'pending' | 'processing' | 'paid' | 'error' | 'cancelled' | 'refunded'

export type OrderFulfillmentStatus =
  | 'qr_code_esim'
  | 'activation_code'
  | 'manual_processing'
  | 'physical_sim_shipping'
  | 'delivered'
  | 'cancelled'

export type PaymentProvider = 'VNPay' | 'MoMo' | 'ZaloPay' | 'VietQR' | 'Visa/Mastercard' | 'COD'

export interface Order {
  id: string
  orderCode: string
  customerName: string
  customerPhone: string
  totalAmount: number
  paymentProvider: PaymentProvider
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  createdAt: string  // ISO 8601
}

export interface OrdersResponse {
  data: Order[]
  total: number
}

// ─── Detail types ─────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string
  productId: string
  productName: string
  variantName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderStatusEvent {
  status: OrderPaymentStatus | OrderFulfillmentStatus
  label: string
  createdAt: string
  note?: string
}

export interface OrderDetail extends Order {
  customerEmail?: string
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  shippingFee: number
  note?: string
  shippingAddress?: {
    fullName: string
    phone: string
    address: string
    city: string
  }
  paymentTransactionCode?: string
  paymentPaidAt?: string
  statusHistory?: OrderStatusEvent[]
}
