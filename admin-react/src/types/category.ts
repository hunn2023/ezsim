export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image: string | null
  parentId: string | null
  parentName: string | null
  status: 'active' | 'inactive'
  productCount: number
  createdAt: string
}

export interface CategoriesResponse {
  data: Category[]
  total: number
}
