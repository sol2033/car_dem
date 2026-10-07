export function validateRequired(value: string, message: string): string {
  if (value.trim() === '') {
    return message
  }
  return ''
}

export function validateEmail(email: string): string {
  if (email.trim() === '') {
    return 'Введите email'
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return 'Неверный формат email'
  }
  return ''
}
