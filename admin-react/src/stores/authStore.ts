import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApi, type AuthUser } from '@/api/authApi'

const ADMIN_ROLES = ['admin', 'staff'] as const
type AdminRole = (typeof ADMIN_ROLES)[number]

const isAdminRole = (role: string): role is AdminRole =>
  ADMIN_ROLES.includes(role as AdminRole)

// Dev-only mock accounts (ignored in production builds)
const DEV_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  'admin@ezsim.vn': {
    password: 'admin123',
    user: { id: 'dev-1', name: 'Admin EZSIM', email: 'admin@ezsim.vn', role: 'admin' },
  },
  'staff@ezsim.vn': {
    password: 'staff123',
    user: { id: 'dev-2', name: 'Staff EZSIM', email: 'staff@ezsim.vn', role: 'staff' },
  },
  'customer@ezsim.vn': {
    password: 'customer123',
    user: { id: 'dev-3', name: 'Customer Test', email: 'customer@ezsim.vn', role: 'customer' },
  },
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      initialized: false,

      login: async (email, password) => {
        // Dev mock — active when backend is not running (network error only)
        if (import.meta.env.DEV) {
          const mock = DEV_ACCOUNTS[email]
          if (mock && mock.password === password) {
            if (!isAdminRole(mock.user.role)) {
              throw new Error('Tài khoản không có quyền truy cập trang quản trị')
            }
            set({ user: mock.user, token: 'dev-mock-token' })
            return
          }
          if (mock && mock.password !== password) {
            throw new Error('Sai mật khẩu')
          }
        }

        const { token, user } = await authApi.login(email, password)
        if (!isAdminRole(user.role)) {
          throw new Error('Tài khoản không có quyền truy cập trang quản trị')
        }
        set({ user, token })
      },

      logout: () => {
        set({ user: null, token: null })
      },

      // Called once on app mount to verify stored token is still valid
      initialize: async () => {
        const { token, user } = get()
        if (!token) {
          set({ initialized: true })
          return
        }
        // Skip API verification for dev mock token
        if (import.meta.env.DEV && token === 'dev-mock-token' && user) {
          set({ initialized: true })
          return
        }
        try {
          const freshUser = await authApi.me(token)
          if (!isAdminRole(freshUser.role)) {
            set({ user: null, token: null, initialized: true })
            return
          }
          set({ user: freshUser, initialized: true })
        } catch {
          // Token expired or invalid — clear session silently
          set({ user: null, token: null, initialized: true })
        }
      },
    }),
    {
      name: '__ADMIN_AUTH__',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)

// Standalone getter — use in non-hook contexts (event handlers, interceptors)
export const isAuthenticated = () => {
  const { user, token } = useAuthStore.getState()
  return !!user && !!token
}
