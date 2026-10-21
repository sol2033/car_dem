import { createContext, useContext } from 'react'
import type { User } from '../../../entities/user/model/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (value === null) {
    throw new Error('useAuth нужно использовать внутри AuthProvider')
  }
  return value
}
