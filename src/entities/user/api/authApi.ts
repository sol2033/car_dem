import { postJson, request } from '../../../shared/api/client'
import { clearTokens, getRefreshToken, saveTokens } from '../../../shared/api/tokens'
import type { User } from '../model/types'

interface TokensResponse {
  access_token: string
  refresh_token: string
}

export function register(name: string, email: string, password: string): Promise<User> {
  return postJson<User>('/auth/register', { name, email, password })
}

export async function login(email: string, password: string) {
  const tokens = await postJson<TokensResponse>('/auth/login', { email, password })
  saveTokens(tokens.access_token, tokens.refresh_token)
}

export function fetchCurrentUser(): Promise<User> {
  return request<User>('/auth/me')
}

export async function logout() {
  const refreshToken = getRefreshToken()
  clearTokens()
  if (refreshToken) {
    await postJson('/auth/logout', { refresh_token: refreshToken })
  }
}
