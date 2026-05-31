export interface PostCategory {
  id: string
  name: string
  slug: string
  description: string
  displayOrder: number
  status: number // 1 = Active, 0 = Inactive
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  categoryId: string | null
  categoryName?: string // Helper property
  authorId: string
  authorName: string // Helper property
  title: string
  slug: string
  summary: string
  content: string
  thumbnailUrl: string | null
  status: number // 0 = Draft, 1 = Published, 2 = Archived
  sortOrder: number
  endDate: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface StaticPage {
  id: string
  title: string
  slug: string
  content: string
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
}
