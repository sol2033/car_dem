import { API_URL, request } from '../../../shared/api/client'
import type { Damage, DamageBox } from '../../damage/model/types'
import type { Assessment, Car } from '../model/types'

interface AssessmentResponse extends Car {
  id: number
  created_at: string
  user_id: number
  owner_name: string
  photos: { id: number; url: string }[]
  damages: (Omit<Damage, 'photo' | 'box'> & {
    photo_id: number | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  })[]
}

function toAssessment(data: AssessmentResponse): Assessment {
  return {
    id: data.id,
    car: { brand: data.brand, model: data.model, year: data.year },
    createdAt: data.created_at,
    userId: data.user_id,
    ownerName: data.owner_name,
    photos: data.photos.map((photo) => API_URL + photo.url),
    damages: data.damages.map((damage) => {
      const photo = data.photos.find((item) => item.id === damage.photo_id)
      let box: DamageBox | undefined
      if (damage.x !== null && damage.y !== null && damage.width !== null && damage.height !== null) {
        box = { x: damage.x, y: damage.y, width: damage.width, height: damage.height }
      }
      return {
        id: damage.id, type: damage.type, severity: damage.severity, comment: damage.comment,
        photo: photo ? API_URL + photo.url : undefined,
        box,
      }
    }),
  }
}

export async function fetchAssessments(all: boolean): Promise<Assessment[]> {
  const data = await request<AssessmentResponse[]>(all ? '/assessments/all' : '/assessments')
  return data.map(toAssessment)
}

export async function fetchAssessment(id: number): Promise<Assessment> {
  return toAssessment(await request<AssessmentResponse>('/assessments/' + id))
}

export async function createAssessment(car: Car, photos: File[]): Promise<Assessment> {
  const form = new FormData()
  form.append('brand', car.brand)
  form.append('model', car.model)
  form.append('year', String(car.year))
  photos.forEach((photo) => form.append('photos', photo))
  return toAssessment(await request<AssessmentResponse>('/assessments', { method: 'POST', body: form }))
}

export async function updateAssessment(id: number, car: Car): Promise<Assessment> {
  const data = await request<AssessmentResponse>('/assessments/' + id, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(car),
  })
  return toAssessment(data)
}

export function deleteAssessment(id: number): Promise<void> {
  return request('/assessments/' + id, { method: 'DELETE' })
}
