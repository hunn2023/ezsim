export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  image: string | null
  images: string[]
  categoryId: string
  categoryName: string
  shortDescription?: string
  description?: string
  price: number
  salePrice: number | null
  stock: number
  featured: boolean
  status: 'active' | 'inactive'
  createdAt: string
}

export interface ProductsResponse {
  data: Product[]
  total: number
}

export interface ProductFormData {
  name: string
  slug: string
  sku: string
  categoryId: string
  shortDescription?: string
  description?: string
  price: number
  salePrice?: number | null
  stock: number
  thumbnail?: string
  images?: string[]
  featured: boolean
  status: 'active' | 'inactive'
}
