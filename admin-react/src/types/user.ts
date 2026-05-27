export type UserStatus = 0 | 1 | 2 // 0: Inactive, 1: Active, 2: Banned

export interface AppUser {
  id: string
  email: string
  phoneNumber: string
  fullName: string
  avatarUrl: string
  status: UserStatus
  emailConfirmed: boolean
  phoneConfirmed: boolean
  lastLoginAt: string
  createdAt: string
  roles: string[] // Role IDs
}

export interface Role {
  id: string
  name: string
  code: string
  description: string
  createdAt: string
  permissionIds: string[] // Permission IDs
}

export interface Permission {
  id: string
  name: string
  code: string // e.g. "orders.view", "payments.manage"
  module: string // e.g. "Orders", "Payments"
  description: string
  createdAt: string
}

export interface UserRole {
  userId: string
  roleId: string
  assignedAt: string
}

export interface RolePermission {
  roleId: string
  permissionId: string
  grantedAt: string
}
