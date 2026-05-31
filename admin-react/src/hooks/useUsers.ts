import { useState, useCallback } from 'react'
import {
  type AppUser,
  type Role,
  type Permission,
  type UserStatus
} from '../types/user'

const USERS_KEY = 'ezsim_users'
const ROLES_KEY = 'ezsim_roles'
const PERMISSIONS_KEY = 'ezsim_permissions'

// ─── INITIAL PERMISSIONS ─────────────────────────────────────────────────────
const initialPermissions: Permission[] = [
  { id: 'PERM-001', name: 'Xem đơn hàng', code: 'orders.view', module: 'Orders', description: 'Cho phép xem danh sách và chi tiết đơn hàng', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-002', name: 'Quản lý đơn hàng', code: 'orders.manage', module: 'Orders', description: 'Cho phép cập nhật trạng thái, hủy, và xuất kho đơn hàng', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-003', name: 'Xem sản phẩm', code: 'products.view', module: 'Products', description: 'Cho phép xem danh sách và chi tiết gói eSIM', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-004', name: 'Quản lý sản phẩm', code: 'products.manage', module: 'Products', description: 'Cho phép thêm, sửa, xóa gói eSIM viễn thông', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-005', name: 'Xem cổng thanh toán', code: 'payments.view', module: 'Payments', description: 'Cho phép xem cấu hình cổng và lịch sử giao dịch', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-006', name: 'Quản lý thanh toán', code: 'payments.manage', module: 'Payments', description: 'Cho phép cấu hình, kích hoạt cổng và thực hiện hoàn tiền', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-007', name: 'Xem kho hàng', code: 'inventory.view', module: 'Inventory', description: 'Cho phép xem phôi SIM và eSIM trong kho', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-008', name: 'Quản lý kho hàng', code: 'inventory.manage', module: 'Inventory', description: 'Cho phép nhập kho, xuất kho và cập nhật trạng thái phôi', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-009', name: 'Xem đối tác API', code: 'providers.view', module: 'Providers', description: 'Cho phép xem thông tin đối tác Wholesaler và nhật ký API', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-010', name: 'Quản lý đối tác API', code: 'providers.manage', module: 'Providers', description: 'Cho phép cấu hình API Key và reprovision eSIM', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-011', name: 'Xem khách hàng', code: 'customers.view', module: 'Customers', description: 'Cho phép xem thông tin hồ sơ khách hàng', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-012', name: 'Quản lý khách hàng', code: 'customers.manage', module: 'Customers', description: 'Cho phép khóa tài khoản và chỉnh sửa hồ sơ khách', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-013', name: 'Quản lý phân quyền', code: 'roles.manage', module: 'Users', description: 'Cho phép tạo, sửa vai trò và phân quyền hệ thống', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-014', name: 'Quản lý người dùng', code: 'users.manage', module: 'Users', description: 'Cho phép thêm, kích hoạt, khóa tài khoản quản trị viên', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-015', name: 'Xem báo cáo', code: 'reports.view', module: 'Reports', description: 'Cho phép xem thống kê doanh thu và báo cáo phân tích', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'PERM-016', name: 'Quản lý danh mục', code: 'categories.manage', module: 'Products', description: 'Cho phép thêm sửa xóa danh mục sản phẩm viễn thông', createdAt: '2026-01-01T00:00:00Z' },
]

// ─── INITIAL ROLES ────────────────────────────────────────────────────────────
const initialRoles: Role[] = [
  {
    id: 'ROLE-SUPERADMIN',
    name: 'Super Administrator',
    code: 'super_admin',
    description: 'Toàn quyền quản trị hệ thống. Không bị giới hạn bởi bất kỳ ràng buộc nào.',
    createdAt: '2026-01-01T00:00:00Z',
    permissionIds: initialPermissions.map(p => p.id) // all permissions
  },
  {
    id: 'ROLE-ADMIN',
    name: 'Administrator',
    code: 'admin',
    description: 'Quản trị viên cấp cao. Có thể quản lý tất cả nghiệp vụ nhưng không phân quyền được user khác.',
    createdAt: '2026-01-15T00:00:00Z',
    permissionIds: ['PERM-001', 'PERM-002', 'PERM-003', 'PERM-004', 'PERM-005', 'PERM-006', 'PERM-007', 'PERM-008', 'PERM-009', 'PERM-010', 'PERM-011', 'PERM-015', 'PERM-016']
  },
  {
    id: 'ROLE-OPERATOR',
    name: 'Operations Staff',
    code: 'operator',
    description: 'Nhân viên vận hành. Xử lý đơn hàng, kho hàng và hỗ trợ khách hàng hàng ngày.',
    createdAt: '2026-02-01T00:00:00Z',
    permissionIds: ['PERM-001', 'PERM-002', 'PERM-003', 'PERM-007', 'PERM-008', 'PERM-011', 'PERM-015']
  },
  {
    id: 'ROLE-FINANCE',
    name: 'Finance Manager',
    code: 'finance',
    description: 'Quản lý tài chính. Chịu trách nhiệm theo dõi giao dịch thanh toán và đối soát.',
    createdAt: '2026-02-10T00:00:00Z',
    permissionIds: ['PERM-001', 'PERM-005', 'PERM-006', 'PERM-015']
  },
  {
    id: 'ROLE-VIEWER',
    name: 'Read-Only Viewer',
    code: 'viewer',
    description: 'Chỉ xem báo cáo và thống kê. Không có quyền thao tác dữ liệu.',
    createdAt: '2026-03-01T00:00:00Z',
    permissionIds: ['PERM-001', 'PERM-003', 'PERM-005', 'PERM-007', 'PERM-009', 'PERM-011', 'PERM-015']
  }
]

// ─── INITIAL USERS ────────────────────────────────────────────────────────────
const initialUsers: AppUser[] = [
  {
    id: 'USR-001',
    email: 'superadmin@ezsim.vn',
    phoneNumber: '0901234567',
    fullName: 'Nguyễn Văn Hùng',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    status: 1,
    emailConfirmed: true,
    phoneConfirmed: true,
    lastLoginAt: '2026-05-26T10:15:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    roles: ['ROLE-SUPERADMIN']
  },
  {
    id: 'USR-002',
    email: 'admin@ezsim.vn',
    phoneNumber: '0907654321',
    fullName: 'Trần Thị Lan',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    status: 1,
    emailConfirmed: true,
    phoneConfirmed: true,
    lastLoginAt: '2026-05-25T18:45:00Z',
    createdAt: '2026-01-15T00:00:00Z',
    roles: ['ROLE-ADMIN']
  },
  {
    id: 'USR-003',
    email: 'ops1@ezsim.vn',
    phoneNumber: '0912345678',
    fullName: 'Lê Minh Tuấn',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    status: 1,
    emailConfirmed: true,
    phoneConfirmed: false,
    lastLoginAt: '2026-05-26T08:00:00Z',
    createdAt: '2026-02-01T00:00:00Z',
    roles: ['ROLE-OPERATOR']
  },
  {
    id: 'USR-004',
    email: 'finance@ezsim.vn',
    phoneNumber: '0923456789',
    fullName: 'Phạm Thị Hương',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    status: 1,
    emailConfirmed: true,
    phoneConfirmed: true,
    lastLoginAt: '2026-05-24T14:30:00Z',
    createdAt: '2026-02-10T00:00:00Z',
    roles: ['ROLE-FINANCE']
  },
  {
    id: 'USR-005',
    email: 'ops2@ezsim.vn',
    phoneNumber: '0934567890',
    fullName: 'Hoàng Đức Bình',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    status: 1,
    emailConfirmed: false,
    phoneConfirmed: false,
    lastLoginAt: '2026-05-20T09:00:00Z',
    createdAt: '2026-03-05T00:00:00Z',
    roles: ['ROLE-OPERATOR']
  },
  {
    id: 'USR-006',
    email: 'viewer@ezsim.vn',
    phoneNumber: '0945678901',
    fullName: 'Vũ Thị Nga',
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
    status: 0,
    emailConfirmed: true,
    phoneConfirmed: true,
    lastLoginAt: '2026-04-10T11:20:00Z',
    createdAt: '2026-03-01T00:00:00Z',
    roles: ['ROLE-VIEWER']
  },
  {
    id: 'USR-007',
    email: 'blocked@ezsim.vn',
    phoneNumber: '0956789012',
    fullName: 'Đỗ Quang Vinh',
    avatarUrl: 'https://i.pravatar.cc/150?img=22',
    status: 2,
    emailConfirmed: true,
    phoneConfirmed: false,
    lastLoginAt: '2026-03-15T07:00:00Z',
    createdAt: '2026-02-20T00:00:00Z',
    roles: ['ROLE-OPERATOR']
  }
]

// ─── HOOK ─────────────────────────────────────────────────────────────────────
const loadFromStorage = <T>(key: string, fallback: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

export const useUsers = () => {
  const [users, setUsers] = useState<AppUser[]>(() =>
    loadFromStorage(USERS_KEY, initialUsers)
  )
  const [roles, setRoles] = useState<Role[]>(() =>
    loadFromStorage(ROLES_KEY, initialRoles)
  )
  const [permissions] = useState<Permission[]>(() =>
    loadFromStorage(PERMISSIONS_KEY, initialPermissions)
  )

  const saveUsers = (data: AppUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(data))
    setUsers(data)
  }
  const saveRoles = (data: Role[]) => {
    localStorage.setItem(ROLES_KEY, JSON.stringify(data))
    setRoles(data)
  }

  // ── User actions ────────────────────────────────────────────────────────────
  const updateUserStatus = useCallback((id: string, status: UserStatus) => {
    saveUsers(users.map(u => u.id === id ? { ...u, status } : u))
  }, [users])

  const updateUserRoles = useCallback((userId: string, roleIds: string[]) => {
    saveUsers(users.map(u => u.id === userId ? { ...u, roles: roleIds } : u))
  }, [users])

  const addUser = useCallback((userData: Omit<AppUser, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    const newUser: AppUser = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: ''
    }
    saveUsers([...users, newUser])
  }, [users])

  const deleteUser = useCallback((id: string) => {
    saveUsers(users.filter(u => u.id !== id))
  }, [users])

  // ── Role actions ─────────────────────────────────────────────────────────────
  const addRole = useCallback((roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: `ROLE-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString()
    }
    saveRoles([...roles, newRole])
  }, [roles])

  const updateRole = useCallback((id: string, data: Partial<Role>) => {
    saveRoles(roles.map(r => r.id === id ? { ...r, ...data } : r))
  }, [roles])

  const deleteRole = useCallback((id: string) => {
    saveRoles(roles.filter(r => r.id !== id))
  }, [roles])

  const toggleRolePermission = useCallback((roleId: string, permId: string) => {
    saveRoles(roles.map(r => {
      if (r.id !== roleId) return r
      const has = r.permissionIds.includes(permId)
      return {
        ...r,
        permissionIds: has
          ? r.permissionIds.filter(p => p !== permId)
          : [...r.permissionIds, permId]
      }
    }))
  }, [roles])

  return {
    users,
    roles,
    permissions,
    updateUserStatus,
    updateUserRoles,
    addUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    toggleRolePermission
  }
}
