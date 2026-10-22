import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/model/AuthContext'
import LoadingState from '../shared/ui/LoadingState'

interface ProtectedRouteProps {
  adminOnly?: boolean
}

function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingState />
  }
  if (user === null) {
    return <Navigate to="/login" />
  }
  if (adminOnly && !user.is_admin) {
    return <Navigate to="/dashboard" />
  }
  return <Outlet />
}

export default ProtectedRoute
