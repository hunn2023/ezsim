import { useAuthStore } from '@/stores/authStore'
import type { Banner, BannerPosition, BannersResponse, BannerStatus } from '@/types/banner'

export interface BannerFormData {
  title: string
  description?: string
  image: string
  linkUrl?: string
  position: BannerPosition
  sortOrder: number
  status: BannerStatus
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
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

async function withDevFallback<T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try { return await apiFn() } catch { return mockFn() }
}

// ─── Dev mock ─────────────────────────────────────────────────────────────────

const MOCK_BANNERS: Banner[] = [
  { id: 'B-1', title: 'Khuyến mãi eSIM Du lịch hè 2026',          description: 'Giảm đến 30% gói eSIM cho 200+ quốc gia, áp dụng tới 30/06.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=320&fit=crop', linkUrl: '/products?category=esim-du-lich',     position: 'hero',      sortOrder: 1, status: 'active',   createdAt: '2026-04-01T08:00:00Z' },
  { id: 'B-2', title: 'eSIM Nhật Bản giảm 30%',                   description: 'Gói 7 ngày 10GB chỉ còn 299.000đ.',                              image: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=800&h=320&fit=crop', linkUrl: '/products/esim-nhat-ban-7-ngay-10gb', position: 'hero',      sortOrder: 2, status: 'active',   createdAt: '2026-04-05T10:30:00Z' },
  { id: 'B-3', title: 'Thẻ Game Garena ưu đãi 5%',                description: 'Áp dụng cho mọi mệnh giá, giao mã tức thì.',                     image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=320&fit=crop', linkUrl: '/products?category=the-game',         position: 'promotion', sortOrder: 3, status: 'active',   createdAt: '2026-04-12T14:15:00Z' },
  { id: 'B-4', title: 'Data 4G Viettel siêu rẻ chỉ 50K/tháng',    description: 'Đăng ký nhanh, nạp ngay, không hợp đồng.',                       image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&h=320&fit=crop', linkUrl: '/products?category=data-4g-5g',       position: 'promotion', sortOrder: 4, status: 'inactive', createdAt: '2026-03-20T09:00:00Z' },
  { id: 'B-5', title: 'Khám phá Châu Âu cùng eSIM toàn cầu',      description: 'Một SIM dùng được 30 nước châu Âu, 5G tốc độ cao.',              image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=320&fit=crop', linkUrl: '/products?category=esim-chau-au',     position: 'sidebar',   sortOrder: 5, status: 'active',   createdAt: '2026-05-02T11:45:00Z' },
  { id: 'B-6', title: 'Banner Tết 2026 (đã ngừng)',                description: 'Chiến dịch Tết âm lịch 2026 đã kết thúc.',                       image: 'https://images.unsplash.com/photo-1547481887-a26e2cacb5b2?w=800&h=320&fit=crop',                                                  position: 'footer',    sortOrder: 6, status: 'inactive', createdAt: '2026-01-25T07:30:00Z' },
]

let mockData = [...MOCK_BANNERS]

// ─── API ──────────────────────────────────────────────────────────────────────

export const bannerApi = {
  getAll: () =>
    withDevFallback(
      () => authRequest<BannersResponse>('/api/admin/banners'),
      () => {
        const data = [...mockData].sort((a, b) => a.sortOrder - b.sortOrder)
        return { data, total: data.length } satisfies BannersResponse
      },
    ),

  getById: (id: string) =>
    withDevFallback(
      () => authRequest<Banner>(`/api/admin/banners/${id}`),
      () => {
        const b = mockData.find((b) => b.id === id)
        if (!b) throw Object.assign(new Error('Không tìm thấy banner'), { status: 404 })
        return { ...b }
      },
    ),

  create: (data: BannerFormData) =>
    withDevFallback(
      () => authRequest<Banner>('/api/admin/banners', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => {
        const newBanner: Banner = {
          id: `B-${Date.now()}`,
          title: data.title,
          description: data.description,
          image: data.image,
          linkUrl: data.linkUrl,
          position: data.position,
          sortOrder: data.sortOrder,
          status: data.status,
          createdAt: new Date().toISOString(),
        }
        mockData = [...mockData, newBanner]
        return { ...newBanner }
      },
    ),

  update: (id: string, data: BannerFormData) =>
    withDevFallback(
      () => authRequest<Banner>(`/api/admin/banners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      () => {
        mockData = mockData.map((b) =>
          b.id === id
            ? {
                ...b,
                title: data.title,
                description: data.description,
                image: data.image,
                linkUrl: data.linkUrl,
                position: data.position,
                sortOrder: data.sortOrder,
                status: data.status,
              }
            : b
        )
        const updated = mockData.find((b) => b.id === id)
        if (!updated) throw Object.assign(new Error('Không tìm thấy banner'), { status: 404 })
        return { ...updated }
      },
    ),

  delete: (id: string) =>
    withDevFallback(
      () => authRequest<void>(`/api/admin/banners/${id}`, { method: 'DELETE' }),
      () => { mockData = mockData.filter((b) => b.id !== id) },
    ),

  toggle: (id: string) =>
    withDevFallback(
      () => authRequest<Banner>(`/api/admin/banners/${id}/toggle`, { method: 'PATCH' }),
      () => {
        const b = mockData.find((b) => b.id === id)
        if (!b) throw Object.assign(new Error('Không tìm thấy banner'), { status: 404 })
        b.status = b.status === 'active' ? 'inactive' : 'active'
        return { ...b }
      },
    ),

  reorder: (orderedIds: string[]) =>
    withDevFallback(
      () => authRequest<BannersResponse>('/api/admin/banners/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ orderedIds }),
      }),
      () => {
        mockData = mockData.map((b) => {
          const idx = orderedIds.indexOf(b.id)
          return idx === -1 ? b : { ...b, sortOrder: idx + 1 }
        })
        const data = [...mockData].sort((a, b) => a.sortOrder - b.sortOrder)
        return { data, total: data.length } satisfies BannersResponse
      },
    ),
}
