export type DamageType = 'Скол' | 'Вмятина' | 'Царапина' | 'Трещина'

export type DamageLocation = 'Бампер' | 'Дверь' | 'Капот' | 'Крыло' | 'Крыша' | 'Багажник'

export type DamageSeverity = 'Лёгкая' | 'Средняя' | 'Сильная'

export interface Car {
  brand: string
  model: string
  year: number
}

export interface Damage {
  id: number
  type: DamageType
  location: DamageLocation
  severity: DamageSeverity
  comment: string
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
