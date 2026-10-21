import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/model/AuthContext'
import LoadingState from '../shared/ui/LoadingState'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingState />
  }
  if (user === null) {
    return <Navigate to="/login" />
  }
  return <Outlet />
}

export default ProtectedRoute
