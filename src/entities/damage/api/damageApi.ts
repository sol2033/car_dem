import { postJson, request } from '../../../shared/api/client'
import type { Damage } from '../model/types'

export type DamageInput = Pick<Damage, 'type' | 'severity' | 'comment'>

export function createDamage(assessmentId: number, data: DamageInput): Promise<Damage> {
  return postJson('/assessments/' + assessmentId + '/damages', data)
}

export function updateDamage(id: number, data: DamageInput): Promise<Damage> {
  return request('/damages/' + id, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
}

export function deleteDamage(id: number): Promise<void> {
  return request('/damages/' + id, { method: 'DELETE' })
}
