import { useEffect } from 'react'
import { LayoutProvider } from '@/context/useLayoutContext'
import { NotificationProvider } from '@/context/useNotificationContext'
import { useAuthStore } from '@/stores/authStore'
import { type ChildrenType } from '@/types'

// Verifies stored token against /api/auth/me once on app mount.
// Sets initialized: true so ProtectedRoute knows auth state is ready.
const AuthInitializer = ({ children }: ChildrenType) => {
  const initialize = useAuthStore((s) => s.initialize)
  useEffect(() => {
    void initialize()
  }, [initialize])
  return <>{children}</>
}

const AppWrapper = ({ children }: ChildrenType) => {
  return (
    <AuthInitializer>
      <LayoutProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </LayoutProvider>
    </AuthInitializer>
  )
}

export default AppWrapper
