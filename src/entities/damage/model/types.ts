export type DamageType = 'Скол' | 'Вмятина' | 'Царапина' | 'Трещина'

export type DamageSeverity = 'Лёгкая' | 'Средняя' | 'Сильная'

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
