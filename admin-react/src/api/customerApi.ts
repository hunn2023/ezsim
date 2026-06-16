import { useAuthStore } from '@/stores/authStore'
import { orderApi } from '@/api/orderApi'
import type { Customer, CustomerDetail, CustomerStatus, CustomersResponse } from '@/types/customer'
import type { Order, OrdersResponse } from '@/types/order'

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
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

async function withDevFallback<T>(apiFn: () => Promise<T>, mockFn: () => T | Promise<T>): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try { return await apiFn() } catch { return await mockFn() }
}

// ─── Dev mock ─────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C-1001', fullName: 'Nguyễn Văn An',      email: 'nguyenvanan@gmail.com',    phone: '0987123456', orderCount:  8, totalSpent: 245_300_000, status: 'active',   createdAt: '2025-02-12T08:30:00Z' },
  { id: 'C-1002', fullName: 'Trần Thị Mai',       email: 'tranthimai@techvn.com',    phone: '0912333444', orderCount: 12, totalSpent:  58_420_000, status: 'active',   createdAt: '2025-03-04T10:15:00Z' },
  { id: 'C-1003', fullName: 'Lê Hoàng Nam',       email: 'namle@hoangnamcorp.vn',    phone: '0909555666', orderCount:  3, totalSpent:   4_750_000, status: 'active',   createdAt: '2025-04-21T16:00:00Z' },
  { id: 'C-1004', fullName: 'Phạm Minh Tuấn',     email: 'tuanpm@devworld.io',       phone: '0934111222', orderCount:  5, totalSpent:   6_320_000, status: 'active',   createdAt: '2025-05-09T09:20:00Z' },
  { id: 'C-1005', fullName: 'Hoàng Bảo Trâm',     email: 'tramhoang@luxbeauty.vn',   phone: '0989888999', orderCount:  2, totalSpent: 170_000_000, status: 'active',   createdAt: '2025-06-18T11:10:00Z' },
  { id: 'C-1006', fullName: 'Đặng Quốc Bảo',      email: 'baodq@vinagame.com',       phone: '0922111333', orderCount:  1, totalSpent:   1_450_000, status: 'inactive', createdAt: '2025-07-02T08:00:00Z' },
  { id: 'C-1007', fullName: 'Vũ Thị Hoa',         email: 'hoavu@gmail.com',          phone: '0978222555', orderCount:  6, totalSpent:   3_200_000, status: 'active',   createdAt: '2025-07-25T13:45:00Z' },
  { id: 'C-1008', fullName: 'Ngô Văn Đức',        email: 'duc.ngo@startup.vn',       phone: '0945667788', orderCount:  4, totalSpent:  12_000_000, status: 'active',   createdAt: '2025-08-30T07:30:00Z' },
  { id: 'C-1009', fullName: 'Đinh Thị Lan',       email: 'lan.dinh@yahoo.com',       phone: '0911234567', orderCount:  0, totalSpent:           0, status: 'blocked',  createdAt: '2025-09-14T10:20:00Z' },
  { id: 'C-1010', fullName: 'Bùi Quang Minh',     email: 'minhbq@finance.vn',        phone: '0932111444', orderCount:  9, totalSpent:  98_500_000, status: 'active',   createdAt: '2025-10-05T09:00:00Z' },
  { id: 'C-1011', fullName: 'Cao Thị Thu',        email: 'thucao@retailgroup.vn',    phone: '0966999888', orderCount:  7, totalSpent:  44_800_000, status: 'active',   createdAt: '2025-11-19T14:00:00Z' },
  { id: 'C-1012', fullName: 'Hồ Văn Thịnh',       email: 'thinhho@gmail.com',        phone: '0901234567', orderCount:  2, totalSpent:     940_000, status: 'inactive', createdAt: '2025-12-08T07:25:00Z' },
  { id: 'C-1013', fullName: 'Phan Thị Hương',     email: 'huong.phan@edutech.vn',    phone: '0976111222', orderCount: 15, totalSpent:  21_600_000, status: 'active',   createdAt: '2026-01-12T08:50:00Z' },
  { id: 'C-1014', fullName: 'Đỗ Quang Huy',       email: 'huy.do@mediahouse.vn',     phone: '0955777999', orderCount:  3, totalSpent:   2_750_000, status: 'active',   createdAt: '2026-02-03T10:00:00Z' },
  { id: 'C-1015', fullName: 'Trịnh Thu Hằng',     email: 'hang.trinh@gmail.com',     phone: '0967888333', orderCount:  1, totalSpent:     320_000, status: 'active',   createdAt: '2026-03-22T11:30:00Z' },
  { id: 'C-1016', fullName: 'Nguyễn Hoài Phong',  email: 'phong.nguyen@logistics.vn',phone: '0918999444', orderCount: 22, totalSpent: 312_000_000, status: 'active',   createdAt: '2026-04-15T09:00:00Z' },
  { id: 'C-1017', fullName: 'Lương Thị Tuyết',    email: 'tuyet.luong@boutique.vn',  phone: '0944222111', orderCount:  4, totalSpent:  18_700_000, status: 'inactive', createdAt: '2026-04-28T14:30:00Z' },
  { id: 'C-1018', fullName: 'Mai Văn Hùng',       email: 'hung.mai@autoworld.vn',    phone: '0985666777', orderCount: 11, totalSpent:  76_300_000, status: 'active',   createdAt: '2026-05-10T08:00:00Z' },
]

// Extra fields keyed by customer id (only what's needed for the detail page)
const MOCK_CUSTOMER_EXTRAS: Record<string, Pick<CustomerDetail, 'address' | 'city' | 'note' | 'lastLoginAt'>> = {
  'C-1001': { address: 'Tòa nhà Landmark 81, Vinhomes Central Park', city: 'TP. Hồ Chí Minh', lastLoginAt: '2026-05-18T14:00:00Z' },
  'C-1002': { address: '24 Phố Hàng Bài, Hoàn Kiếm',                  city: 'Hà Nội',            lastLoginAt: '2026-05-18T10:30:00Z' },
  'C-1003': { address: '154 Nguyễn Thái Học',                          city: 'Đà Nẵng',           lastLoginAt: '2026-05-17T15:20:00Z' },
  'C-1004': { address: '50 Lý Tự Trọng, Quận 1',                       city: 'TP. Hồ Chí Minh',   note: 'Khách VIP, hỗ trợ ưu tiên' },
  'C-1005': { address: 'Khu biệt thự Chateau, Phú Mỹ Hưng',            city: 'TP. Hồ Chí Minh',   lastLoginAt: '2026-05-16T18:00:00Z' },
  'C-1006': { address: '88 Trần Hưng Đạo',                             city: 'Hải Phòng' },
  'C-1007': { address: 'Số 12 Ngõ 41 Đông Tác',                        city: 'Hà Nội' },
  'C-1008': { address: '301 Nguyễn Văn Linh',                          city: 'TP. Hồ Chí Minh' },
  'C-1009': { address: '15B Lê Lai',                                   city: 'Đà Nẵng',           note: 'Tài khoản bị khóa do vi phạm điều khoản' },
  'C-1010': { address: '72 Cách Mạng Tháng 8',                         city: 'TP. Hồ Chí Minh' },
  'C-1011': { address: '23 Phan Đình Phùng',                           city: 'Huế' },
  'C-1012': { address: '99 Lê Duẩn',                                   city: 'Hà Nội' },
}

function buildCustomerDetail(c: Customer): CustomerDetail {
  return { ...c, ...(MOCK_CUSTOMER_EXTRAS[c.id] ?? {}) }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface CustomerFilter {
  keyword?: string
  status?: CustomerStatus | ''
  fromDate?: string  // YYYY-MM-DD
  toDate?: string    // YYYY-MM-DD
}

export const customerApi = {
  getAll: (filter: CustomerFilter = {}) =>
    withDevFallback(
      () => {
        const params = new URLSearchParams()
        if (filter.keyword) params.set('keyword', filter.keyword)
        if (filter.status) params.set('status', filter.status)
        if (filter.fromDate) params.set('fromDate', filter.fromDate)
        if (filter.toDate) params.set('toDate', filter.toDate)
        const qs = params.toString()
        return authRequest<CustomersResponse>(`/api/admin/customers${qs ? `?${qs}` : ''}`)
      },
      () => {
        let data = [...MOCK_CUSTOMERS]
        const { keyword, status, fromDate, toDate } = filter

        if (keyword) {
          const kw = keyword.toLowerCase()
          data = data.filter((c) =>
            c.fullName.toLowerCase().includes(kw) ||
            c.email.toLowerCase().includes(kw) ||
            c.phone.includes(keyword),
          )
        }
        if (status) data = data.filter((c) => c.status === status)
        if (fromDate) data = data.filter((c) => c.createdAt.slice(0, 10) >= fromDate)
        if (toDate)   data = data.filter((c) => c.createdAt.slice(0, 10) <= toDate)

        return { data, total: data.length } satisfies CustomersResponse
      },
    ),

  getById: (id: string) =>
    withDevFallback(
      () => authRequest<CustomerDetail>(`/api/admin/customers/${id}`),
      () => {
        const c = MOCK_CUSTOMERS.find((c) => c.id === id)
        if (!c) throw Object.assign(new Error('Không tìm thấy khách hàng'), { status: 404 })
        return buildCustomerDetail(c)
      },
    ),

  getOrders: (id: string) =>
    withDevFallback(
      () => authRequest<OrdersResponse>(`/api/admin/customers/${id}/orders`),
      async () => {
        const c = MOCK_CUSTOMERS.find((c) => c.id === id)
        if (!c) throw Object.assign(new Error('Không tìm thấy khách hàng'), { status: 404 })
        // Join orders to this customer via phone number (the natural mock key)
        const res = await orderApi.getAll({ phone: c.phone })
        const data: Order[] = res.data.filter((o) => o.customerPhone === c.phone)
        return { data, total: data.length } satisfies OrdersResponse
      },
    ),
}

export type { Customer, CustomerDetail, CustomerStatus }
