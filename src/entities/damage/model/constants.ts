import type { DamageSeverity, DamageType } from './types'

export const damageTypes: DamageType[] = ['Скол', 'Вмятина', 'Царапина', 'Трещина']

export const damageSeverities: DamageSeverity[] = ['Лёгкая', 'Средняя', 'Сильная']

export const damageColors: Record<DamageType, string> = {
  Скол: 'orange',
  Вмятина: 'red',
  Царапина: 'yellow',
  Трещина: 'blue',
}
