import { useAuthStore } from '@/stores/authStore'
import type { Product, ProductFormData, ProductsResponse } from '@/types/product'

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

const MOCK_PRODUCTS: Product[] = [
  { id: '1',  name: 'eSIM Nhật Bản 7 ngày 10GB',   sku: 'ESIM-JP-7D-10G',  image: null, categoryId: '1', categoryName: 'eSIM Du lịch',   price: 350_000, salePrice: 299_000, stock: 120, status: 'active',   createdAt: '2024-01-15T08:00:00Z' },
  { id: '2',  name: 'eSIM Hàn Quốc 5 ngày 3GB',    sku: 'ESIM-KR-5D-3G',   image: null, categoryId: '1', categoryName: 'eSIM Du lịch',   price: 250_000, salePrice: null,     stock: 85,  status: 'active',   createdAt: '2024-01-16T09:00:00Z' },
  { id: '3',  name: 'eSIM Thái Lan 10 ngày 20GB',   sku: 'ESIM-TH-10D-20G', image: null, categoryId: '1', categoryName: 'eSIM Du lịch',   price: 420_000, salePrice: 380_000, stock: 60,  status: 'active',   createdAt: '2024-01-18T10:00:00Z' },
  { id: '4',  name: 'eSIM Singapore 7 ngày 5GB',    sku: 'ESIM-SG-7D-5G',   image: null, categoryId: '1', categoryName: 'eSIM Du lịch',   price: 320_000, salePrice: null,     stock: 45,  status: 'inactive', createdAt: '2024-01-20T08:00:00Z' },
  { id: '5',  name: 'Thẻ Viettel 50.000đ',          sku: 'CARD-VTL-50K',    image: null, categoryId: '2', categoryName: 'Thẻ Viễn thông', price:  50_000, salePrice:  48_000, stock: 500, status: 'active',   createdAt: '2024-02-01T07:00:00Z' },
  { id: '6',  name: 'Thẻ Viettel 100.000đ',         sku: 'CARD-VTL-100K',   image: null, categoryId: '2', categoryName: 'Thẻ Viễn thông', price: 100_000, salePrice:  95_000, stock: 300, status: 'active',   createdAt: '2024-02-01T07:30:00Z' },
  { id: '7',  name: 'Thẻ Mobifone 200.000đ',        sku: 'CARD-MBF-200K',   image: null, categoryId: '2', categoryName: 'Thẻ Viễn thông', price: 200_000, salePrice: null,     stock: 150, status: 'active',   createdAt: '2024-02-05T08:00:00Z' },
  { id: '8',  name: 'Thẻ Garena 100.000đ',          sku: 'CARD-GRN-100K',   image: null, categoryId: '3', categoryName: 'Thẻ Game',       price: 100_000, salePrice: null,     stock: 200, status: 'active',   createdAt: '2024-02-10T09:00:00Z' },
  { id: '9',  name: 'Thẻ Garena 200.000đ',          sku: 'CARD-GRN-200K',   image: null, categoryId: '3', categoryName: 'Thẻ Game',       price: 200_000, salePrice: 185_000, stock: 0,   status: 'inactive', createdAt: '2024-02-12T09:00:00Z' },
  { id: '10', name: 'Thẻ Liên Quân 50.000đ',        sku: 'CARD-LQ-50K',     image: null, categoryId: '3', categoryName: 'Thẻ Game',       price:  50_000, salePrice: null,     stock: 80,  status: 'active',   createdAt: '2024-02-15T08:00:00Z' },
  { id: '11', name: 'Data Viettel 4G 30 ngày 30GB', sku: 'DATA-VTL-30D-30G',image: null, categoryId: '4', categoryName: 'Data 4G/5G',     price: 120_000, salePrice: 110_000, stock: 999, status: 'active',   createdAt: '2024-03-01T07:00:00Z' },
  { id: '12', name: 'Data Mobifone 5G 7 ngày 50GB', sku: 'DATA-MBF-7D-50G', image: null, categoryId: '4', categoryName: 'Data 4G/5G',     price:  89_000, salePrice: null,     stock: 0,   status: 'inactive', createdAt: '2024-03-05T08:00:00Z' },
]

let mockData = [...MOCK_PRODUCTS]

async function withDevFallback<T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> {
  if (!import.meta.env.DEV) return apiFn()
  try { return await apiFn() } catch { return mockFn() }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const productApi = {
  getAll: () =>
    withDevFallback(
      () => authRequest<ProductsResponse>('/api/admin/products'),
      () => ({ data: mockData, total: mockData.length }),
    ),

  delete: (id: string) =>
    withDevFallback(
      () => authRequest<void>(`/api/admin/products/${id}`, { method: 'DELETE' }),
      () => { mockData = mockData.filter((p) => p.id !== id) },
    ),

  toggle: (id: string) =>
    withDevFallback(
      () => authRequest<Product>(`/api/admin/products/${id}/toggle`, { method: 'PATCH' }),
      () => {
        const p = mockData.find((p) => p.id === id)
        if (p) p.status = p.status === 'active' ? 'inactive' : 'active'
        return { ...p! }
      },
    ),

  create: (data: ProductFormData) =>
    withDevFallback(
      () => authRequest<Product>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => {
        const categories: Record<string, string> = {
          '1': 'eSIM Du lịch', '2': 'Thẻ Viễn thông', '3': 'Thẻ Game', '4': 'Data 4G/5G',
          '5': 'eSIM Châu Á', '6': 'eSIM Châu Âu', '7': 'Thẻ Garena', '8': 'Thẻ Viettel',
        }
        const newProduct: Product = {
          id: String(Date.now()),
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          image: data.thumbnail ?? null,
          images: data.images ?? [],
          categoryId: data.categoryId,
          categoryName: categories[data.categoryId] ?? data.categoryId,
          shortDescription: data.shortDescription,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice ?? null,
          stock: data.stock,
          featured: data.featured,
          status: data.status,
          createdAt: new Date().toISOString(),
        }
        mockData = [...mockData, newProduct]
        return { ...newProduct }
      },
    ),

  getById: (id: string) =>
    withDevFallback(
      () => authRequest<Product>(`/api/admin/products/${id}`),
      () => {
        const p = mockData.find((p) => p.id === id)
        if (!p) throw new Error('Không tìm thấy sản phẩm')
        return { ...p }
      },
    ),

  update: (id: string, data: ProductFormData) =>
    withDevFallback(
      () => authRequest<Product>(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      () => {
        const categories: Record<string, string> = {
          '1': 'eSIM Du lịch', '2': 'Thẻ Viễn thông', '3': 'Thẻ Game', '4': 'Data 4G/5G',
          '5': 'eSIM Châu Á', '6': 'eSIM Châu Âu', '7': 'Thẻ Garena', '8': 'Thẻ Viettel',
        }
        mockData = mockData.map((p) =>
          p.id === id
            ? {
                ...p,
                name: data.name,
                slug: data.slug,
                sku: data.sku,
                image: data.thumbnail ?? p.image,
                images: data.images ?? p.images,
                categoryId: data.categoryId,
                categoryName: categories[data.categoryId] ?? data.categoryId,
                shortDescription: data.shortDescription,
                description: data.description,
                price: data.price,
                salePrice: data.salePrice ?? null,
                stock: data.stock,
                featured: data.featured,
                status: data.status,
              }
            : p
        )
        const updated = mockData.find((p) => p.id === id)
        if (!updated) throw new Error('Không tìm thấy sản phẩm')
        return { ...updated }
      },
    ),
}
