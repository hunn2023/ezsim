import { useAuthStore } from '@/stores/authStore'
import type {
  Order, OrderDetail, OrderFulfillmentStatus, OrderPaymentStatus,
  OrderStatusEvent, OrdersResponse, PaymentProvider,
} from '@/types/order'

const FULFILLMENT_LABELS: Record<OrderFulfillmentStatus, string> = {
  qr_code_esim:          'Đã gửi QR eSIM',
  activation_code:       'Đã gửi mã kích hoạt',
  manual_processing:     'Đang xử lý thủ công',
  physical_sim_shipping: 'Đang giao SIM vật lý',
  delivered:             'Đã hoàn thành',
  cancelled:             'Đã hủy đơn',
}

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000'

async function authRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string }
    const err = new Error(body.message ?? res.statusText) as Error & { status: number }
    err.status = res.status
    throw err
  }
  return res.json() as Promise<T>
}

async function withDevFallback<T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try { return await apiFn() } catch { return mockFn() }
}

// ─── Dev mock ─────────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-882910', orderCode: 'ORD-882910',
    customerName: 'Nguyễn Văn An', customerPhone: '0987123456',
    totalAmount: 120_000_000, paymentProvider: 'VNPay',
    paymentStatus: 'paid', fulfillmentStatus: 'physical_sim_shipping',
    createdAt: '2026-05-18T14:30:00Z',
  },
  {
    id: 'ORD-882911', orderCode: 'ORD-882911',
    customerName: 'Trần Thị Mai', customerPhone: '0912333444',
    totalAmount: 25_960_000, paymentProvider: 'MoMo',
    paymentStatus: 'paid', fulfillmentStatus: 'qr_code_esim',
    createdAt: '2026-05-18T11:15:00Z',
  },
  {
    id: 'ORD-882912', orderCode: 'ORD-882912',
    customerName: 'Lê Hoàng Nam', customerPhone: '0909555666',
    totalAmount: 1_230_000, paymentProvider: 'VietQR',
    paymentStatus: 'pending', fulfillmentStatus: 'manual_processing',
    createdAt: '2026-05-17T16:45:00Z',
  },
  {
    id: 'ORD-882913', orderCode: 'ORD-882913',
    customerName: 'Phạm Minh Tuấn', customerPhone: '0934111222',
    totalAmount: 850_000, paymentProvider: 'ZaloPay',
    paymentStatus: 'paid', fulfillmentStatus: 'activation_code',
    createdAt: '2026-05-17T09:20:00Z',
  },
  {
    id: 'ORD-882914', orderCode: 'ORD-882914',
    customerName: 'Hoàng Bảo Trâm', customerPhone: '0989888999',
    totalAmount: 85_000_000, paymentProvider: 'Visa/Mastercard',
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    createdAt: '2026-05-16T18:10:00Z',
  },
  {
    id: 'ORD-882915', orderCode: 'ORD-882915',
    customerName: 'Đặng Quốc Bảo', customerPhone: '0922111333',
    totalAmount: 1_450_000, paymentProvider: 'VNPay',
    paymentStatus: 'error', fulfillmentStatus: 'cancelled',
    createdAt: '2026-05-15T10:05:00Z',
  },
  {
    id: 'ORD-882916', orderCode: 'ORD-882916',
    customerName: 'Vũ Thị Hoa', customerPhone: '0978222555',
    totalAmount: 350_000, paymentProvider: 'MoMo',
    paymentStatus: 'paid', fulfillmentStatus: 'activation_code',
    createdAt: '2026-05-14T08:30:00Z',
  },
  {
    id: 'ORD-882917', orderCode: 'ORD-882917',
    customerName: 'Ngô Văn Đức', customerPhone: '0945667788',
    totalAmount: 2_500_000, paymentProvider: 'VietQR',
    paymentStatus: 'processing', fulfillmentStatus: 'manual_processing',
    createdAt: '2026-05-13T13:00:00Z',
  },
  {
    id: 'ORD-882918', orderCode: 'ORD-882918',
    customerName: 'Đinh Thị Lan', customerPhone: '0911234567',
    totalAmount: 500_000, paymentProvider: 'ZaloPay',
    paymentStatus: 'refunded', fulfillmentStatus: 'cancelled',
    createdAt: '2026-05-12T10:20:00Z',
  },
  {
    id: 'ORD-882919', orderCode: 'ORD-882919',
    customerName: 'Bùi Quang Minh', customerPhone: '0932111444',
    totalAmount: 15_000_000, paymentProvider: 'VNPay',
    paymentStatus: 'paid', fulfillmentStatus: 'qr_code_esim',
    createdAt: '2026-05-11T09:00:00Z',
  },
  {
    id: 'ORD-882920', orderCode: 'ORD-882920',
    customerName: 'Cao Thị Thu', customerPhone: '0966999888',
    totalAmount: 8_800_000, paymentProvider: 'Visa/Mastercard',
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    createdAt: '2026-05-10T14:45:00Z',
  },
  {
    id: 'ORD-882921', orderCode: 'ORD-882921',
    customerName: 'Hồ Văn Thịnh', customerPhone: '0901234567',
    totalAmount: 420_000, paymentProvider: 'MoMo',
    paymentStatus: 'pending', fulfillmentStatus: 'manual_processing',
    createdAt: '2026-05-09T07:30:00Z',
  },
]

// Extended detail data keyed by order id
const MOCK_DETAILS: Record<string, Partial<OrderDetail>> = {
  'ORD-882910': {
    customerEmail: 'nguyenvanan@gmail.com',
    items: [
      { id: 'I1', productId: 'SIM-001', productName: 'SIM Số Đẹp Viettel 098.888.8888', variantName: 'Gói V120N - 4GB/ngày', quantity: 1, unitPrice: 125_000_000, totalPrice: 125_000_000 },
    ],
    subtotal: 125_000_000, discountAmount: 5_000_000, shippingFee: 0,
    note: 'Giao giờ hành chính, gọi trước khi đến',
    shippingAddress: { fullName: 'Nguyễn Văn An', phone: '0987123456', address: 'Tòa nhà Landmark 81, Vinhomes Central Park', city: 'TP. Hồ Chí Minh' },
    paymentTransactionCode: 'VNPAY-992103821', paymentPaidAt: '2026-05-18T14:32:10Z',
    statusHistory: [
      { status: 'paid', label: 'Đã thanh toán', createdAt: '2026-05-18T14:32:00Z' },
      { status: 'physical_sim_shipping', label: 'Đang giao SIM vật lý', createdAt: '2026-05-18T15:00:00Z' },
    ],
  },
  'ORD-882911': {
    customerEmail: 'tranthimai@techvn.com',
    items: [
      { id: 'I2', productId: 'SIM-003', productName: 'SIM Mobifone 0903.333.999 (eSIM)', variantName: 'Gói MobiData - 5GB/ngày', quantity: 1, unitPrice: 25_000_000, totalPrice: 25_000_000 },
      { id: 'I3', productId: 'CARD-002', productName: 'Thẻ nạp Viettel 500.000đ', variantName: 'Mã thẻ điện tử', quantity: 2, unitPrice: 480_000, totalPrice: 960_000 },
    ],
    subtotal: 25_960_000, discountAmount: 0, shippingFee: 0,
    note: 'Gửi mã QR eSIM qua Zalo số 0912333444',
    shippingAddress: { fullName: 'Trần Thị Mai', phone: '0912333444', address: 'Nhận qua Email và Zalo', city: 'Hà Nội' },
    paymentTransactionCode: 'MOMO-102938472', paymentPaidAt: '2026-05-18T11:16:00Z',
    statusHistory: [
      { status: 'paid', label: 'Đã thanh toán', createdAt: '2026-05-18T11:16:00Z' },
      { status: 'qr_code_esim', label: 'Đã gửi QR eSIM', createdAt: '2026-05-18T11:18:00Z' },
    ],
  },
  'ORD-882912': {
    customerEmail: 'namle@hoangnamcorp.vn',
    items: [
      { id: 'I4', productId: 'SIM-004', productName: 'SIM Wintel 055.999.9686', variantName: 'Gói WIN60', quantity: 5, unitPrice: 250_000, totalPrice: 1_250_000 },
    ],
    subtotal: 1_250_000, discountAmount: 50_000, shippingFee: 30_000,
    note: 'Khách yêu cầu kiểm tra kỹ sóng tại khu vực Hải Châu',
    shippingAddress: { fullName: 'Lê Hoàng Nam', phone: '0909555666', address: '154 Nguyễn Thái Học', city: 'Đà Nẵng' },
    paymentTransactionCode: 'VIETQR-PENDING',
    statusHistory: [
      { status: 'pending', label: 'Chờ thanh toán', createdAt: '2026-05-17T16:45:00Z' },
    ],
  },
  'ORD-882913': {
    customerEmail: 'tuanpm@devworld.io',
    items: [
      { id: 'I5', productId: 'CARD-007', productName: 'Thẻ Data Viettel ST100K - 15GB', variantName: 'Mã nạp nhanh', quantity: 10, unitPrice: 95_000, totalPrice: 950_000 },
    ],
    subtotal: 950_000, discountAmount: 100_000, shippingFee: 0,
    shippingAddress: { fullName: 'Phạm Minh Tuấn', phone: '0934111222', address: 'Nhận SMS trực tiếp', city: 'TP. Hồ Chí Minh' },
    paymentTransactionCode: 'ZALO-39281029', paymentPaidAt: '2026-05-17T09:21:05Z',
    statusHistory: [
      { status: 'paid', label: 'Đã thanh toán', createdAt: '2026-05-17T09:21:00Z' },
      { status: 'activation_code', label: 'Đã gửi mã kích hoạt', createdAt: '2026-05-17T09:22:00Z' },
    ],
  },
  'ORD-882914': {
    customerEmail: 'tramhoang@luxbeauty.vn',
    items: [
      { id: 'I6', productId: 'SIM-006', productName: 'SIM Lộc Phát Viettel 098.168.6868 (eSIM)', variantName: 'Gói V200C - 6GB/ngày', quantity: 1, unitPrice: 85_000_000, totalPrice: 85_000_000 },
    ],
    subtotal: 85_000_000, discountAmount: 0, shippingFee: 0,
    note: 'Đã gửi mã QR và kích hoạt thành công trên iPhone 16 Pro Max',
    shippingAddress: { fullName: 'Hoàng Bảo Trâm', phone: '0989888999', address: 'Khu biệt thự Chateau, Phú Mỹ Hưng', city: 'TP. Hồ Chí Minh' },
    paymentTransactionCode: 'CHASE-00219382', paymentPaidAt: '2026-05-16T18:12:30Z',
    statusHistory: [
      { status: 'paid', label: 'Đã thanh toán', createdAt: '2026-05-16T18:12:00Z' },
      { status: 'qr_code_esim', label: 'Đã gửi QR eSIM', createdAt: '2026-05-16T18:14:00Z' },
      { status: 'delivered', label: 'Đã hoàn thành', createdAt: '2026-05-16T18:30:00Z' },
    ],
  },
  'ORD-882915': {
    customerEmail: 'baodq@vinagame.com',
    items: [
      { id: 'I7', productId: 'CARD-009', productName: 'Thẻ Garena 200.000đ', variantName: 'Mã thẻ game', quantity: 5, unitPrice: 194_000, totalPrice: 970_000 },
      { id: 'I8', productId: 'CARD-010', productName: 'Thẻ Zing 100.000đ', variantName: 'Mã thẻ game', quantity: 5, unitPrice: 96_000, totalPrice: 480_000 },
    ],
    subtotal: 1_450_000, discountAmount: 0, shippingFee: 0,
    note: 'Giao dịch bị từ chối bởi ngân hàng phát hành thẻ',
    paymentTransactionCode: 'VNPAY-ERR503',
    statusHistory: [
      { status: 'error', label: 'Lỗi giao dịch', createdAt: '2026-05-15T10:05:00Z', note: 'Ngân hàng từ chối' },
      { status: 'cancelled', label: 'Đã hủy đơn', createdAt: '2026-05-15T10:10:00Z' },
    ],
  },
}

function buildDetail(o: Order): OrderDetail {
  const extra = MOCK_DETAILS[o.id] ?? {}
  return {
    ...o,
    items: extra.items ?? [{ id: 'I0', productId: 'P0', productName: '(Không có thông tin)', quantity: 1, unitPrice: o.totalAmount, totalPrice: o.totalAmount }],
    subtotal: extra.subtotal ?? o.totalAmount,
    discountAmount: extra.discountAmount ?? 0,
    shippingFee: extra.shippingFee ?? 0,
    ...extra,
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface OrderFilter {
  keyword?: string
  phone?: string
  status?: OrderPaymentStatus | ''
  paymentMethod?: PaymentProvider | ''
  fromDate?: string  // YYYY-MM-DD
  toDate?: string    // YYYY-MM-DD
}

export const orderApi = {
  getAll: (filter: OrderFilter = {}) =>
    withDevFallback(
      () => {
        const params = new URLSearchParams()
        if (filter.keyword) params.set('keyword', filter.keyword)
        if (filter.phone) params.set('phone', filter.phone)
        if (filter.status) params.set('status', filter.status)
        if (filter.paymentMethod) params.set('paymentMethod', filter.paymentMethod)
        if (filter.fromDate) params.set('fromDate', filter.fromDate)
        if (filter.toDate) params.set('toDate', filter.toDate)
        const qs = params.toString()
        return authRequest<OrdersResponse>(`/api/admin/orders${qs ? `?${qs}` : ''}`)
      },
      () => {
        let data = [...MOCK_ORDERS]
        const { keyword, phone, status, paymentMethod, fromDate, toDate } = filter

        if (keyword) data = data.filter((o) => o.orderCode.toLowerCase().includes(keyword.toLowerCase()))
        if (phone) data = data.filter((o) => o.customerPhone.includes(phone))
        if (status) data = data.filter((o) => o.paymentStatus === status)
        if (paymentMethod) data = data.filter((o) => o.paymentProvider === paymentMethod)
        if (fromDate) data = data.filter((o) => o.createdAt.slice(0, 10) >= fromDate)
        if (toDate) data = data.filter((o) => o.createdAt.slice(0, 10) <= toDate)

        return { data, total: data.length } satisfies OrdersResponse
      },
    ),

  getById: (id: string) =>
    withDevFallback(
      () => authRequest<OrderDetail>(`/api/admin/orders/${id}`),
      () => {
        const o = MOCK_ORDERS.find((o) => o.id === id)
        if (!o) throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 })
        return buildDetail(o)
      },
    ),

  updateStatus: (id: string, status: OrderFulfillmentStatus, note?: string) =>
    withDevFallback(
      () => authRequest<OrderDetail>(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }),
      () => {
        const idx = MOCK_ORDERS.findIndex((o) => o.id === id)
        if (idx === -1) throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 })

        const current = MOCK_ORDERS[idx].fulfillmentStatus
        if (current === 'delivered' || current === 'cancelled') {
          throw Object.assign(new Error('Đơn đã hoàn tất hoặc đã hủy, không thể cập nhật trạng thái'), { status: 409 })
        }

        MOCK_ORDERS[idx] = { ...MOCK_ORDERS[idx], fulfillmentStatus: status }

        const event: OrderStatusEvent = {
          status,
          label: FULFILLMENT_LABELS[status] ?? status,
          createdAt: new Date().toISOString(),
          ...(note ? { note } : {}),
        }
        const existing = MOCK_DETAILS[id] ?? {}
        MOCK_DETAILS[id] = {
          ...existing,
          statusHistory: [...(existing.statusHistory ?? []), event],
        }

        return buildDetail(MOCK_ORDERS[idx])
      },
    ),
}

export type { Order, OrderDetail, OrderFulfillmentStatus, OrderPaymentStatus, PaymentProvider }
