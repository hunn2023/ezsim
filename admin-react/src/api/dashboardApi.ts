import { useAuthStore } from '@/stores/authStore'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000'

async function authRequest<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const token = useAuthStore.getState().token
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }
  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string }
    const err = new Error(body.message ?? res.statusText) as Error & { status: number }
    err.status = res.status
    throw err
  }
  return res.json() as Promise<T>
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  ordersByStatus: {
    pending: number
    processing: number
    completed: number
    cancelled: number
  }
  revenueChart: { date: string; amount: number }[]
}

export interface RecentOrder {
  id: string
  orderCode: string
  customerName: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
}

export interface OrdersResponse {
  data: RecentOrder[]
  total: number
}

// ─── Dev mock data ────────────────────────────────────────────────────────────

const MOCK_STATS: DashboardStats = {
  totalOrders: 1_248,
  totalRevenue: 345_800_000,
  totalProducts: 87,
  totalCustomers: 3_412,
  ordersByStatus: {
    pending: 18,
    processing: 34,
    completed: 1_156,
    cancelled: 40,
  },
  revenueChart: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toISOString().slice(0, 10),
    amount: Math.round((8 + Math.sin(i) * 4 + Math.random() * 6) * 1_000_000),
  })),
}

const MOCK_ORDERS: RecentOrder[] = [
  { id: '1', orderCode: 'ORD-20240521-001', customerName: 'Nguyễn Văn An', total: 350_000, status: 'completed', paymentStatus: 'paid', createdAt: new Date(Date.now() - 1 * 3_600_000).toISOString() },
  { id: '2', orderCode: 'ORD-20240521-002', customerName: 'Trần Thị Bích', total: 120_000, status: 'processing', paymentStatus: 'processing', createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString() },
  { id: '3', orderCode: 'ORD-20240521-003', customerName: 'Lê Hoàng Minh', total: 89_000, status: 'pending', paymentStatus: 'pending', createdAt: new Date(Date.now() - 4 * 3_600_000).toISOString() },
  { id: '4', orderCode: 'ORD-20240520-098', customerName: 'Phạm Thị Lan', total: 450_000, status: 'completed', paymentStatus: 'paid', createdAt: new Date(Date.now() - 26 * 3_600_000).toISOString() },
  { id: '5', orderCode: 'ORD-20240520-097', customerName: 'Hoàng Đức Thịnh', total: 200_000, status: 'cancelled', paymentStatus: 'cancelled', createdAt: new Date(Date.now() - 28 * 3_600_000).toISOString() },
]

// ─── API (with dev fallback when backend is not running) ──────────────────────

async function withDevFallback<T>(apiFn: () => Promise<T>, mockData: T): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try {
    return await apiFn()
  } catch {
    return mockData
  }
}

export const dashboardApi = {
  getStats: () =>
    withDevFallback(
      () => authRequest<DashboardStats>('/api/admin/dashboard'),
      MOCK_STATS,
    ),

  getRecentOrders: () =>
    withDevFallback(
      () => authRequest<OrdersResponse>('/api/orders', { limit: 5 }),
      { data: MOCK_ORDERS, total: MOCK_ORDERS.length },
    ),
}
