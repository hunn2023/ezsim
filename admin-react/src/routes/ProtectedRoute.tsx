import Loader from '@/components/Loader'
import { useAuthStore } from '@/stores/authStore'
import { Navigate, Outlet, useLocation } from 'react-router'

const ProtectedRoute = () => {
  const { user, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized) return <Loader height="100vh" />

  if (!user) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  // Customer accounts are blocked even if somehow authenticated
  if (user.role === 'customer') {
    return <Navigate to="/error/403" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
