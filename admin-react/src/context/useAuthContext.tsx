import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { type ChildrenType } from '@/types'

interface AuthUser {
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = '__ADMIN_AUTH__'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const useAuthContext = () => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuthContext can only be used within AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }: ChildrenType) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored) as AuthUser)
    } catch {
      // ignore malformed storage
    }
    setInitialized(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Mock — replace with real API call when backend is ready
    if (email === 'admin@ezsim.vn' && password === 'admin123') {
      const authUser: AuthUser = { name: 'Admin EZSIM', email, role: 'admin' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
      setUser(authUser)
    } else {
      throw new Error('Email hoặc mật khẩu không đúng')
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ user, isAuthenticated: !!user, initialized, login, logout }),
        [user, initialized, login, logout],
      )}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuthContext }
