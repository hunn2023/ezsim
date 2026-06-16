import { useAuthStore } from '@/stores/authStore'
import type { CategoriesResponse, Category } from '@/types/category'

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  status: 'active' | 'inactive'
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

// ─── Dev mock ─────────────────────────────────────────────────────────────────

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'eSIM Du lịch', slug: 'esim-du-lich', image: null, parentId: null, parentName: null, status: 'active', productCount: 24, createdAt: '2024-01-10T08:00:00Z' },
  { id: '2', name: 'Thẻ Viễn thông', slug: 'the-vien-thong', image: null, parentId: null, parentName: null, status: 'active', productCount: 18, createdAt: '2024-01-12T09:30:00Z' },
  { id: '3', name: 'Thẻ Game', slug: 'the-game', image: null, parentId: null, parentName: null, status: 'active', productCount: 31, createdAt: '2024-01-15T10:00:00Z' },
  { id: '4', name: 'Data 4G/5G', slug: 'data-4g-5g', image: null, parentId: null, parentName: null, status: 'active', productCount: 12, createdAt: '2024-02-01T07:00:00Z' },
  { id: '5', name: 'eSIM Châu Á', slug: 'esim-chau-a', image: null, parentId: '1', parentName: 'eSIM Du lịch', status: 'active', productCount: 10, createdAt: '2024-02-05T08:00:00Z' },
  { id: '6', name: 'eSIM Châu Âu', slug: 'esim-chau-au', image: null, parentId: '1', parentName: 'eSIM Du lịch', status: 'inactive', productCount: 8, createdAt: '2024-02-10T08:00:00Z' },
  { id: '7', name: 'Thẻ Garena', slug: 'the-garena', image: null, parentId: '3', parentName: 'Thẻ Game', status: 'active', productCount: 5, createdAt: '2024-03-01T09:00:00Z' },
  { id: '8', name: 'Thẻ Viettel', slug: 'the-viettel', image: null, parentId: '2', parentName: 'Thẻ Viễn thông', status: 'inactive', productCount: 6, createdAt: '2024-03-15T10:00:00Z' },
]

let mockData = [...MOCK_CATEGORIES]

async function withDevFallback<T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try {
    return await apiFn()
  } catch {
    return mockFn()
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const categoryApi = {
  getAll: () =>
    withDevFallback(
      () => authRequest<CategoriesResponse>('/api/admin/categories'),
      () => ({ data: mockData, total: mockData.length }),
    ),

  delete: (id: string) =>
    withDevFallback(
      () => authRequest<void>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
      () => { mockData = mockData.filter((c) => c.id !== id) },
    ),

  toggle: (id: string) =>
    withDevFallback(
      () => authRequest<Category>(`/api/admin/categories/${id}/toggle`, { method: 'PATCH' }),
      () => {
        const cat = mockData.find((c) => c.id === id)
        if (cat) cat.status = cat.status === 'active' ? 'inactive' : 'active'
        return { ...cat! }
      },
    ),

  getById: (id: string) =>
    withDevFallback(
      () => authRequest<Category>(`/api/admin/categories/${id}`),
      () => {
        const cat = mockData.find((c) => c.id === id)
        if (!cat) throw new Error('Không tìm thấy danh mục')
        return { ...cat }
      },
    ),

  create: (data: CategoryFormData) =>
    withDevFallback(
      () => authRequest<Category>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => {
        const parent = data.parentId ? mockData.find((c) => c.id === data.parentId) : null
        const newCat: Category = {
          id: String(Date.now()),
          name: data.name,
          slug: data.slug,
          image: data.image ?? null,
          parentId: data.parentId ?? null,
          parentName: parent?.name ?? null,
          status: data.status,
          productCount: 0,
          createdAt: new Date().toISOString(),
        }
        mockData = [...mockData, newCat]
        return { ...newCat }
      },
    ),

  update: (id: string, data: CategoryFormData) =>
    withDevFallback(
      () => authRequest<Category>(`/api/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      () => {
        const parent = data.parentId ? mockData.find((c) => c.id === data.parentId) : null
        mockData = mockData.map((c) =>
          c.id === id
            ? { ...c, ...data, parentName: parent?.name ?? null }
            : c
        )
        return { ...mockData.find((c) => c.id === id)! }
      },
    ),
}
