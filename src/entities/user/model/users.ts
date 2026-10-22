import type { User } from './types'

export const currentUserId = 1

export const users: User[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', is_admin: true },
  { id: 2, name: 'Мария Смирнова', email: 'maria@example.com', is_admin: false },
  { id: 3, name: 'Алексей Кузнецов', email: 'alexey@example.com', is_admin: false },
]

export function getUserName(userId: number): string {
  const user = users.find((user) => user.id === userId)
  return user ? user.name : 'Неизвестный пользователь'
}
