import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest } from '../../../entities/user/api/authApi'
import type { User } from '../../../entities/user/model/types'
import { clearTokens, getAccessToken } from '../../../shared/api/tokens'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  // если токена нет, пользователя не нужно загружать
  const [loading, setLoading] = useState(getAccessToken() !== null)

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null)
    }
    window.addEventListener('session-expired', handleSessionExpired)
    return () => window.removeEventListener('session-expired', handleSessionExpired)
  }, [])

  useEffect(() => {
    if (getAccessToken() === null) {
      return
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(clearTokens)
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    await loginRequest(email, password)
    setUser(await fetchCurrentUser())
  }

  async function logout() {
    setUser(null)
    await logoutRequest().catch(() => {})
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
