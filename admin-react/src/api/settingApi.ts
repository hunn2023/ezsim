import { useAuthStore } from '@/stores/authStore'
import type { AppSettings } from '@/types/setting'

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

async function withDevFallback<T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try { return await apiFn() } catch { return mockFn() }
}

// ─── Dev mock ─────────────────────────────────────────────────────────────────

let mockSettings: AppSettings = {
  store: {
    name: 'EZSIM',
    hotline: '1900 1234',
    supportEmail: 'support@ezsim.vn',
    address: '12 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
    workingHours: 'T2–T7: 8h00 – 22h00 · CN: 9h00 – 18h00',
    logo: '',
    favicon: '',
  },
  seo: {
    title: 'EZSIM — eSIM, thẻ cào & data 4G/5G chính hãng',
    description: 'Mua eSIM du lịch quốc tế, thẻ cào di động, data 4G/5G và thẻ game tại EZSIM. Giao mã tức thì, hỗ trợ 24/7.',
    keywords: 'esim, esim du lịch, thẻ cào, thẻ game, data 4g, data 5g',
    ogImage: '',
  },
  social: {
    facebook: 'https://facebook.com/ezsim.vn',
    zalo: 'https://zalo.me/0123456789',
    instagram: '',
    youtube: '',
    tiktok: '',
  },
  payment: {
    providers: [
      { key: 'vnpay',   label: 'VNPay',   enabled: true  },
      { key: 'momo',    label: 'MoMo',    enabled: true  },
      { key: 'zalopay', label: 'ZaloPay', enabled: true  },
      { key: 'vietqr',  label: 'VietQR',  enabled: true  },
      { key: 'cod',     label: 'COD',     enabled: false },
    ],
  },
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const settingApi = {
  getAll: () =>
    withDevFallback(
      () => authRequest<AppSettings>('/api/admin/settings'),
      () => structuredClone(mockSettings),
    ),

  update: (data: AppSettings) =>
    withDevFallback(
      () => authRequest<AppSettings>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      () => {
        mockSettings = structuredClone(data)
        return structuredClone(mockSettings)
      },
    ),
}
