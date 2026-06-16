export type BannerStatus = 'active' | 'inactive'

export type BannerPosition = 'hero' | 'promotion' | 'sidebar' | 'footer'

export interface Banner {
  id: string
  title: string
  description?: string
  image: string
  linkUrl?: string
  position: BannerPosition
  sortOrder: number
  status: BannerStatus
  createdAt: string  // ISO 8601
}

export interface BannersResponse {
  data: Banner[]
  total: number
}
