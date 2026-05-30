export type CustomerStatus = 'active' | 'inactive' | 'blocked'

export interface Customer {
  id: string
  fullName: string
  email: string
  phone: string
  orderCount: number
  totalSpent: number
  status: CustomerStatus
  createdAt: string  // ISO 8601
}

export interface CustomersResponse {
  data: Customer[]
  total: number
}

export interface CustomerDetail extends Customer {
  address?: string
  city?: string
  note?: string
  lastLoginAt?: string
}
