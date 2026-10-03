export type DamageType = 'Скол' | 'Вмятина' | 'Царапина' | 'Трещина'

export type DamageSeverity = 'Лёгкая' | 'Средняя' | 'Сильная'

export interface Car {
  brand: string
  model: string
  year: number
}

export interface DamageBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Damage {
  id: number
  type: DamageType
  severity: DamageSeverity
  comment: string
  photo?: string
  box?: DamageBox
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Assessment {
  id: number
  car: Car
  createdAt: string
  damages: Damage[]
  userId: number
  photos: string[]
}
