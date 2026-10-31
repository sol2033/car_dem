import { clearTokens, getAccessToken, getRefreshToken, saveAccessToken } from './tokens'

export const API_URL = 'http://127.0.0.1:8000'

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
  if (Array.isArray(data?.detail)) {
    const fields: Record<string, string> = {
      brand: 'Марка', model: 'Модель', year: 'Год выпуска', comment: 'Комментарий',
      type: 'Тип повреждения', severity: 'Степень тяжести', email: 'Email',
      name: 'Имя', password: 'Пароль', photos: 'Фотографии',
    }
    return data.detail.map((error: { loc: (string | number)[] }) => {
      const field = String(error.loc[error.loc.length - 1])
      return (fields[field] || field) + ': проверьте введённое значение'
    }).join('. ')
  }
  return 'Не удалось выполнить запрос'
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await send(path, options)

    // access token мог истечь: пробуем обновить его и повторить запрос один раз
    if (response.status === 401 && getAccessToken() && (await refreshAccessToken())) {
      response = await send(path, options)
    }
  } catch {
    throw new Error('Нет связи с сервером. Проверьте, что backend запущен')
  }

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) {
      clearTokens()
      window.dispatchEvent(new Event('session-expired'))
    }
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
