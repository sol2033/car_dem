import { clearTokens, getAccessToken, getRefreshToken, saveAccessToken } from './tokens'

const API_URL = 'http://127.0.0.1:8000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function send(path: string, options: RequestInit): Promise<Response> {
  const headers = new Headers(options.headers)
  const accessToken = getAccessToken()
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return fetch(API_URL + path, { ...options, headers })
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return false
  }

  const response = await fetch(API_URL + '/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!response.ok) {
    clearTokens()
    return false
  }

  const data = await response.json()
  saveAccessToken(data.access_token)
  return true
}

async function getErrorMessage(response: Response): Promise<string> {
  const data = await response.json().catch(() => null)
  if (data && typeof data.detail === 'string') {
    return data.detail
  }
  return 'Не удалось выполнить запрос'
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response = await send(path, options)

  // access token мог истечь: пробуем обновить его и повторить запрос один раз
  if (response.status === 401 && getAccessToken() && (await refreshAccessToken())) {
    response = await send(path, options)
  }

  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json()
}

export function postJson<T>(path: string, body: object): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
